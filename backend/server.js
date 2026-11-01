const fs = require("fs");
const path = require("path");
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
      max: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MILLIS || '30000', 10),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT_MILLIS || '15000', 10),
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER || process.env.USER,
      password: process.env.DB_PASSWORD || undefined,
      database: process.env.DB_NAME || 'apple_store_db',
      max: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MILLIS || '30000', 10),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT_MILLIS || '15000', 10),
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    });

pool.on('error', (err) => {
  console.error('[PostgreSQL Pool Error]:', err);
});

const db = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool
};

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW() as current_time, current_database() as database');
    res.json({
      status: 'healthy',
      system: 'Apple Store Management System API (Apple StoreOS)',
      db_connected: true,
      server_time: result.rows[0].current_time,
      database: result.rows[0].database,
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'degraded',
      db_connected: false,
      error: error.message
    });
  }
});

const api = express.Router();

api.get('/stores', async (req, res, next) => {
  try {
    const query = `
      SELECT 
        s.store_id,
        s.store_name,
        s.store_name AS name,
        s.store_id AS store_code,
        s.city,
        s.country,
        s.tax_rate,
        s.flagship,
        s.phone,
        COALESCE(inv.total_inventory, 0) AS total_inventory,
        COALESCE(emp.total_staff, 0) AS total_staff
      FROM stores s
      LEFT JOIN (
        SELECT store_id, COUNT(*) AS total_inventory
        FROM inventory
        GROUP BY store_id
      ) inv ON s.store_id = inv.store_id
      LEFT JOIN (
        SELECT store_id, COUNT(*) AS total_staff
        FROM employees
        WHERE active = true
        GROUP BY store_id
      ) emp ON s.store_id = emp.store_id
      ORDER BY s.flagship DESC, s.store_name ASC
    `;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

api.get('/stores/performance', async (req, res, next) => {
  try {
    const query = `
      SELECT * FROM v_store_performance
      ORDER BY total_revenue DESC, total_inventory_units DESC
    `;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

api.get('/stores/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`
      SELECT 
        store_id, store_name, store_name AS name, store_id AS store_code, city, country, tax_rate, flagship, phone
      FROM stores WHERE store_id = $1
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: `Store ${id} not found.` });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

const getCategoriesHandler = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        c.category_id,
        c.category_name,
        c.category_name AS name,
        COUNT(p.product_id) AS product_count
      FROM category c
      LEFT JOIN products p ON c.category_id = p.category_id
      GROUP BY c.category_id, c.category_name
      ORDER BY c.category_id ASC
    `;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};
api.get('/categories', getCategoriesHandler);
api.get('/products/categories/list', getCategoriesHandler);

api.get('/products', async (req, res, next) => {
  try {
    const { category_id, search, store_id } = req.query;
    const params = [];
    
    let storeFilterClause = '';
    if (store_id) {
      params.push(store_id);
      storeFilterClause = ` WHERE store_id = $${params.length}`;
    }

    let query = `
      SELECT 
        p.product_id,
        p.name,
        p.category_id,
        c.category_name,
        c.category_name AS category_name,
        p.base_price,
        p.specs,
        p.image_url,
        p.launch_date,
        COALESCE(inv.total_units, 0) AS total_units,
        COALESCE(inv.in_stock_count, 0) AS in_stock_count,
        COALESCE(inv.reserved_count, 0) AS reserved_count,
        COALESCE(inv.sold_count, 0) AS sold_count,
        COALESCE(inv.in_repair_count, 0) AS in_repair_count
      FROM products p
      JOIN category c ON p.category_id = c.category_id
      LEFT JOIN (
        SELECT 
          product_id,
          COUNT(*) AS total_units,
          COUNT(CASE WHEN status = 'In Stock' THEN 1 END) AS in_stock_count,
          COUNT(CASE WHEN status = 'Reserved' THEN 1 END) AS reserved_count,
          COUNT(CASE WHEN status = 'Sold' THEN 1 END) AS sold_count,
          COUNT(CASE WHEN status = 'In Repair' THEN 1 END) AS in_repair_count
        FROM inventory
        ${storeFilterClause}
        GROUP BY product_id
      ) inv ON p.product_id = inv.product_id
      WHERE 1=1
    `;

    if (category_id) {
      params.push(category_id);
      query += ` AND p.category_id = $${params.length}`;
    }

    if (search) {
      params.push(search);
      query += ` AND (
        to_tsvector('english', p.name || ' ' || p.specs::text) @@ plainto_tsquery('english', $${params.length})
        OR p.name ILIKE '%' || $${params.length} || '%'
        OR c.category_name ILIKE '%' || $${params.length} || '%'
      )`;
    }

    query += ` ORDER BY p.product_id ASC`;

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

api.get('/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { store_id } = req.query;

    const productQuery = `
      SELECT 
        p.*,
        c.category_name,
        c.category_name AS name
      FROM products p
      JOIN category c ON p.category_id = c.category_id
      WHERE p.product_id = $1
    `;
    const { rows } = await db.query(productQuery, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: `Product ${id} not found.` });
    }

    let serialsQuery = `
      SELECT i.serial_number, i.status, i.store_id, st.store_name, st.store_name AS store_location, i.received_date, i.updated_at
      FROM inventory i
      JOIN stores st ON i.store_id = st.store_id
      WHERE i.product_id = $1
    `;
    const serialParams = [id];

    if (store_id) {
      serialParams.push(store_id);
      serialsQuery += ` AND i.store_id = $${serialParams.length}`;
    }

    serialsQuery += `
      ORDER BY 
        CASE i.status 
          WHEN 'In Stock' THEN 1 
          WHEN 'Reserved' THEN 2 
          WHEN 'In Repair' THEN 3 
          ELSE 4 
        END,
        i.serial_number ASC
    `;
    const serialsResult = await db.query(serialsQuery, serialParams);

    const product = rows[0];
    product.inventory_items = serialsResult.rows;

    res.json(product);
  } catch (error) {
    next(error);
  }
});

api.post('/products', async (req, res, next) => {
  try {
    const { product_id, name, category_id, base_price, specs = {}, image_url = '', launch_date } = req.body;

    if (!name || !category_id || base_price === undefined) {
      return res.status(400).json({ error: 'Bad Request', message: 'Name, category_id, and base_price are required.' });
    }

    const pId = product_id || `P-${Date.now().toString().slice(-4)}`;

    const query = `
      INSERT INTO products (product_id, name, category_id, base_price, specs, image_url, launch_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const { rows } = await db.query(query, [
      pId,
      name,
      category_id,
      base_price,
      typeof specs === 'string' ? specs : JSON.stringify(specs),
      image_url,
      launch_date || null
    ]);

    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
});

api.put('/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category_id, base_price, specs, image_url, launch_date } = req.body;

    const query = `
      UPDATE products
      SET 
        name = COALESCE($1, name),
        category_id = COALESCE($2, category_id),
        base_price = COALESCE($3, base_price),
        specs = COALESCE($4, specs),
        image_url = COALESCE($5, image_url),
        launch_date = COALESCE($6, launch_date),
        updated_at = CURRENT_TIMESTAMP
      WHERE product_id = $7
      RETURNING *
    `;

    const { rows } = await db.query(query, [
      name,
      category_id,
      base_price,
      specs ? (typeof specs === 'string' ? specs : JSON.stringify(specs)) : null,
      image_url,
      launch_date,
      id
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: `Product ${id} not found.` });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

api.get('/inventory', async (req, res, next) => {
  try {
    const { status, store_id, product_id, search } = req.query;
    let query = `
      SELECT 
        i.serial_number,
        i.product_id,
        p.name AS product_name,
        c.category_name,
        c.category_name AS category_name,
        p.base_price,
        p.specs,
        p.image_url,
        i.status,
        i.store_id,
        st.store_name,
        st.store_name AS store_location,
        st.store_id AS store_code,
        st.city AS store_city,
        i.received_date,
        i.updated_at
      FROM inventory i
      JOIN products p ON i.product_id = p.product_id
      JOIN category c ON p.category_id = c.category_id
      JOIN stores st ON i.store_id = st.store_id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND i.status = $${params.length}`;
    }

    if (store_id) {
      params.push(store_id);
      query += ` AND i.store_id = $${params.length}`;
    }

    if (product_id) {
      params.push(product_id);
      query += ` AND i.product_id = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (i.serial_number ILIKE $${params.length} OR p.name ILIKE $${params.length} OR st.store_name ILIKE $${params.length})`;
    }

    query += ` ORDER BY i.received_date DESC, i.serial_number ASC`;

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

api.get('/inventory/summary', async (req, res, next) => {
  try {
    const query = `SELECT * FROM v_inventory_summary ORDER BY product_id ASC`;
    const { rows } = await db.query(query);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

api.get('/inventory/by-product/:product_id', async (req, res, next) => {
  try {
    const { product_id } = req.params;
    const { store_id } = req.query;

    let query = `
      SELECT 
        i.serial_number,
        i.status,
        i.store_id,
        st.store_name,
        st.store_name AS store_location,
        st.store_id AS store_code,
        st.city AS store_city,
        i.received_date,
        i.updated_at,
        p.name AS product_name,
        p.base_price,
        p.specs
      FROM inventory i
      JOIN products p ON i.product_id = p.product_id
      JOIN stores st ON i.store_id = st.store_id
      WHERE i.product_id = $1
    `;
    const params = [product_id];

    if (store_id) {
      params.push(store_id);
      query += ` AND i.store_id = $${params.length}`;
    }

    query += `
      ORDER BY 
        CASE i.status 
          WHEN 'In Stock' THEN 1 
          WHEN 'Reserved' THEN 2 
          WHEN 'In Repair' THEN 3 
          ELSE 4 
        END,
        i.serial_number ASC
    `;

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

api.post('/inventory', async (req, res, next) => {
  try {
    const { serial_number, product_id, store_id = 'ST-1', status = 'In Stock' } = req.body;

    if (!serial_number || !product_id) {
      return res.status(400).json({ error: 'Bad Request', message: 'serial_number and product_id are required.' });
    }

    const storeRes = await db.query('SELECT store_name FROM stores WHERE store_id = $1', [store_id]);
    const storeLocation = storeRes.rows[0]?.store_name || 'Apple Fifth Avenue';

    const query = `
      INSERT INTO inventory (serial_number, product_id, store_id, status, store_location)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const { rows } = await db.query(query, [serial_number.toUpperCase().trim(), product_id, store_id, status, storeLocation]);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
});

api.put('/inventory/:serial_number/status', async (req, res, next) => {
  try {
    const { serial_number } = req.params;
    const { status, store_id } = req.body;

    const allowed = ['In Stock', 'Reserved', 'Sold', 'In Repair'];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({
        error: 'Invalid Status',
        message: `Status must be one of: ${allowed.join(', ')}`
      });
    }

    const query = `
      UPDATE inventory
      SET 
        status = COALESCE($1, status),
        store_id = COALESCE($2, store_id),
        updated_at = CURRENT_TIMESTAMP
      WHERE serial_number = $3
      RETURNING *
    `;
    const { rows } = await db.query(query, [status, store_id, serial_number]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Not Found', message: `Serial ${serial_number} not found.` });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

async function getSaleDetails(saleId) {
  const saleQuery = `
    SELECT 
      s.*,
      st.store_name,
      st.store_name AS store_location,
      st.store_id AS store_code,
      st.phone AS store_phone,
      st.tax_rate,
      c.name AS customer_name,
      c.email AS customer_email,
      c.phone AS customer_phone,
      c.apple_id,
      e.name AS employee_name,
      e.badge_number,
      e.role AS employee_role,
      p.name AS default_product_name
    FROM sales s
    JOIN stores st ON s.store_id = st.store_id
    LEFT JOIN customers c ON s.customer_id = c.customer_id
    LEFT JOIN employees e ON s.employee_id = e.employee_id
    LEFT JOIN products p ON s.product_id = p.product_id
    WHERE s.sale_id = $1
  `;
  const saleRes = await db.query(saleQuery, [saleId]);
  if (saleRes.rows.length === 0) return null;

  const itemsQuery = `
    SELECT 
      si.sale_item_id,
      si.serial_number,
      si.unit_price,
      p.product_id,
      p.name AS product_name,
      p.image_url,
      p.specs,
      cat.category_name
    FROM sale_items si
    JOIN inventory i ON si.serial_number = i.serial_number
    JOIN products p ON i.product_id = p.product_id
    JOIN category cat ON p.category_id = cat.category_id
    WHERE si.sale_id = $1
  `;
  const itemsRes = await db.query(itemsQuery, [saleId]);

  const sale = saleRes.rows[0];
  sale.items = itemsRes.rows.length > 0 ? itemsRes.rows : [{
    sale_item_id: 1,
    serial_number: `SER-${sale.sale_id}`,
    unit_price: sale.subtotal,
    product_name: sale.default_product_name || 'Apple Hardware Unit'
  }];
  return sale;
}

api.post('/sales/checkout', async (req, res, next) => {
  const { 
    store_id = 'ST-1',
    customer_id = 1, 
    employee_id = 1, 
    serial_numbers, 
    payment_method = 'Apple Pay', 
    use_stored_proc = false 
  } = req.body;

  if (!customer_id || !employee_id || !Array.isArray(serial_numbers) || serial_numbers.length === 0) {
    return res.status(400).json({
      error: 'Invalid Request',
      message: 'store_id, customer_id, employee_id, and non-empty serial_numbers array are required.'
    });
  }

  if (use_stored_proc) {
    try {
      const procQuery = `SELECT * FROM fn_process_sale($1, $2, $3, $4, $5)`;
      const { rows } = await db.query(procQuery, [String(store_id), customer_id, employee_id, serial_numbers, payment_method]);
      const result = rows[0];
      const receiptData = await getSaleDetails(result.out_sale_id);
      return res.status(201).json({
        message: 'Checkout completed successfully via stored procedure fn_process_sale.',
        sale: receiptData
      });
    } catch (procError) {
      return next(procError);
    }
  }

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    const storeRes = await client.query('SELECT store_id, store_name, tax_rate FROM stores WHERE store_id = $1', [String(store_id)]);
    if (storeRes.rows.length === 0) throw new Error(`Store with ID "${store_id}" does not exist.`);
    const store = storeRes.rows[0];
    const taxRate = parseFloat(store.tax_rate) || 0.08875;

    const customerRes = await client.query('SELECT customer_id, name, email FROM customers WHERE customer_id = $1', [customer_id]);
    if (customerRes.rows.length === 0) throw new Error(`Customer with ID ${customer_id} does not exist.`);

    const employeeRes = await client.query('SELECT employee_id, name, role FROM employees WHERE employee_id = $1 AND active = TRUE', [employee_id]);
    if (employeeRes.rows.length === 0) throw new Error(`Active Specialist with ID ${employee_id} not found.`);

    let calculatedSubtotal = 0;
    const itemsToInsert = [];
    let firstProductId = null;

    for (const serial of serial_numbers) {
      const invCheck = await client.query(
        `SELECT i.serial_number, i.status, i.store_id, p.product_id, p.name, p.base_price
         FROM inventory i
         JOIN products p ON i.product_id = p.product_id
         WHERE i.serial_number = $1
         FOR UPDATE OF i`,
        [serial]
      );

      if (invCheck.rows.length === 0) throw new Error(`Device with serial "${serial}" was not found.`);
      const item = invCheck.rows[0];

      if (String(item.store_id) !== String(store_id)) {
        throw new Error(`Device "${item.name}" (Serial: ${serial}) is located at another store (${item.store_id}).`);
      }
      if (item.status !== 'In Stock') {
        throw new Error(`Device "${item.name}" (Serial: ${serial}) is unavailable (Status: "${item.status}").`);
      }

      firstProductId = item.product_id;
      calculatedSubtotal += parseFloat(item.base_price);
      itemsToInsert.push({
        serial_number: item.serial_number,
        product_name: item.name,
        unit_price: parseFloat(item.base_price)
      });
    }

    const taxAmount = Math.round(calculatedSubtotal * taxRate * 100) / 100;
    const totalAmount = Math.round((calculatedSubtotal + taxAmount) * 100) / 100;
    const receiptNumber = `R-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const saleId = `SL-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    await client.query(
      `INSERT INTO sales (sale_id, receipt_number, store_id, customer_id, employee_id, product_id, sale_date, quantity, subtotal, tax_amount, total_amount, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, $9, $10, $11)`,
      [saleId, receiptNumber, String(store_id), customer_id, employee_id, firstProductId, itemsToInsert.length, calculatedSubtotal, taxAmount, totalAmount, payment_method]
    );

    for (const item of itemsToInsert) {
      await client.query(
        `INSERT INTO sale_items (sale_id, serial_number, unit_price) VALUES ($1, $2, $3)`,
        [saleId, item.serial_number, item.unit_price]
      );
      await client.query(
        `UPDATE inventory SET status = 'Sold', updated_at = NOW() WHERE serial_number = $1`,
        [item.serial_number]
      );
    }

    await client.query('COMMIT');
    const receiptData = await getSaleDetails(saleId);
    res.status(201).json({
      message: 'Transaction committed successfully. Inventory marked as Sold.',
      sale: receiptData
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[ACID Transaction Aborted]:', err.message);
    res.status(400).json({ error: 'Checkout Transaction Failed', message: err.message });
  } finally {
    client.release();
  }
});

api.get('/sales', async (req, res, next) => {
  try {
    const { store_id } = req.query;
    let query = `
      SELECT 
        s.sale_id,
        s.receipt_number,
        s.store_id,
        st.store_name,
        st.store_name AS store_location,
        st.store_id AS store_code,
        st.city AS store_city,
        st.tax_rate,
        s.sale_date,
        s.subtotal,
        s.tax_amount,
        s.total_amount,
        s.payment_method,
        s.quantity AS items_count,
        c.customer_id,
        c.name AS customer_name,
        c.email AS customer_email,
        e.employee_id,
        e.name AS employee_name,
        e.role AS employee_role,
        p.name AS product_name
      FROM sales s
      JOIN stores st ON s.store_id = st.store_id
      LEFT JOIN customers c ON s.customer_id = c.customer_id
      LEFT JOIN employees e ON s.employee_id = e.employee_id
      LEFT JOIN products p ON s.product_id = p.product_id
      WHERE 1=1
    `;
    const params = [];
    if (store_id) {
      params.push(store_id);
      query += ` AND s.store_id = $${params.length}`;
    }
    query += ` ORDER BY s.sale_date DESC LIMIT 50`;

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

api.get('/sales/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const sale = await getSaleDetails(id);
    if (!sale) return res.status(404).json({ error: 'Not Found', message: `Sale ${id} not found.` });
    res.json(sale);
  } catch (error) {
    next(error);
  }
});

api.get('/appointments', async (req, res, next) => {
  try {
    const { status, genius_id, store_id, search } = req.query;
    let query = `
      SELECT 
        a.appointment_id,
        a.store_id,
        st.store_name,
        st.store_name AS store_location,
        st.store_id AS store_code,
        a.customer_id,
        c.name AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone,
        a.device_serial,
        p.name AS device_name,
        p.product_id,
        a.genius_id,
        e.name AS genius_name,
        e.badge_number AS genius_badge,
        a.appointment_time,
        a.issue_description,
        a.status,
        a.diagnostic_notes,
        a.created_at,
        a.updated_at
      FROM appointments a
      JOIN stores st ON a.store_id = st.store_id
      LEFT JOIN customers c ON a.customer_id = c.customer_id
      LEFT JOIN employees e ON a.genius_id = e.employee_id
      LEFT JOIN inventory i ON a.device_serial = i.serial_number
      LEFT JOIN products p ON i.product_id = p.product_id
      WHERE 1=1
    `;
    const params = [];
    if (status) {
      params.push(status);
      query += ` AND a.status = $${params.length}`;
    }
    if (store_id) {
      params.push(store_id);
      query += ` AND a.store_id = $${params.length}`;
    }
    if (genius_id) {
      params.push(genius_id);
      query += ` AND a.genius_id = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (c.name ILIKE $${params.length} OR a.issue_description ILIKE $${params.length} OR a.device_serial ILIKE $${params.length})`;
    }
    query += ` ORDER BY a.appointment_time DESC LIMIT 50`;

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

api.get('/appointments/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        a.*,
        st.store_name,
        st.store_name AS store_location,
        st.store_id AS store_code,
        c.name AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone,
        e.name AS genius_name,
        e.badge_number AS genius_badge,
        p.name AS device_name
      FROM appointments a
      JOIN stores st ON a.store_id = st.store_id
      LEFT JOIN customers c ON a.customer_id = c.customer_id
      LEFT JOIN employees e ON a.genius_id = e.employee_id
      LEFT JOIN inventory i ON a.device_serial = i.serial_number
      LEFT JOIN products p ON i.product_id = p.product_id
      WHERE a.appointment_id = $1
    `;
    const { rows } = await db.query(query, [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not Found', message: `Appointment ${id} not found.` });
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

api.post('/appointments', async (req, res, next) => {
  try {
    const { store_id = 'ST-1', customer_id, device_serial, genius_id, appointment_time, issue_description, diagnostic_notes } = req.body;
    if (!customer_id || !genius_id || !appointment_time || !issue_description) {
      return res.status(400).json({ error: 'Bad Request', message: 'customer_id, genius_id, appointment_time, and issue_description are required.' });
    }

    const query = `
      INSERT INTO appointments (store_id, customer_id, device_serial, genius_id, appointment_time, issue_description, diagnostic_notes, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'Scheduled')
      RETURNING *
    `;
    const { rows } = await db.query(query, [
      String(store_id),
      customer_id,
      device_serial || null,
      genius_id,
      appointment_time,
      issue_description,
      diagnostic_notes || null
    ]);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
});

api.put('/appointments/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, diagnostic_notes, appointment_time, genius_id } = req.body;
    const allowed = ['Scheduled', 'In Progress', 'Awaiting Parts', 'Completed', 'Cancelled'];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid Status', message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const query = `
      UPDATE appointments
      SET 
        status = COALESCE($1, status),
        diagnostic_notes = COALESCE($2, diagnostic_notes),
        appointment_time = COALESCE($3, appointment_time),
        genius_id = COALESCE($4, genius_id),
        updated_at = CURRENT_TIMESTAMP
      WHERE appointment_id = $5
      RETURNING *
    `;
    const { rows } = await db.query(query, [status, diagnostic_notes, appointment_time, genius_id, id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not Found', message: `Appointment ${id} not found.` });
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

api.delete('/appointments/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query('DELETE FROM appointments WHERE appointment_id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Not Found', message: `Appointment ${id} not found.` });
    res.json({ message: `Appointment ${id} cancelled successfully.` });
  } catch (error) {
    next(error);
  }
});

api.get('/employees', async (req, res, next) => {
  try {
    const { role, store_id, active = true } = req.query;
    let query = `
      SELECT 
        e.employee_id, 
        e.store_id, 
        st.store_name, 
        st.store_name AS store_location, 
        st.store_id AS store_code, 
        e.name, 
        e.role, 
        e.badge_number, 
        e.email, 
        e.active, 
        e.created_at
      FROM employees e
      JOIN stores st ON e.store_id = st.store_id
      WHERE 1=1
    `;
    const params = [];
    if (role) {
      params.push(role);
      query += ` AND e.role = $${params.length}`;
    }
    if (store_id) {
      params.push(store_id);
      query += ` AND e.store_id = $${params.length}`;
    }
    if (active !== undefined) {
      params.push(active === 'true' || active === true);
      query += ` AND e.active = $${params.length}`;
    }
    query += ` ORDER BY e.role ASC, e.name ASC`;

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

api.post('/employees', async (req, res, next) => {
  try {
    const { name, role, store_id = 'ST-1', badge_number, email } = req.body;
    if (!name || !role || !badge_number || !email) {
      return res.status(400).json({ error: 'Bad Request', message: 'name, role, badge_number, and email are required.' });
    }

    const storeRes = await db.query('SELECT store_name FROM stores WHERE store_id = $1', [store_id]);
    const storeLocation = storeRes.rows[0]?.store_name || 'Apple Fifth Avenue';

    const query = `
      INSERT INTO employees (name, role, store_id, store_location, badge_number, email)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const { rows } = await db.query(query, [name, role, store_id, storeLocation, badge_number, email]);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
});

api.get('/customers', async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = `
      SELECT customer_id, name, email, phone, apple_id, membership_tier, created_at
      FROM customers
      WHERE 1=1
    `;
    const params = [];
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length} OR phone ILIKE $${params.length} OR apple_id ILIKE $${params.length})`;
    }
    query += ` ORDER BY name ASC`;

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

api.post('/customers', async (req, res, next) => {
  try {
    const { name, email, phone = '', apple_id = '', membership_tier = 'Standard' } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Bad Request', message: 'name and email are required.' });
    }

    const query = `
      INSERT INTO customers (name, email, phone, apple_id, membership_tier)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const { rows } = await db.query(query, [name, email, phone, apple_id || email, membership_tier]);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
});

api.get('/dashboard/stats', async (req, res, next) => {
  try {
    const { store_id } = req.query;
    const invParams = [];
    const salesParams = [];
    const apptParams = [];

    let invWhere = 'WHERE 1=1';
    let salesWhere = 'WHERE 1=1';
    let apptWhere = 'WHERE 1=1';

    if (store_id) {
      invParams.push(store_id);
      invWhere += ` AND store_id = $${invParams.length}`;

      salesParams.push(store_id);
      salesWhere += ` AND store_id = $${salesParams.length}`;

      apptParams.push(store_id);
      apptWhere += ` AND store_id = $${apptParams.length}`;
    }

    const invCountsQuery = `
      SELECT 
        COUNT(*) AS total_items,
        COUNT(CASE WHEN status = 'In Stock' THEN 1 END) AS in_stock_count,
        COUNT(CASE WHEN status = 'Reserved' THEN 1 END) AS reserved_count,
        COUNT(CASE WHEN status = 'Sold' THEN 1 END) AS sold_count,
        COUNT(CASE WHEN status = 'In Repair' THEN 1 END) AS in_repair_count
      FROM inventory
      ${invWhere}
    `;
    const invCounts = (await db.query(invCountsQuery, invParams)).rows[0];

    const revenueQuery = `
      SELECT 
        COALESCE(SUM(total_amount), 0) AS total_revenue,
        COALESCE(SUM(CASE WHEN sale_date >= CURRENT_DATE - INTERVAL '30 days' THEN total_amount ELSE 0 END), 0) AS todays_revenue,
        COUNT(*) AS total_sales_count,
        COALESCE(SUM(CASE WHEN sale_date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 ELSE 0 END), 0) AS todays_sales_count
      FROM sales
      ${salesWhere}
    `;
    const revCounts = (await db.query(revenueQuery, salesParams)).rows[0];

    const repairsQuery = `
      SELECT 
        COUNT(*) AS total_appointments,
        COUNT(CASE WHEN status IN ('Scheduled', 'In Progress', 'Awaiting Parts') THEN 1 END) AS active_repairs,
        COUNT(CASE WHEN status = 'In Progress' THEN 1 END) AS in_progress_repairs
      FROM appointments
      ${apptWhere}
    `;
    const repairCounts = (await db.query(repairsQuery, apptParams)).rows[0];

    let categoryBreakdownQuery = `
      SELECT 
        c.category_id,
        c.category_name,
        c.category_name AS name,
        COUNT(i.serial_number) AS total_units,
        COUNT(CASE WHEN i.status = 'In Stock' THEN 1 END) AS in_stock_units,
        COUNT(CASE WHEN i.status = 'Sold' THEN 1 END) AS sold_units,
        ROUND(COALESCE(SUM(CASE WHEN i.status = 'In Stock' THEN p.base_price ELSE 0 END), 0), 2) AS stock_value
      FROM category c
      LEFT JOIN products p ON c.category_id = p.category_id
      LEFT JOIN inventory i ON p.product_id = i.product_id ${store_id ? `AND i.store_id = $1` : ''}
      GROUP BY c.category_id, c.category_name
      ORDER BY total_units DESC
    `;
    const categoryBreakdown = (await db.query(categoryBreakdownQuery, store_id ? [store_id] : [])).rows;

    let recentSalesQuery = `
      SELECT 
        'sale' AS type,
        s.sale_id AS id,
        s.receipt_number AS ref,
        s.sale_date AS timestamp,
        s.total_amount AS amount,
        COALESCE(c.name, 'Apple Customer') AS customer_name,
        COALESCE(e.name, 'Apple Specialist') AS staff_name,
        st.store_name,
        'Sale of ' || COALESCE(p.name, 'Hardware Unit') AS title
      FROM sales s
      JOIN stores st ON s.store_id = st.store_id
      LEFT JOIN customers c ON s.customer_id = c.customer_id
      LEFT JOIN employees e ON s.employee_id = e.employee_id
      LEFT JOIN products p ON s.product_id = p.product_id
      ${store_id ? `WHERE s.store_id = $1` : ''}
      ORDER BY s.sale_date DESC
      LIMIT 5
    `;
    const recentSales = (await db.query(recentSalesQuery, store_id ? [store_id] : [])).rows;

    let recentAppointmentsQuery = `
      SELECT 
        'repair' AS type,
        a.appointment_id AS id,
        COALESCE(a.device_serial, 'N/A') AS ref,
        a.appointment_time AS timestamp,
        0 AS amount,
        COALESCE(c.name, 'Customer') AS customer_name,
        COALESCE(e.name, 'Genius Staff') AS staff_name,
        st.store_name,
        'Genius Bar: ' || a.issue_description AS title
      FROM appointments a
      JOIN stores st ON a.store_id = st.store_id
      LEFT JOIN customers c ON a.customer_id = c.customer_id
      LEFT JOIN employees e ON a.genius_id = e.employee_id
      ${store_id ? `WHERE a.store_id = $1` : ''}
      ORDER BY a.appointment_time DESC
      LIMIT 5
    `;
    const recentAppts = (await db.query(recentAppointmentsQuery, store_id ? [store_id] : [])).rows;

    const activityFeed = [...recentSales, ...recentAppts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 8);

    const storePerformance = (await db.query(`
      SELECT * FROM v_store_performance WHERE total_sales_count > 0 ORDER BY total_revenue DESC LIMIT 6
    `)).rows;

    res.json({
      metrics: {
        totalInventory: parseInt(invCounts.total_items, 10),
        inStockInventory: parseInt(invCounts.in_stock_count, 10),
        soldInventory: parseInt(invCounts.sold_count, 10),
        reservedInventory: parseInt(invCounts.reserved_count, 10),
        todaysRevenue: parseFloat(revCounts.todays_revenue),
        totalRevenue: parseFloat(revCounts.total_revenue),
        todaysSalesCount: parseInt(revCounts.todays_sales_count, 10),
        totalSalesCount: parseInt(revCounts.total_sales_count, 10),
        activeRepairs: parseInt(repairCounts.active_repairs, 10),
        inProgressRepairs: parseInt(repairCounts.in_progress_repairs, 10),
      },
      categoryBreakdown,
      activityFeed,
      storePerformance
    });
  } catch (error) {
    next(error);
  }
});

api.post("/seed", async (req, res, next) => {
  try {
    const csvDir = fs.existsSync(path.join(__dirname, "../database/csv"))
      ? path.join(__dirname, "../database/csv")
      : path.join(process.cwd(), "database/csv");
    await seedDatabase(pool, csvDir);
    res.json({ message: "Real-world Apple Retail dataset migration complete." });
  } catch (err) {
    next(err);
  }
});

function getSpecsForProduct(name, categoryName) {
  const n = name.toLowerCase();
  const c = categoryName.toLowerCase();
  if (c.includes('laptop')) {
    if (n.includes('m3')) return { chip: "Apple M3 (8-core CPU, 10-core GPU)", memory: "16GB Unified", display: "Liquid Retina display", ports: "Thunderbolt / USB 4" };
    if (n.includes('m2')) return { chip: "Apple M2 (8-core CPU)", memory: "8GB Unified", display: "Liquid Retina", ports: "Thunderbolt 3" };
    if (n.includes('m1')) return { chip: "Apple M1", memory: "8GB Unified", display: "Retina Display", ports: "2x Thunderbolt 3" };
    return { chip: "Apple Silicon M-Series", memory: "16GB Unified Memory", display: "Liquid Retina XDR", ports: "Thunderbolt 4" };
  }
  if (c.includes('smartphone')) {
    if (n.includes('16') || n.includes('pro')) return { chip: "A18 Pro", display: "Super Retina XDR with ProMotion", camera: "48MP Fusion | 5x Telephoto", connectivity: "5G, Wi-Fi 7" };
    if (n.includes('15')) return { chip: "A16 Bionic", display: "Super Retina XDR", camera: "48MP Main | Ultra Wide", connectivity: "5G, USB-C" };
    return { chip: "A15 Bionic", display: "Super Retina XDR", camera: "Dual 12MP System", connectivity: "5G" };
  }
  if (c.includes('tablet')) return { chip: "Apple M4 / M2", display: "Ultra Retina XDR Tandem OLED", compatibility: "Apple Pencil Pro, Magic Keyboard", storage: "256GB" };
  if (c.includes('audio')) return { chip: "Apple H2 headphone chip", features: "Active Noise Cancellation with Transparency Mode", connectivity: "Bluetooth 5.3, USB-C" };
  if (c.includes('wearable')) return { display: "Always-On Retina display, up to 3000 nits", sensors: "Heart rate, ECG, Blood Oxygen, Depth gauge", connectivity: "GPS + Cellular" };
  return { features: "Engineered by Apple", compatibility: "Apple Hardware Ecosystem" };
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

const PRODUCT_IMAGES = {
  Laptop: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
  Smartphone: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80',
  Tablet: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
  Wearable: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
  Audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  Accessories: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80'
};

async function seedDatabase(targetPool, customCsvDir) {
  const defaultCsvDir = fs.existsSync(path.join(__dirname, "../database/csv"))
    ? path.join(__dirname, "../database/csv")
    : path.join(process.cwd(), "database/csv");
  const CSV_DIR = customCsvDir || defaultCsvDir;
  const client = await targetPool.connect();
  try {
    console.log("🍏 Resetting tables to the real-world dataset schema...");
    await client.query(`
      DROP VIEW IF EXISTS v_store_performance CASCADE;
      DROP VIEW IF EXISTS v_inventory_summary CASCADE;
      DROP VIEW IF EXISTS v_sales_analytics CASCADE;
      DROP VIEW IF EXISTS v_genius_appointment_schedule CASCADE;
      DROP FUNCTION IF EXISTS fn_process_sale(VARCHAR, INT, INT, VARCHAR[], VARCHAR) CASCADE;
      DROP FUNCTION IF EXISTS fn_process_sale(INT, INT, INT, VARCHAR[], VARCHAR) CASCADE;
      DROP FUNCTION IF EXISTS fn_process_sale(INT, INT, VARCHAR[], NUMERIC, VARCHAR) CASCADE;

      DROP TABLE IF EXISTS appointments CASCADE;
      DROP TABLE IF EXISTS warranty CASCADE;
      DROP TABLE IF EXISTS sale_items CASCADE;
      DROP TABLE IF EXISTS sales CASCADE;
      DROP TABLE IF EXISTS inventory CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS category CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS employees CASCADE;
      DROP TABLE IF EXISTS customers CASCADE;
      DROP TABLE IF EXISTS stores CASCADE;

      CREATE TABLE stores (
          store_id VARCHAR(20) PRIMARY KEY,
          store_name VARCHAR(255) NOT NULL,
          city VARCHAR(100) NOT NULL,
          country VARCHAR(100) NOT NULL,
          tax_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.08875,
          flagship BOOLEAN DEFAULT FALSE,
          phone VARCHAR(50),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE category (
          category_id VARCHAR(20) PRIMARY KEY,
          category_name VARCHAR(100) NOT NULL UNIQUE
      );

      CREATE TABLE products (
          product_id VARCHAR(20) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          category_id VARCHAR(20) NOT NULL REFERENCES category(category_id) ON DELETE RESTRICT,
          launch_date DATE,
          base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
          specs JSONB NOT NULL DEFAULT '{}'::jsonb,
          image_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE inventory (
          serial_number VARCHAR(64) PRIMARY KEY,
          product_id VARCHAR(20) NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
          store_id VARCHAR(20) NOT NULL REFERENCES stores(store_id) ON DELETE RESTRICT,
          status VARCHAR(30) NOT NULL CHECK (status IN ('In Stock', 'Reserved', 'Sold', 'In Repair')),
          store_location VARCHAR(255) NOT NULL,
          received_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE customers (
          customer_id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          phone VARCHAR(50),
          apple_id VARCHAR(255) UNIQUE,
          membership_tier VARCHAR(50) DEFAULT 'Standard',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE employees (
          employee_id SERIAL PRIMARY KEY,
          store_id VARCHAR(20) NOT NULL REFERENCES stores(store_id) ON DELETE RESTRICT,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL CHECK (role IN ('Specialist', 'Genius', 'Manager')),
          store_location VARCHAR(255) NOT NULL,
          badge_number VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          active BOOLEAN NOT NULL DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE sales (
          sale_id VARCHAR(64) PRIMARY KEY,
          receipt_number VARCHAR(64) UNIQUE NOT NULL,
          store_id VARCHAR(20) NOT NULL REFERENCES stores(store_id) ON DELETE RESTRICT,
          customer_id INT NOT NULL REFERENCES customers(customer_id) ON DELETE RESTRICT,
          employee_id INT NOT NULL REFERENCES employees(employee_id) ON DELETE RESTRICT,
          product_id VARCHAR(20) REFERENCES products(product_id) ON DELETE SET NULL,
          sale_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          quantity INT NOT NULL DEFAULT 1,
          subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
          tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
          total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
          payment_method VARCHAR(50) NOT NULL DEFAULT 'Apple Pay'
      );

      CREATE TABLE sale_items (
          sale_item_id SERIAL PRIMARY KEY,
          sale_id VARCHAR(64) NOT NULL REFERENCES sales(sale_id) ON DELETE CASCADE,
          serial_number VARCHAR(64) NOT NULL UNIQUE REFERENCES inventory(serial_number) ON DELETE RESTRICT,
          unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0)
      );

      CREATE TABLE warranty (
          claim_id VARCHAR(64) PRIMARY KEY,
          claim_date DATE NOT NULL,
          sale_id VARCHAR(64) REFERENCES sales(sale_id) ON DELETE CASCADE,
          repair_status VARCHAR(50) NOT NULL
      );

      CREATE TABLE appointments (
          appointment_id SERIAL PRIMARY KEY,
          store_id VARCHAR(20) NOT NULL REFERENCES stores(store_id) ON DELETE RESTRICT,
          customer_id INT NOT NULL REFERENCES customers(customer_id) ON DELETE CASCADE,
          device_serial VARCHAR(64) REFERENCES inventory(serial_number) ON DELETE SET NULL,
          genius_id INT NOT NULL REFERENCES employees(employee_id) ON DELETE RESTRICT,
          appointment_time TIMESTAMP WITH TIME ZONE NOT NULL,
          issue_description TEXT NOT NULL,
          status VARCHAR(50) NOT NULL CHECK (status IN ('Scheduled', 'In Progress', 'Awaiting Parts', 'Completed', 'Cancelled')) DEFAULT 'Scheduled',
          diagnostic_notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX idx_inventory_in_stock ON inventory(product_id, store_id) WHERE status = 'In Stock';
      CREATE INDEX idx_inventory_store_status ON inventory(store_id, status);
      CREATE INDEX idx_products_fts ON products USING gin(to_tsvector('english', name || ' ' || specs::text));
      CREATE INDEX idx_sales_store_date ON sales(store_id, sale_date DESC);
    `);
    console.log("✅ DDL schema executed.");

    
    console.log("📦 Loading stores.csv...");
    const storeLines = fs.readFileSync(path.join(CSV_DIR, 'stores.csv'), 'utf8').trim().split('\n');
    const storeMap = {};
    for (let i = 1; i < storeLines.length; i++) {
      const parts = parseCSVLine(storeLines[i]);
      if (parts.length >= 4) {
        const [store_id, store_name, city, country] = parts;
        let tax = 0.08875;
        let flagship = false;
        if (/fifth avenue|regent|union square|champs|grove|bkc|ginza/i.test(store_name)) flagship = true;
        if (/united kingdom|france/i.test(country)) tax = 0.20;
        else if (/japan/i.test(country)) tax = 0.10;
        else if (/san francisco/i.test(city)) tax = 0.08625;
        
        await client.query(
          `INSERT INTO stores (store_id, store_name, city, country, tax_rate, flagship, phone)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [store_id, store_name, city, country, tax, flagship, `+1 (555) 01${(i % 90 + 10)}`]
        );
        storeMap[store_id] = { store_id, store_name, city, country };
      }
    }
    console.log(`✅ Loaded ${Object.keys(storeMap).length} stores from stores.csv`);

    
    console.log("📦 Loading category.csv...");
    const catLines = fs.readFileSync(path.join(CSV_DIR, 'category.csv'), 'utf8').trim().split('\n');
    const catMap = {};
    for (let i = 1; i < catLines.length; i++) {
      const parts = parseCSVLine(catLines[i]);
      if (parts.length >= 2) {
        const [cat_id, cat_name] = parts;
        await client.query(`INSERT INTO category (category_id, category_name) VALUES ($1, $2)`, [cat_id, cat_name]);
        catMap[cat_id] = cat_name;
      }
    }
    console.log(`✅ Loaded ${Object.keys(catMap).length} categories from category.csv`);

    
    console.log("📦 Loading products.csv...");
    const prodLines = fs.readFileSync(path.join(CSV_DIR, 'products.csv'), 'utf8').trim().split('\n');
    const prodMap = {};
    for (let i = 1; i < prodLines.length; i++) {
      const parts = parseCSVLine(prodLines[i]);
      if (parts.length >= 5) {
        const [p_id, p_name, c_id, l_date, price] = parts;
        const cat_name = catMap[c_id] || 'Accessories';
        const img = PRODUCT_IMAGES[cat_name] || PRODUCT_IMAGES['Accessories'];
        const specs = getSpecsForProduct(p_name, cat_name);
        await client.query(
          `INSERT INTO products (product_id, name, category_id, launch_date, base_price, specs, image_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [p_id, p_name, c_id, l_date || '2023-09-15', parseFloat(price) || 999.00, JSON.stringify(specs), img]
        );
        prodMap[p_id] = { p_id, p_name, price: parseFloat(price) || 999.00 };
      }
    }
    console.log(`✅ Loaded ${Object.keys(prodMap).length} products from products.csv`);

    
    console.log("👥 Populating customer and staff directory...");
    const customerList = [
      ['Alexander Wright', 'alex.wright@icloud.com', '+1 (212) 555-0143', 'alex.wright@icloud.com', 'AppleCare+ Tier 1'],
      ['Sophia Lorenzi', 'sophia.l@gmail.com', '+1 (212) 555-0189', 'sophia.lorenzi@icloud.com', 'Standard'],
      ['Jonathan Kim', 'j.kim@techfirm.co', '+1 (415) 555-0122', 'jkim.developer@icloud.com', 'Business Pro'],
      ['Emily Watson', 'emily.watson@outlook.com', '+1 (646) 555-0177', 'emily.w@me.com', 'Standard'],
      ['Carlos Santana', 'carlos.music@mac.com', '+1 (310) 555-0155', 'carlos.music@mac.com', 'AppleCare+ Tier 2']
    ];
    for (const c of customerList) {
      await client.query(
        `INSERT INTO customers (name, email, phone, apple_id, membership_tier) VALUES ($1, $2, $3, $4, $5)`,
        c
      );
    }

    let empCount = 0;
    const storeIds = Object.keys(storeMap);
    const empValues = [];
    const empParams = [];
    for (const s_id of storeIds) {
      const s_name = storeMap[s_id].store_name;
      const roles = [['Specialist', 'SPC'], ['Genius', 'GEN'], ['Manager', 'MGR']];
      for (const [r, prefix] of roles) {
        empCount++;
        const offset = empParams.length;
        empValues.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`);
        empParams.push(s_id, `Apple ${prefix} Staff ${empCount}`, r, s_name, `${prefix}-${1000 + empCount}`, `staff.${empCount}@apple.internal`);
      }
    }
    if (empValues.length > 0) {
      await client.query(
        `INSERT INTO employees (store_id, name, role, store_location, badge_number, email) VALUES ${empValues.join(',')}`,
        empParams
      );
    }
    console.log(`✅ Created ${empCount} employees across all ${storeIds.length} stores`);

    console.log("📦 Generating physical serialized units across stores from proper products...");
    const prodIds = Object.keys(prodMap);
    let serialId = 0;
    const statuses = ['In Stock', 'In Stock', 'In Stock', 'Reserved', 'In Repair'];
    const invItems = [];

    for (let sIdx = 0; sIdx < Math.min(storeIds.length, 25); sIdx++) {
      const s_id = storeIds[sIdx];
      const s_name = storeMap[s_id].store_name;
      for (let pIdx = 0; pIdx < Math.min(prodIds.length, 30); pIdx++) {
        const p_id = prodIds[pIdx];
        const units = (sIdx < 10) ? 3 : 1;
        for (let u = 0; u < units; u++) {
          serialId++;
          const sNum = `F17${s_id.replace('-', '')}${p_id.replace('-', '')}Q${serialId.toString().padStart(4, '0')}`;
          const st = statuses[serialId % statuses.length];
          invItems.push([sNum, p_id, s_id, st, s_name]);
        }
      }
    }

    for (let i = 0; i < invItems.length; i += 200) {
      const chunk = invItems.slice(i, i + 200);
      const valPlaceholders = [];
      const params = [];
      chunk.forEach((item) => {
        const offset = params.length;
        valPlaceholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`);
        params.push(...item);
      });
      await client.query(
        `INSERT INTO inventory (serial_number, product_id, store_id, status, store_location) VALUES ${valPlaceholders.join(',')}`,
        params
      );
    }
    console.log(`✅ Created ${serialId} physical hardware serialized units in inventory`);

    console.log("💳 Loading real transactions from sales.csv...");
    const salesFd = fs.readFileSync(path.join(CSV_DIR, 'sales.csv'), 'utf8');
    const salesLines = salesFd.split('\n');
    const saleIdSet = new Set();
    const salesBatch = [];

    for (let i = 1; i < salesLines.length && salesBatch.length < 10000; i++) {
      const line = salesLines[i].trim();
      if (!line) continue;
      const parts = line.split(',');
      if (parts.length >= 5) {
        const [sale_id, date_str, s_id, p_id, qtyStr] = parts;
        if (!storeMap[s_id] || !prodMap[p_id]) continue;

        let sale_date = '2023-06-15 12:00:00';
        const dParts = date_str.split('-');
        if (dParts.length === 3) {
          sale_date = `${dParts[2]}-${dParts[1]}-${dParts[0]} 12:00:00`;
        }

        const qty = parseInt(qtyStr, 10) || 1;
        const price = prodMap[p_id].price;
        const subtotal = Math.round(price * qty * 100) / 100;
        const tax = Math.round(subtotal * 0.08875 * 100) / 100;
        const total = Math.round((subtotal + tax) * 100) / 100;

        salesBatch.push([sale_id, `R-${sale_id}`, s_id, p_id, sale_date, qty, subtotal, tax, total, 'Apple Pay']);
        saleIdSet.add(sale_id);
      }
    }

    for (let i = 0; i < salesBatch.length; i += 200) {
      const chunk = salesBatch.slice(i, i + 200);
      const valPlaceholders = [];
      const params = [];
      chunk.forEach((item) => {
        const offset = params.length;
        valPlaceholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, 1, 1, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${offset + 10})`);
        params.push(...item);
      });
      await client.query(
        `INSERT INTO sales (sale_id, receipt_number, store_id, customer_id, employee_id, product_id, sale_date, quantity, subtotal, tax_amount, total_amount, payment_method)
         VALUES ${valPlaceholders.join(',')}
         ON CONFLICT (sale_id) DO NOTHING`,
        params
      );
    }
    console.log(`✅ Loaded ${salesBatch.length} real sales transactions from sales.csv`);

    console.log("🔧 Loading warranty claims from warranty.csv...");
    const warLines = fs.readFileSync(path.join(CSV_DIR, 'warranty.csv'), 'utf8').trim().split('\n');
    const warBatch = [];
    const apptBatch = [];

    for (let i = 1; i < warLines.length && warBatch.length < 1000; i++) {
      const line = warLines[i].trim();
      if (!line) continue;
      const parts = line.split(',');
      if (parts.length >= 4) {
        const [claim_id, claim_date, s_id, status] = parts;
        if (saleIdSet.has(s_id)) {
          warBatch.push([claim_id, claim_date, s_id, status]);
          const stMapped = status === 'Completed' ? 'Completed' : 'In Progress';
          apptBatch.push(['ST-1', 1, 2, claim_date + ' 14:00:00', `Hardware warranty service (Claim ${claim_id})`, stMapped, `Logged from warranty claims database`]);
        }
      }
    }

    for (let i = 0; i < warBatch.length; i += 200) {
      const chunk = warBatch.slice(i, i + 200);
      const valPlaceholders = [];
      const params = [];
      chunk.forEach((item) => {
        const offset = params.length;
        valPlaceholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4})`);
        params.push(...item);
      });
      await client.query(
        `INSERT INTO warranty (claim_id, claim_date, sale_id, repair_status)
         VALUES ${valPlaceholders.join(',')}
         ON CONFLICT (claim_id) DO NOTHING`,
        params
      );
    }

    for (let i = 0; i < apptBatch.length; i += 200) {
      const chunk = apptBatch.slice(i, i + 200);
      const valPlaceholders = [];
      const params = [];
      chunk.forEach((item) => {
        const offset = params.length;
        valPlaceholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6}, $${offset + 7})`);
        params.push(...item);
      });
      await client.query(
        `INSERT INTO appointments (store_id, customer_id, genius_id, appointment_time, issue_description, status, diagnostic_notes)
         VALUES ${valPlaceholders.join(',')}`,
        params
      );
    }
    console.log(`✅ Loaded ${warBatch.length} warranty claims and appointments`);

    
    console.log("📊 Building real-world SQL views and stored procedure...");
    await client.query(`
      CREATE OR REPLACE VIEW v_inventory_summary AS
      SELECT 
          p.product_id,
          p.name AS product_name,
          c.category_name AS category_name,
          c.category_id,
          p.base_price,
          p.specs,
          p.image_url,
          COUNT(i.serial_number) AS total_units,
          COUNT(CASE WHEN i.status = 'In Stock' THEN 1 END) AS in_stock_count,
          COUNT(CASE WHEN i.status = 'Reserved' THEN 1 END) AS reserved_count,
          COUNT(CASE WHEN i.status = 'Sold' THEN 1 END) AS sold_count,
          COUNT(CASE WHEN i.status = 'In Repair' THEN 1 END) AS in_repair_count,
          ROUND(COUNT(CASE WHEN i.status = 'In Stock' THEN 1 END) * p.base_price, 2) AS in_stock_valuation
      FROM products p
      JOIN category c ON p.category_id = c.category_id
      LEFT JOIN inventory i ON p.product_id = i.product_id
      GROUP BY p.product_id, p.name, c.category_name, c.category_id, p.base_price, p.specs, p.image_url;

      CREATE OR REPLACE VIEW v_store_performance AS
      SELECT 
          st.store_id,
          st.store_id AS store_code,
          st.store_name AS store_name,
          st.city,
          st.country,
          st.flagship,
          st.tax_rate,
          COALESCE(inv.total_inventory_units, 0) AS total_inventory_units,
          COALESCE(inv.in_stock_units, 0) AS in_stock_units,
          COALESCE(sal.total_sales_count, 0) AS total_sales_count,
          COALESCE(sal.total_revenue, 0.00) AS total_revenue,
          COALESCE(apt.active_repairs, 0) AS active_repairs
      FROM stores st
      LEFT JOIN (
          SELECT store_id, COUNT(*) AS total_inventory_units, COUNT(CASE WHEN status = 'In Stock' THEN 1 END) AS in_stock_units 
          FROM inventory GROUP BY store_id
      ) inv ON st.store_id = inv.store_id
      LEFT JOIN (
          SELECT store_id, COUNT(*) AS total_sales_count, ROUND(SUM(total_amount), 2) AS total_revenue 
          FROM sales GROUP BY store_id
      ) sal ON st.store_id = sal.store_id
      LEFT JOIN (
          SELECT store_id, COUNT(*) AS active_repairs 
          FROM appointments WHERE status IN ('Scheduled', 'In Progress', 'Awaiting Parts') 
          GROUP BY store_id
      ) apt ON st.store_id = apt.store_id;

      CREATE OR REPLACE FUNCTION fn_process_sale(
          p_store_id VARCHAR,
          p_customer_id INT,
          p_employee_id INT,
          p_serial_numbers VARCHAR[],
          p_payment_method VARCHAR DEFAULT 'Apple Pay'
      )
      RETURNS TABLE (
          out_sale_id VARCHAR,
          out_receipt_number VARCHAR,
          out_items_processed INT,
          out_total_amount NUMERIC
      ) 
      LANGUAGE plpgsql
      AS $$
      DECLARE
          v_receipt_number VARCHAR(64);
          v_new_sale_id VARCHAR(64);
          v_serial VARCHAR(64);
          v_item_price NUMERIC(10, 2);
          v_calculated_subtotal NUMERIC(10, 2) := 0.00;
          v_tax_rate NUMERIC(5, 4);
          v_tax_amount NUMERIC(10, 2);
          v_item_status VARCHAR(30);
          v_item_store VARCHAR(20);
          v_item_count INT := 0;
          v_prod_id VARCHAR(20);
      BEGIN
          IF p_serial_numbers IS NULL OR array_length(p_serial_numbers, 1) = 0 THEN
              RAISE EXCEPTION 'Checkout aborted: No items in cart.';
          END IF;

          SELECT tax_rate INTO v_tax_rate FROM stores WHERE store_id = p_store_id;
          IF NOT FOUND THEN
              RAISE EXCEPTION 'Checkout aborted: Store % not found.', p_store_id;
          END IF;

          FOREACH v_serial IN ARRAY p_serial_numbers LOOP
              SELECT i.status, i.store_id, p.base_price, p.product_id
              INTO v_item_status, v_item_store, v_item_price, v_prod_id
              FROM inventory i
              JOIN products p ON i.product_id = p.product_id
              WHERE i.serial_number = v_serial
              FOR UPDATE OF i;

              IF NOT FOUND THEN
                  RAISE EXCEPTION 'Checkout aborted: Serial % not found.', v_serial;
              END IF;

              IF v_item_store <> p_store_id THEN
                  RAISE EXCEPTION 'Checkout aborted: Unit % is at %, not %.', v_serial, v_item_store, p_store_id;
              END IF;

              IF v_item_status <> 'In Stock' THEN
                  RAISE EXCEPTION 'Checkout conflict: Unit % is %.', v_serial, v_item_status;
              END IF;

              v_calculated_subtotal := v_calculated_subtotal + v_item_price;
              v_item_count := v_item_count + 1;
          END LOOP;

          v_tax_amount := ROUND(v_calculated_subtotal * v_tax_rate, 2);
          v_receipt_number := 'R-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 90000 + 10000)::TEXT, 5, '0');
          v_new_sale_id := 'SL-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 90000 + 10000)::TEXT, 5, '0');

          INSERT INTO sales (
              sale_id, receipt_number, store_id, customer_id, employee_id, product_id, sale_date, quantity, subtotal, tax_amount, total_amount, payment_method
          ) VALUES (
              v_new_sale_id, v_receipt_number, p_store_id, p_customer_id, p_employee_id, v_prod_id, CURRENT_TIMESTAMP, v_item_count, v_calculated_subtotal, v_tax_amount, v_calculated_subtotal + v_tax_amount, p_payment_method
          );

          FOREACH v_serial IN ARRAY p_serial_numbers LOOP
              SELECT p.base_price INTO v_item_price
              FROM inventory i JOIN products p ON i.product_id = p.product_id
              WHERE i.serial_number = v_serial;

              INSERT INTO sale_items (sale_id, serial_number, unit_price)
              VALUES (v_new_sale_id, v_serial, v_item_price);

              UPDATE inventory SET status = 'Sold', updated_at = CURRENT_TIMESTAMP
              WHERE serial_number = v_serial;
          END LOOP;

          RETURN QUERY SELECT v_new_sale_id, v_receipt_number, v_item_count, (v_calculated_subtotal + v_tax_amount);
      END;
      $$;
    `);

    console.log("🎉 Real-world Apple Retail dataset migration complete!");
  } finally {
    client.release();
  }
}

if (process.argv.includes("--seed")) {
  seedDatabase(pool, path.join(__dirname, "../database/csv"))
    .then(() => {
      console.log("Migration complete!");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}

app.use('/api', api);

app.use((req, res) => {
  res.status(404).json({
    error: 'Route Not Found',
    message: `Cannot ${req.method} ${req.url}`
  });
});

app.use((err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.url}:`, err.message || err);

  if (err.code) {
    switch (err.code) {
      case '23505':
        return res.status(409).json({
          error: 'Conflict',
          message: 'A record with this identifier already exists.',
          detail: err.detail
        });
      case '23503':
        return res.status(400).json({
          error: 'Foreign Key Violation',
          message: 'Referenced entity does not exist.',
          detail: err.detail
        });
      case '23514':
        return res.status(400).json({
          error: 'Check Constraint Violation',
          message: 'Submitted data failed table integrity constraints.',
          detail: err.detail
        });
      case 'P0001':
        return res.status(400).json({
          error: 'Database Transaction Aborted',
          message: err.message
        });
    }
  }

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred on the server.'
  });
});

if (require.main === module && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🍏 Apple StoreOS Single-Module Backend running at http://localhost:${PORT}`);
    console.log(`📡 PostgreSQL Connection Pool targeted at database "${process.env.DB_NAME || 'apple_store_db'}"`);
  });
}

module.exports = app;
