-- Enterprise Schema Migration for Apple StoreOS Flagship System

-- 1. Cost of Goods Sold (COGS) & Wholesale Cost for Products
ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price NUMERIC;

UPDATE products SET cost_price = CASE
  WHEN category_id = 'CAT-8' THEN ROUND((base_price * 0.15)::numeric, 2) -- AppleCare+ services (85% gross margin)
  WHEN category_id = 'CAT-10' THEN ROUND((base_price * 0.45)::numeric, 2) -- Accessories (55% gross margin)
  WHEN category_id IN ('CAT-1', 'CAT-7') THEN ROUND((base_price * 0.68)::numeric, 2) -- Mac & Desktops (32% gross margin)
  WHEN category_id IN ('CAT-4', 'CAT-3') THEN ROUND((base_price * 0.64)::numeric, 2) -- iPhone & iPad (36% gross margin)
  WHEN category_id IN ('CAT-2', 'CAT-5', 'CAT-9') THEN ROUND((base_price * 0.58)::numeric, 2) -- Audio, Watch, HomePod (42% gross margin)
  ELSE ROUND((base_price * 0.65)::numeric, 2)
END
WHERE cost_price IS NULL;

-- 2. Employee Certifications, Hourly Rate, and Manager PIN
ALTER TABLE employees ADD COLUMN IF NOT EXISTS certifications JSONB DEFAULT '["Apple Certified Associate", "Genius Bar Level 1"]'::jsonb;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS hourly_rate NUMERIC DEFAULT 32.50;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS manager_pin VARCHAR(10) DEFAULT '1234';

-- Ensure managers and supervisors have manager roles and pins
UPDATE employees SET 
  manager_pin = '8888',
  certifications = '["Master Genius ACMT", "Apple Certified Trainer", "Retail Leadership Level 3"]'::jsonb,
  hourly_rate = 52.00
WHERE role ILIKE '%Manager%' OR role ILIKE '%Director%' OR role ILIKE '%Lead%';

-- 3. Retail Store Zones & Interactive Seating Radar
CREATE TABLE IF NOT EXISTS store_zones (
  table_id SERIAL PRIMARY KEY,
  store_id VARCHAR(50) NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE,
  zone_type VARCHAR(50) NOT NULL,
  table_label VARCHAR(100) NOT NULL,
  capacity INT NOT NULL DEFAULT 4,
  current_occupancy INT NOT NULL DEFAULT 0,
  active_customer_id INT REFERENCES customers(customer_id) ON DELETE SET NULL,
  active_customer_name VARCHAR(100),
  assigned_specialist_id INT REFERENCES employees(employee_id) ON DELETE SET NULL,
  assigned_specialist_name VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'Available',
  pos_x INT NOT NULL DEFAULT 100,
  pos_y INT NOT NULL DEFAULT 100,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed Initial Retail Store Zones for ST-1 (Regent Street) and ST-2 (Fifth Avenue)
DELETE FROM store_zones;

INSERT INTO store_zones 
(store_id, zone_type, table_label, capacity, current_occupancy, active_customer_name, assigned_specialist_name, status, pos_x, pos_y)
VALUES
-- Regent Street (ST-1)
('ST-1', 'iPhone Avenue', 'Avenue Table 01 • iPhone 16 Pro', 6, 4, 'Marcus Aurelius', 'Sarah Jenkins', 'Occupied', 80, 80),
('ST-1', 'iPhone Avenue', 'Avenue Table 02 • iPhone 16 & SE', 6, 2, 'Elena Rostova', 'David Chen', 'Occupied', 280, 80),
('ST-1', 'Mac Showcase', 'Mac Studio Showcase 01', 4, 3, 'Alexander Wright', 'Marcus Vance', 'Occupied', 80, 220),
('ST-1', 'Mac Showcase', 'MacBook Pro & Air Bar 02', 6, 1, 'Sophie Dubois', 'Priya Patel', 'Occupied', 280, 220),
('ST-1', 'Vision Pro Demo Bay', 'Spatial Bay 01 • Guided Spatial Experience', 2, 1, 'Hiroshi Tanaka', 'David Chen', 'Appointment In-Progress', 480, 80),
('ST-1', 'Vision Pro Demo Bay', 'Spatial Bay 02 • M2 Ultra Workspace', 2, 0, NULL, NULL, 'Available', 480, 180),
('ST-1', 'Wearables Hub', 'Apple Watch Ultra & Studio Fitting 01', 4, 2, 'Olivia Sterling', 'Sarah Jenkins', 'Occupied', 480, 280),
('ST-1', 'Genius Bar Bench', 'Genius Bar Bench A • Hardware Diagnostics', 4, 4, 'Carlos Mendez', 'Marcus Vance', 'Appointment In-Progress', 80, 370),
('ST-1', 'Genius Bar Bench', 'Genius Bar Bench B • Display & Battery Repair', 4, 2, 'Emily Watson', 'Priya Patel', 'Appointment In-Progress', 280, 370),
('ST-1', 'Today at Apple Forum', 'Forum Amphitheater 6K Display Zone', 16, 9, 'Creative Workshop Attendees', 'Sarah Jenkins', 'Appointment In-Progress', 480, 370),

-- Fifth Avenue (ST-2)
('ST-2', 'iPhone Avenue', 'The Cube Avenue 01 • Flagship Display', 8, 5, 'Liam Gallagher', 'Michael Torres', 'Occupied', 80, 80),
('ST-2', 'Vision Pro Demo Bay', 'Underground Glass Spatial Suite A', 2, 2, 'Chloe Kim', 'Jessica Alverez', 'Appointment In-Progress', 280, 80),
('ST-2', 'Mac Showcase', 'Workstation Studio Array 01', 6, 3, 'Nathan Drake', 'Michael Torres', 'Occupied', 80, 220),
('ST-2', 'Genius Bar Bench', 'High-Excursion Genius Bar Stand 01', 6, 6, 'Serena Williams', 'Jessica Alverez', 'Appointment In-Progress', 280, 220);

-- 4. Specialist Shift Scheduling & Time Clock
CREATE TABLE IF NOT EXISTS specialist_time_logs (
  log_id SERIAL PRIMARY KEY,
  employee_id INT NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  store_id VARCHAR(50) NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE,
  clock_in TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  clock_out TIMESTAMP WITH TIME ZONE,
  break_minutes INT DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'Clocked In', -- 'Clocked In', 'On Break', 'Clocked Out'
  notes TEXT
);

CREATE TABLE IF NOT EXISTS specialist_schedules (
  schedule_id SERIAL PRIMARY KEY,
  employee_id INT NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  store_id VARCHAR(50) NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE,
  shift_date DATE NOT NULL,
  shift_start VARCHAR(10) NOT NULL,
  shift_end VARCHAR(10) NOT NULL,
  role_duty VARCHAR(50) NOT NULL DEFAULT 'Specialist POS',
  status VARCHAR(30) NOT NULL DEFAULT 'Scheduled' -- 'Scheduled', 'In Progress', 'Completed', 'Absent'
);

-- Seed Initial Schedules for current week
DELETE FROM specialist_schedules;
INSERT INTO specialist_schedules (employee_id, store_id, shift_date, shift_start, shift_end, role_duty, status)
SELECT 
  e.employee_id,
  e.store_id,
  CURRENT_DATE,
  '09:00',
  '17:30',
  CASE (e.employee_id % 4)
    WHEN 0 THEN 'Genius Bar Lead'
    WHEN 1 THEN 'Today at Apple Trainer'
    WHEN 2 THEN 'Inventory Logistics'
    ELSE 'Specialist POS'
  END,
  'In Progress'
FROM employees e
LIMIT 20;

-- 5. End-of-Day Till Reconciliations & Vault Drops
CREATE TABLE IF NOT EXISTS till_reconciliations (
  reconciliation_id SERIAL PRIMARY KEY,
  reconciliation_code VARCHAR(50) UNIQUE NOT NULL,
  store_id VARCHAR(50) NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE,
  employee_id INT NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  manager_id INT REFERENCES employees(employee_id) ON DELETE SET NULL,
  register_id VARCHAR(30) NOT NULL DEFAULT 'REG-01',
  opening_float NUMERIC NOT NULL DEFAULT 500.00,
  cash_sales NUMERIC NOT NULL DEFAULT 0.00,
  card_sales NUMERIC NOT NULL DEFAULT 0.00,
  apple_pay_sales NUMERIC NOT NULL DEFAULT 0.00,
  trade_in_credits NUMERIC NOT NULL DEFAULT 0.00,
  vault_drops NUMERIC NOT NULL DEFAULT 0.00,
  expected_cash NUMERIC NOT NULL DEFAULT 500.00,
  actual_cash_counted NUMERIC NOT NULL DEFAULT 500.00,
  variance NUMERIC NOT NULL DEFAULT 0.00,
  notes TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'Balanced',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cash_vault_drops (
  drop_id SERIAL PRIMARY KEY,
  store_id VARCHAR(50) NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE,
  employee_id INT NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  manager_witness_id INT REFERENCES employees(employee_id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL,
  bag_serial VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
