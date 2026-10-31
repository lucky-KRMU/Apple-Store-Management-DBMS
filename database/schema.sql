DROP VIEW IF EXISTS v_store_performance CASCADE;
DROP VIEW IF EXISTS v_inventory_summary CASCADE;
DROP VIEW IF EXISTS v_sales_analytics CASCADE;
DROP VIEW IF EXISTS v_genius_appointment_schedule CASCADE;
DROP FUNCTION IF EXISTS fn_process_sale(INT, INT, INT, VARCHAR[], VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS fn_process_sale(INT, INT, VARCHAR[], NUMERIC, VARCHAR) CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS sale_items CASCADE;
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS stores CASCADE;

CREATE TABLE stores (
    store_id SERIAL PRIMARY KEY,
    store_code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    tax_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.08875,
    flagship BOOLEAN NOT NULL DEFAULT FALSE,
    address TEXT NOT NULL,
    phone VARCHAR(50),
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(50) DEFAULT 'device-laptop',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL REFERENCES categories(category_id) ON DELETE RESTRICT,
    base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    image_url TEXT,
    launch_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
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
    store_id INT NOT NULL REFERENCES stores(store_id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Specialist', 'Genius', 'Manager')),
    store_location VARCHAR(120) NOT NULL,
    badge_number VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory (
    serial_number VARCHAR(64) PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(product_id) ON DELETE RESTRICT,
    store_id INT NOT NULL REFERENCES stores(store_id) ON DELETE RESTRICT,
    status VARCHAR(30) NOT NULL CHECK (status IN ('In Stock', 'Reserved', 'Sold', 'In Repair')),
    store_location VARCHAR(120) NOT NULL,
    received_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    receipt_number VARCHAR(64) UNIQUE NOT NULL,
    store_id INT NOT NULL REFERENCES stores(store_id) ON DELETE RESTRICT,
    customer_id INT NOT NULL REFERENCES customers(customer_id) ON DELETE RESTRICT,
    employee_id INT NOT NULL REFERENCES employees(employee_id) ON DELETE RESTRICT,
    sale_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (tax_amount >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method VARCHAR(50) NOT NULL DEFAULT 'Apple Pay'
);

CREATE TABLE sale_items (
    sale_item_id SERIAL PRIMARY KEY,
    sale_id INT NOT NULL REFERENCES sales(sale_id) ON DELETE CASCADE,
    serial_number VARCHAR(64) NOT NULL UNIQUE REFERENCES inventory(serial_number) ON DELETE RESTRICT,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0)
);

CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    store_id INT NOT NULL REFERENCES stores(store_id) ON DELETE RESTRICT,
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

CREATE INDEX idx_inventory_in_stock ON inventory(product_id, store_id)
WHERE status = 'In Stock';

CREATE INDEX idx_inventory_store_status ON inventory(store_id, status);
CREATE INDEX idx_inventory_product_store ON inventory(product_id, store_id);

CREATE INDEX idx_products_fts ON products USING gin(to_tsvector('english', name || ' ' || specs::text));
CREATE INDEX idx_products_category_id ON products(category_id);

CREATE INDEX idx_sales_store_date ON sales(store_id, sale_date DESC);
CREATE INDEX idx_sales_customer_id ON sales(customer_id);
CREATE INDEX idx_sales_employee_id ON sales(employee_id);
CREATE INDEX idx_sales_receipt ON sales(receipt_number);

CREATE INDEX idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX idx_sale_items_serial ON sale_items(serial_number);

CREATE INDEX idx_appointments_store_status ON appointments(store_id, status);
CREATE INDEX idx_appointments_genius_id ON appointments(genius_id);
CREATE INDEX idx_appointments_customer_id ON appointments(customer_id);

CREATE INDEX idx_employees_store_role ON employees(store_id, role);

CREATE OR REPLACE VIEW v_inventory_summary AS
SELECT
    p.product_id,
    p.name AS product_name,
    c.name AS category_name,
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
JOIN categories c ON p.category_id = c.category_id
LEFT JOIN inventory i ON p.product_id = i.product_id
GROUP BY p.product_id, p.name, c.name, c.category_id, p.base_price, p.specs, p.image_url;

CREATE OR REPLACE VIEW v_store_performance AS
SELECT
    st.store_id,
    st.store_code,
    st.name AS store_name,
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
    SELECT
        store_id,
        COUNT(serial_number) AS total_inventory_units,
        COUNT(CASE WHEN status = 'In Stock' THEN 1 END) AS in_stock_units
    FROM inventory
    GROUP BY store_id
) inv ON st.store_id = inv.store_id
LEFT JOIN (
    SELECT
        store_id,
        COUNT(sale_id) AS total_sales_count,
        ROUND(SUM(total_amount), 2) AS total_revenue
    FROM sales
    GROUP BY store_id
) sal ON st.store_id = sal.store_id
LEFT JOIN (
    SELECT
        store_id,
        COUNT(appointment_id) AS active_repairs
    FROM appointments
    WHERE status IN ('Scheduled', 'In Progress', 'Awaiting Parts')
    GROUP BY store_id
) apt ON st.store_id = apt.store_id;

CREATE OR REPLACE VIEW v_sales_analytics AS
SELECT
    s.sale_id,
    s.receipt_number,
    st.store_code,
    st.name AS store_name,
    s.sale_date,
    c.name AS customer_name,
    c.email AS customer_email,
    e.name AS specialist_name,
    s.subtotal,
    s.tax_amount,
    s.total_amount,
    s.payment_method,
    COUNT(si.sale_item_id) AS items_count
FROM sales s
JOIN stores st ON s.store_id = st.store_id
JOIN customers c ON s.customer_id = c.customer_id
JOIN employees e ON s.employee_id = e.employee_id
LEFT JOIN sale_items si ON s.sale_id = si.sale_id
GROUP BY s.sale_id, s.receipt_number, st.store_code, st.name, s.sale_date, c.name, c.email, e.name, s.subtotal, s.tax_amount, s.total_amount, s.payment_method;

CREATE OR REPLACE FUNCTION fn_process_sale(
    p_store_id INT,
    p_customer_id INT,
    p_employee_id INT,
    p_serial_numbers VARCHAR[],
    p_payment_method VARCHAR DEFAULT 'Apple Pay'
)
RETURNS TABLE (
    out_sale_id INT,
    out_receipt_number VARCHAR,
    out_items_processed INT,
    out_total_amount NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_receipt_number VARCHAR(64);
    v_new_sale_id INT;
    v_serial VARCHAR(64);
    v_item_price NUMERIC(10, 2);
    v_calculated_subtotal NUMERIC(10, 2) := 0.00;
    v_tax_rate NUMERIC(5, 4);
    v_tax_amount NUMERIC(10, 2);
    v_item_status VARCHAR(30);
    v_item_store INT;
    v_item_count INT := 0;
BEGIN
    IF p_serial_numbers IS NULL OR array_length(p_serial_numbers, 1) = 0 THEN
        RAISE EXCEPTION 'Checkout transaction aborted: No items supplied in cart.';
    END IF;

    SELECT tax_rate INTO v_tax_rate FROM stores WHERE store_id = p_store_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Checkout aborted: Store ID % not found.', p_store_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM employees WHERE employee_id = p_employee_id AND active = TRUE) THEN
        RAISE EXCEPTION 'Checkout aborted: Invalid or inactive employee ID %', p_employee_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM customers WHERE customer_id = p_customer_id) THEN
        RAISE EXCEPTION 'Checkout aborted: Customer ID % does not exist.', p_customer_id;
    END IF;

    FOREACH v_serial IN ARRAY p_serial_numbers
    LOOP
        SELECT i.status, i.store_id, p.base_price
        INTO v_item_status, v_item_store, v_item_price
        FROM inventory i
        JOIN products p ON i.product_id = p.product_id
        WHERE i.serial_number = v_serial
        FOR UPDATE OF i;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Checkout aborted: Serial number % not found in database.', v_serial;
        END IF;

        IF v_item_store <> p_store_id THEN
            RAISE EXCEPTION 'Checkout aborted: Unit % is stocked at another store (Store ID %), not Store %.', v_serial, v_item_store, p_store_id;
        END IF;

        IF v_item_status <> 'In Stock' THEN
            RAISE EXCEPTION 'Checkout conflict: Unit % is unavailable (Status: %).', v_serial, v_item_status;
        END IF;

        v_calculated_subtotal := v_calculated_subtotal + v_item_price;
        v_item_count := v_item_count + 1;
    END LOOP;

    v_tax_amount := ROUND(v_calculated_subtotal * v_tax_rate, 2);
    v_receipt_number := 'R-APL-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 90000 + 10000)::TEXT, 5, '0');

    INSERT INTO sales (
        receipt_number,
        store_id,
        customer_id,
        employee_id,
        sale_date,
        subtotal,
        tax_amount,
        total_amount,
        payment_method
    ) VALUES (
        v_receipt_number,
        p_store_id,
        p_customer_id,
        p_employee_id,
        CURRENT_TIMESTAMP,
        v_calculated_subtotal,
        v_tax_amount,
        v_calculated_subtotal + v_tax_amount,
        p_payment_method
    ) RETURNING sale_id INTO v_new_sale_id;

    FOREACH v_serial IN ARRAY p_serial_numbers
    LOOP
        SELECT p.base_price INTO v_item_price
        FROM inventory i
        JOIN products p ON i.product_id = p.product_id
        WHERE i.serial_number = v_serial;

        INSERT INTO sale_items (sale_id, serial_number, unit_price)
        VALUES (v_new_sale_id, v_serial, v_item_price);

        UPDATE inventory
        SET status = 'Sold',
            updated_at = CURRENT_TIMESTAMP
        WHERE serial_number = v_serial;
    END LOOP;

    RETURN QUERY
    SELECT
        v_new_sale_id,
        v_receipt_number,
        v_item_count,
        (v_calculated_subtotal + v_tax_amount);
END;
$$;
