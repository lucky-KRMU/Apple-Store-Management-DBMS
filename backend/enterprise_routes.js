const express = require('express');

module.exports = function createEnterpriseRouter(db) {
  const router = express.Router();

  // ==========================================
  // 1. RETAIL STORE FLOORPLAN & LIVE SEATING RADAR
  // ==========================================

  // GET /floorplan/zones?store_id=ST-1
  router.get('/floorplan/zones', async (req, res, next) => {
    try {
      const storeId = req.query.store_id || 'ST-1';
      const result = await db.query(
        `SELECT * FROM store_zones WHERE store_id = $1 ORDER BY zone_type, table_label`,
        [storeId]
      );
      res.json(result.rows);
    } catch (err) {
      next(err);
    }
  });

  // PUT /floorplan/zones/:id/seat
  router.put('/floorplan/zones/:id/seat', async (req, res, next) => {
    try {
      const tableId = parseInt(req.params.id, 10);
      const { customer_name, specialist_name, occupancy, status } = req.body;
      const result = await db.query(
        `UPDATE store_zones 
         SET current_occupancy = COALESCE($1, current_occupancy),
             active_customer_name = COALESCE($2, active_customer_name),
             assigned_specialist_name = COALESCE($3, assigned_specialist_name),
             status = COALESCE($4, 'Occupied'),
             updated_at = NOW()
         WHERE table_id = $5
         RETURNING *`,
        [occupancy || 1, customer_name, specialist_name, status || 'Occupied', tableId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Zone table not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  });

  // PUT /floorplan/zones/:id/release
  router.put('/floorplan/zones/:id/release', async (req, res, next) => {
    try {
      const tableId = parseInt(req.params.id, 10);
      const result = await db.query(
        `UPDATE store_zones 
         SET current_occupancy = 0,
             active_customer_name = NULL,
             assigned_specialist_name = NULL,
             status = 'Available',
             updated_at = NOW()
         WHERE table_id = $1
         RETURNING *`,
        [tableId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Zone table not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  });

  // ==========================================
  // 2. SPECIALIST TIME CLOCK & SHIFT ROSTER
  // ==========================================

  // GET /specialists/time-logs?store_id=ST-1
  router.get('/specialists/time-logs', async (req, res, next) => {
    try {
      const storeId = req.query.store_id || 'ST-1';
      const result = await db.query(
        `SELECT l.*, e.name as employee_name, e.badge_number, e.role, e.hourly_rate
         FROM specialist_time_logs l
         JOIN employees e ON l.employee_id = e.employee_id
         WHERE l.store_id = $1 AND DATE(l.clock_in) = CURRENT_DATE
         ORDER BY l.clock_in DESC`,
        [storeId]
      );
      res.json(result.rows);
    } catch (err) {
      next(err);
    }
  });

  // POST /specialists/time-clock
  router.post('/specialists/time-clock', async (req, res, next) => {
    try {
      const { employee_id, store_id, action, notes } = req.body;
      const empId = parseInt(employee_id, 10);
      const sId = store_id || 'ST-1';

      if (action === 'clock_in') {
        const insertRes = await db.query(
          `INSERT INTO specialist_time_logs (employee_id, store_id, clock_in, status, notes)
           VALUES ($1, $2, NOW(), 'Clocked In', $3)
           RETURNING *`,
          [empId, sId, notes || 'Standard shift punch']
        );
        return res.json({ success: true, message: 'Clocked in successfully', log: insertRes.rows[0] });
      } else if (action === 'break') {
        const updateRes = await db.query(
          `UPDATE specialist_time_logs
           SET status = CASE WHEN status = 'On Break' THEN 'Clocked In' ELSE 'On Break' END,
               break_minutes = break_minutes + 15
           WHERE log_id = (
             SELECT log_id FROM specialist_time_logs
             WHERE employee_id = $1 AND store_id = $2 AND clock_out IS NULL
             ORDER BY clock_in DESC LIMIT 1
           )
           RETURNING *`,
          [empId, sId]
        );
        return res.json({ success: true, message: 'Break toggled', log: updateRes.rows[0] });
      } else if (action === 'clock_out') {
        const updateRes = await db.query(
          `UPDATE specialist_time_logs
           SET clock_out = NOW(), status = 'Clocked Out'
           WHERE log_id = (
             SELECT log_id FROM specialist_time_logs
             WHERE employee_id = $1 AND store_id = $2 AND clock_out IS NULL
             ORDER BY clock_in DESC LIMIT 1
           )
           RETURNING *`,
          [empId, sId]
        );
        return res.json({ success: true, message: 'Clocked out successfully', log: updateRes.rows[0] });
      } else {
        return res.status(400).json({ error: 'Invalid action. Must be clock_in, break, or clock_out' });
      }
    } catch (err) {
      next(err);
    }
  });

  // GET /specialists/schedules?store_id=ST-1
  router.get('/specialists/schedules', async (req, res, next) => {
    try {
      const storeId = req.query.store_id || 'ST-1';
      const result = await db.query(
        `SELECT s.*, e.name as employee_name, e.badge_number, e.role, e.certifications
         FROM specialist_schedules s
         JOIN employees e ON s.employee_id = e.employee_id
         WHERE s.store_id = $1
         ORDER BY s.shift_date DESC, s.shift_start ASC
         LIMIT 50`,
        [storeId]
      );
      res.json(result.rows);
    } catch (err) {
      next(err);
    }
  });

  // POST /specialists/schedules
  router.post('/specialists/schedules', async (req, res, next) => {
    try {
      const { employee_id, store_id, shift_date, shift_start, shift_end, role_duty } = req.body;
      const result = await db.query(
        `INSERT INTO specialist_schedules (employee_id, store_id, shift_date, shift_start, shift_end, role_duty, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'Scheduled')
         RETURNING *`,
        [employee_id, store_id || 'ST-1', shift_date || new Date().toISOString().split('T')[0], shift_start || '09:00', shift_end || '17:30', role_duty || 'Specialist POS']
      );
      res.json(result.rows[0]);
    } catch (err) {
      next(err);
    }
  });

  // GET /specialists/performance?store_id=ST-1
  router.get('/specialists/performance', async (req, res, next) => {
    try {
      const storeId = req.query.store_id;
      let query = `
        SELECT 
          e.employee_id,
          e.name as specialist_name,
          e.badge_number,
          e.role,
          e.store_id,
          e.certifications,
          COUNT(s.sale_id) as total_transactions,
          COALESCE(SUM(s.total_amount), 0) as total_revenue,
          COUNT(CASE WHEN p.category_id IN ('CAT-1', 'CAT-3', 'CAT-4', 'CAT-7') THEN 1 END) as hardware_units,
          COUNT(CASE WHEN p.category_id = 'CAT-8' THEN 1 END) as applecare_units,
          COUNT(CASE WHEN p.category_id = 'CAT-10' THEN 1 END) as accessory_units
        FROM employees e
        LEFT JOIN sales s ON e.employee_id = s.employee_id
        LEFT JOIN products p ON s.product_id = p.product_id
      `;
      const params = [];
      if (storeId) {
        query += ` WHERE e.store_id = $1`;
        params.push(storeId);
      }
      query += `
        GROUP BY e.employee_id, e.name, e.badge_number, e.role, e.store_id, e.certifications
        ORDER BY total_revenue DESC
        LIMIT 25
      `;
      const result = await db.query(query, params);
      
      const enriched = result.rows.map(r => {
        const hardware = parseInt(r.hardware_units, 10) || 1;
        const ac = parseInt(r.applecare_units, 10) || 0;
        const attachRate = Math.min(100, Math.round((ac / hardware) * 100));
        let badge = 'Specialist Pro';
        if (attachRate >= 35) badge = 'AppleCare Champion';
        else if (parseFloat(r.total_revenue) > 200000) badge = 'Flagship Top Gun';
        else if (parseInt(r.accessory_units, 10) > 40) badge = 'Ecosystem Master';

        return {
          ...r,
          total_revenue: parseFloat(r.total_revenue),
          attach_rate_pct: attachRate,
          achievement_badge: badge
        };
      });

      res.json(enriched);
    } catch (err) {
      next(err);
    }
  });

  // ==========================================
  // 3. TILL RECONCILIATION & CASH DRAWER
  // ==========================================

  // GET /reconciliation/current?store_id=ST-1&register_id=REG-01
  router.get('/reconciliation/current', async (req, res, next) => {
    try {
      const storeId = req.query.store_id || 'ST-1';
      const registerId = req.query.register_id || 'REG-01';

      // Aggregate today's sales by payment method
      const salesRes = await db.query(
        `SELECT 
          COALESCE(SUM(CASE WHEN payment_method = 'Cash' THEN total_amount ELSE 0 END), 0) as cash_sales,
          COALESCE(SUM(CASE WHEN payment_method ILIKE '%Card%' THEN total_amount ELSE 0 END), 0) as card_sales,
          COALESCE(SUM(CASE WHEN payment_method = 'Apple Pay' THEN total_amount ELSE 0 END), 0) as apple_pay_sales,
          COALESCE(SUM(total_amount), 0) as total_sales,
          COUNT(*) as transaction_count
         FROM sales
         WHERE store_id = $1 AND DATE(sale_date) = CURRENT_DATE`,
        [storeId]
      );

      // Vault drops for today
      const dropsRes = await db.query(
        `SELECT COALESCE(SUM(amount), 0) as total_vault_drops
         FROM cash_vault_drops
         WHERE store_id = $1 AND DATE(created_at) = CURRENT_DATE`,
        [storeId]
      );

      // Trade-in credits applied today
      const tradeRes = await db.query(
        `SELECT COALESCE(SUM(assessed_credit), 0) as total_trade_in_credit
         FROM trade_ins
         WHERE store_id = $1 AND DATE(created_at) = CURRENT_DATE AND applied_to_sale_id IS NOT NULL`,
        [storeId]
      );

      const openingFloat = 500.00;
      const cashSales = parseFloat(salesRes.rows[0].cash_sales) || 0;
      const cardSales = parseFloat(salesRes.rows[0].card_sales) || 0;
      const applePaySales = parseFloat(salesRes.rows[0].apple_pay_sales) || 0;
      const vaultDrops = parseFloat(dropsRes.rows[0].total_vault_drops) || 0;
      const tradeCredits = parseFloat(tradeRes.rows[0].total_trade_in_credit) || 0;
      const expectedCash = openingFloat + cashSales - vaultDrops;

      res.json({
        store_id: storeId,
        register_id: registerId,
        date: new Date().toISOString().split('T')[0],
        opening_float: openingFloat,
        cash_sales: cashSales,
        card_sales: cardSales,
        apple_pay_sales: applePaySales,
        total_sales: parseFloat(salesRes.rows[0].total_sales) || 0,
        transaction_count: parseInt(salesRes.rows[0].transaction_count, 10) || 0,
        trade_in_credits: tradeCredits,
        vault_drops: vaultDrops,
        expected_cash: expectedCash
      });
    } catch (err) {
      next(err);
    }
  });

  // POST /reconciliation/close
  router.post('/reconciliation/close', async (req, res, next) => {
    try {
      const {
        store_id, register_id, employee_id, manager_id, manager_pin,
        opening_float, actual_cash_counted, notes
      } = req.body;

      if (!manager_pin || (manager_pin !== '8888' && manager_pin !== '1234')) {
        return res.status(403).json({ error: 'Manager PIN authentication failed. Passcode required.' });
      }

      const storeId = store_id || 'ST-1';
      const regId = register_id || 'REG-01';

      // Compute live sums
      const salesRes = await db.query(
        `SELECT 
          COALESCE(SUM(CASE WHEN payment_method = 'Cash' THEN total_amount ELSE 0 END), 0) as cash_sales,
          COALESCE(SUM(CASE WHEN payment_method ILIKE '%Card%' THEN total_amount ELSE 0 END), 0) as card_sales,
          COALESCE(SUM(CASE WHEN payment_method = 'Apple Pay' THEN total_amount ELSE 0 END), 0) as apple_pay_sales
         FROM sales
         WHERE store_id = $1 AND DATE(sale_date) = CURRENT_DATE`,
        [storeId]
      );

      const dropsRes = await db.query(
        `SELECT COALESCE(SUM(amount), 0) as total_vault_drops
         FROM cash_vault_drops
         WHERE store_id = $1 AND DATE(created_at) = CURRENT_DATE`,
        [storeId]
      );

      const float = parseFloat(opening_float) || 500.00;
      const cashSales = parseFloat(salesRes.rows[0].cash_sales) || 0;
      const cardSales = parseFloat(salesRes.rows[0].card_sales) || 0;
      const applePaySales = parseFloat(salesRes.rows[0].apple_pay_sales) || 0;
      const vaultDrops = parseFloat(dropsRes.rows[0].total_vault_drops) || 0;
      const expected = float + cashSales - vaultDrops;
      const counted = parseFloat(actual_cash_counted) || 0;
      const variance = counted - expected;
      
      let status = 'Balanced';
      if (Math.abs(variance) > 0.01) {
        status = variance > 0 ? 'Over' : 'Short';
      }

      const recCode = `REC-${Date.now().toString(36).toUpperCase()}-${storeId}`;

      const insertRes = await db.query(
        `INSERT INTO till_reconciliations 
         (reconciliation_code, store_id, employee_id, manager_id, register_id, opening_float, cash_sales, card_sales, apple_pay_sales, vault_drops, expected_cash, actual_cash_counted, variance, notes, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING *`,
        [
          recCode, storeId, employee_id || 1, manager_id || 1, regId,
          float, cashSales, cardSales, applePaySales, vaultDrops, expected, counted, variance, notes || null, status
        ]
      );

      res.json({
        success: true,
        reconciliation: insertRes.rows[0]
      });
    } catch (err) {
      next(err);
    }
  });

  // POST /reconciliation/vault-drop
  router.post('/reconciliation/vault-drop', async (req, res, next) => {
    try {
      const { store_id, employee_id, manager_witness_id, amount, bag_serial, notes } = req.body;
      const dropRes = await db.query(
        `INSERT INTO cash_vault_drops (store_id, employee_id, manager_witness_id, amount, bag_serial, notes)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [store_id || 'ST-1', employee_id || 1, manager_witness_id || 2, parseFloat(amount), bag_serial || `BAG-${Date.now().toString(36).toUpperCase()}`, notes]
      );
      res.json({ success: true, vault_drop: dropRes.rows[0] });
    } catch (err) {
      next(err);
    }
  });

  // ==========================================
  // 4. MANAGER PIN VERIFICATION OVERRIDE
  // ==========================================
  router.post('/manager/verify-pin', async (req, res) => {
    const { pin, action } = req.body;
    if (pin === '8888' || pin === '1234') {
      return res.json({
        authorized: true,
        manager_name: 'Store Leader (Authorized)',
        action: action || 'General Override',
        timestamp: new Date().toISOString()
      });
    }
    return res.status(403).json({ authorized: false, error: 'Invalid Manager PIN' });
  });

  // ==========================================
  // 5. PROFIT MARGIN & COGS ANALYTICS
  // ==========================================
  router.get('/analytics/margins', async (req, res, next) => {
    try {
      const marginRes = await db.query(`
        SELECT 
          c.category_id,
          c.category_name,
          COALESCE(SUM(s.total_amount), 0) as total_revenue,
          COALESCE(SUM(COALESCE(p.cost_price, p.base_price * 0.65) * s.quantity), 0) as total_cogs,
          COALESCE(SUM(s.total_amount - (COALESCE(p.cost_price, p.base_price * 0.65) * s.quantity)), 0) as gross_profit,
          COUNT(s.sale_id) as units_sold
        FROM category c
        LEFT JOIN products p ON c.category_id = p.category_id
        LEFT JOIN sales s ON p.product_id = s.product_id
        GROUP BY c.category_id, c.category_name
        ORDER BY total_revenue DESC
      `);

      const totalRev = marginRes.rows.reduce((acc, r) => acc + parseFloat(r.total_revenue), 0);
      const totalCost = marginRes.rows.reduce((acc, r) => acc + parseFloat(r.total_cogs), 0);
      const totalProfit = totalRev - totalCost;
      const overallMarginPct = totalRev > 0 ? Math.round((totalProfit / totalRev) * 1000) / 10 : 0;

      const categoryBreakdown = marginRes.rows.map(r => {
        const rev = parseFloat(r.total_revenue);
        const cost = parseFloat(r.total_cogs);
        const profit = rev - cost;
        const marginPct = rev > 0 ? Math.round((profit / rev) * 1000) / 10 : 0;
        return {
          category_id: r.category_id,
          category_name: r.category_name,
          revenue: rev,
          cogs: cost,
          gross_profit: profit,
          margin_pct: marginPct,
          units_sold: parseInt(r.units_sold, 10)
        };
      });

      res.json({
        total_revenue: totalRev,
        total_cogs: totalCost,
        gross_profit: totalProfit,
        gross_margin_pct: overallMarginPct,
        categories: categoryBreakdown
      });
    } catch (err) {
      next(err);
    }
  });

  // ==========================================
  // 6. APPLE TRADE-IN DIAGNOSTICS SUITE
  // ==========================================
  router.post('/trade-ins/diagnostics', async (req, res) => {
    const {
      device_model,
      serial_number,
      battery_health_pct,
      screen_condition,
      casing_condition,
      face_id_working,
      camera_working,
      icloud_unlocked
    } = req.body;

    // Base valuation lookup table
    let baseValuation = 450;
    const model = (device_model || '').toLowerCase();
    if (model.includes('16 pro max')) baseValuation = 850;
    else if (model.includes('16 pro')) baseValuation = 750;
    else if (model.includes('16')) baseValuation = 550;
    else if (model.includes('15 pro max')) baseValuation = 650;
    else if (model.includes('15 pro')) baseValuation = 580;
    else if (model.includes('15')) baseValuation = 420;
    else if (model.includes('14')) baseValuation = 320;
    else if (model.includes('13')) baseValuation = 240;
    else if (model.includes('macbook pro')) baseValuation = 920;
    else if (model.includes('macbook air')) baseValuation = 600;
    else if (model.includes('ipad pro')) baseValuation = 500;
    else if (model.includes('watch ultra')) baseValuation = 380;

    let deduction = 0;
    const deductionsList = [];

    // Battery health check
    const battery = parseInt(battery_health_pct, 10) || 90;
    if (battery < 80) {
      deduction += 80;
      deductionsList.push({ item: 'Battery Servicing Required (<80%)', amount: -80 });
    }

    // Screen check
    if (screen_condition === 'Cracked') {
      deduction += 160;
      deductionsList.push({ item: 'Display Enclosure Replacement', amount: -160 });
    } else if (screen_condition === 'Scratched') {
      deduction += 40;
      deductionsList.push({ item: 'Minor Screen Wear', amount: -40 });
    }

    // Casing check
    if (casing_condition === 'Dented') {
      deduction += 70;
      deductionsList.push({ item: 'Chassis Dent / Structural Wear', amount: -70 });
    } else if (casing_condition === 'Scratched') {
      deduction += 30;
      deductionsList.push({ item: 'Cosmetic Surface Scratches', amount: -30 });
    }

    // Functional checks
    if (!face_id_working) {
      deduction += 120;
      deductionsList.push({ item: 'TrueDepth / Face ID Sensor Fault', amount: -120 });
    }
    if (!camera_working) {
      deduction += 90;
      deductionsList.push({ item: 'Rear Optical Module Issue', amount: -90 });
    }

    // iCloud check
    if (!icloud_unlocked) {
      return res.status(400).json({
        error: 'Activation Lock Active',
        message: 'Device cannot be accepted for trade-in while Find My / Activation Lock is enabled.'
      });
    }

    const assessedCredit = Math.max(50, baseValuation - deduction);
    let grade = 'Grade A+ (Pristine)';
    if (deduction > 150) grade = 'Grade C (Heavily Used)';
    else if (deduction > 50) grade = 'Grade B (Fair)';
    else if (deduction > 0) grade = 'Grade A (Good)';

    const diagCode = `APL-DIAG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    res.json({
      success: true,
      diagnostic_code: diagCode,
      device_model: device_model || 'iPhone Device',
      serial_number: serial_number || 'UNKNOWN',
      grade,
      battery_health_pct: battery,
      base_valuation: baseValuation,
      total_deductions: deduction,
      deductions_detail: deductionsList,
      assessed_credit: assessedCredit,
      valid_until: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
    });
  });

  // ==========================================
  // 7. APPLE WALLET DIGITAL PASS & DYNAMIC RECEIPT
  // ==========================================
  router.get('/sales/:id/wallet-pass', async (req, res, next) => {
    try {
      const saleId = req.params.id;
      const saleRes = await db.query(
        `SELECT s.*, c.name as customer_name, c.email as customer_email, st.store_name, st.address as store_address, e.name as specialist_name, p.name as product_name, p.image_url
         FROM sales s
         LEFT JOIN customers c ON s.customer_id = c.customer_id
         LEFT JOIN stores st ON s.store_id = st.store_id
         LEFT JOIN employees e ON s.employee_id = e.employee_id
         LEFT JOIN products p ON s.product_id = p.product_id
         WHERE s.sale_id = $1`,
        [saleId]
      );

      if (saleRes.rows.length === 0) {
        return res.status(404).json({ error: 'Sale record not found' });
      }

      const sale = saleRes.rows[0];

      // Format Apple Wallet Pass structure (.pkpass compatible metadata)
      const passPayload = {
        formatVersion: 1,
        passTypeIdentifier: 'pass.com.apple.storeos.receipt',
        serialNumber: sale.receipt_number || sale.sale_id,
        teamIdentifier: 'APPLESTOREOS',
        organizationName: 'Apple Retail Inc.',
        description: `Official Apple Store Receipt • ${sale.store_name}`,
        logoText: 'Apple Store',
        foregroundColor: 'rgb(255, 255, 255)',
        backgroundColor: 'rgb(18, 18, 22)',
        labelColor: 'rgb(161, 161, 170)',
        barcode: {
          format: 'PKBarcodeFormatQR',
          message: `https://apple.com/verify-receipt?id=${sale.sale_id}&store=${sale.store_id}`,
          messageEncoding: 'iso-8859-1',
          altText: sale.receipt_number || sale.sale_id
        },
        primaryFields: [
          {
            key: 'item',
            label: 'PURCHASED HARDWARE',
            value: sale.product_name || 'Apple Hardware System'
          }
        ],
        secondaryFields: [
          {
            key: 'total',
            label: 'TOTAL CHARGED',
            value: `$${Number(sale.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
          },
          {
            key: 'payment',
            label: 'PAYMENT METHOD',
            value: sale.payment_method || 'Apple Pay'
          }
        ],
        auxiliaryFields: [
          {
            key: 'store',
            label: 'STORE LOCATION',
            value: sale.store_name || 'Flagship Store'
          },
          {
            key: 'specialist',
            label: 'SPECIALIST',
            value: sale.specialist_name || 'Retail Specialist'
          },
          {
            key: 'date',
            label: 'TRANSACTION DATE',
            value: new Date(sale.sale_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          }
        ],
        backFields: [
          {
            key: 'customer',
            label: 'Customer Account',
            value: `${sale.customer_name} (${sale.customer_email || 'Verified'})`
          },
          {
            key: 'returns',
            label: 'Standard Return Policy',
            value: 'Eligible for return or exchange within 14 calendar days with valid digital receipt.'
          },
          {
            key: 'warranty',
            label: 'Limited Hardware Warranty',
            value: '1 Year Global Hardware Warranty + 90 Days Complimentary Technical Support.'
          }
        ]
      };

      res.json(passPayload);
    } catch (err) {
      next(err);
    }
  });

  return router;
};
