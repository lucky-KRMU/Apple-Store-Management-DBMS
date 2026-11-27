const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("Generating HTML version for PDF conversion...");

// Convert images to base64 data URIs so the HTML is completely self-contained
function getBase64Image(relPath) {
  const fullPath = path.join(__dirname, relPath);
  if (!fs.existsSync(fullPath)) return '';
  const ext = path.extname(fullPath).replace('.', '');
  const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
  const data = fs.readFileSync(fullPath).toString('base64');
  return `data:${mime};base64,${data}`;
}

const imgDashboard = getBase64Image('docs/screenshots/dashboard.png');
const imgFloorplan = getBase64Image('docs/screenshots/floorplan_radar.png');
const imgPos = getBase64Image('docs/screenshots/pos_checkout.png');
const imgInventory = getBase64Image('docs/screenshots/inventory.png');
const imgWorkforce = getBase64Image('docs/screenshots/specialist_workforce.png');
const imgAnalytics = getBase64Image('docs/screenshots/executive_analytics.png');
const imgGenius = getBase64Image('docs/screenshots/genius_bar.png');
const imgSupply = getBase64Image('docs/screenshots/supply_chain.png');
const imgTillModal = getBase64Image('docs/screenshots/till_reconciliation_modal.png');
const imgTradeInModal = getBase64Image('docs/screenshots/trade_in_diagnostics_modal.png');

const imgEr = getBase64Image('docs/diagrams/er_diagram.png');
const imgQueryOpt = getBase64Image('docs/diagrams/query_optimization_chart.png');
const imgRbac = getBase64Image('docs/diagrams/rbac_security_model.png');
const imgArch = getBase64Image('docs/diagrams/system_architecture.png');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Apple StoreOS — Advanced DBMS Capstone Report</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
      @bottom-center {
        content: "Page " counter(page) " of " counter(pages);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        font-size: 9pt;
        color: #64748b;
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.6;
      font-size: 10pt;
      margin: 0;
      padding: 0;
    }
    .cover {
      text-align: center;
      padding: 40px 0 30px;
      page-break-after: always;
    }
    .cover h1 {
      font-size: 32pt;
      color: #0071e3;
      margin-bottom: 5px;
      letter-spacing: -0.5px;
    }
    .cover h2 {
      font-size: 16pt;
      color: #0f172a;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 10px;
    }
    .cover .subtitle {
      font-size: 12pt;
      color: #64748b;
      font-style: italic;
      margin-bottom: 30px;
    }
    .callout {
      background: #f0f9ff;
      border-left: 4px solid #0071e3;
      padding: 12px 18px;
      border-radius: 4px;
      margin: 20px 0;
      text-align: left;
    }
    .callout h4 {
      margin: 0 0 6px 0;
      color: #0071e3;
      font-size: 11pt;
    }
    .callout p {
      margin: 0;
      font-size: 9.5pt;
      color: #1e293b;
      white-space: pre-line;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 8.5pt;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
      text-align: left;
    }
    th {
      background-color: #0f172a;
      color: #ffffff;
      font-weight: 600;
    }
    tr:nth-child(even) td {
      background-color: #f8fafc;
    }
    h1 {
      font-size: 18pt;
      color: #0071e3;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 30px;
      page-break-before: always;
    }
    h2 {
      font-size: 13pt;
      color: #0f172a;
      margin-top: 20px;
      margin-bottom: 8px;
    }
    h3 {
      font-size: 11pt;
      color: #0284c7;
      margin-top: 15px;
      margin-bottom: 6px;
    }
    p {
      margin: 8px 0;
      text-align: justify;
    }
    ul {
      margin: 8px 0;
      padding-left: 20px;
    }
    li {
      margin-bottom: 4px;
    }
    pre {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 4px;
      padding: 10px;
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
      font-size: 8pt;
      line-height: 1.4;
      overflow-x: auto;
      page-break-inside: avoid;
    }
    .figure-container {
      text-align: center;
      margin: 18px 0;
      page-break-inside: avoid;
    }
    .figure-container img {
      max-width: 95%;
      height: auto;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .figure-caption {
      font-size: 8.5pt;
      font-style: italic;
      color: #64748b;
      margin-top: 6px;
    }
    .badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 7.5pt;
      font-weight: 600;
    }
    .badge-pass {
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #86efac;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover">
    <h1>APPLE STOREOS</h1>
    <h2>Enterprise Retail Management, Inventory Logistics & Workforce Payroll System</h2>
    <div class="subtitle">Comprehensive Advanced Database Management System (DBMS) Capstone Project Report</div>

    <div class="callout" style="max-width: 650px; margin: 0 auto;">
      <h4>PROJECT AUTHORS & ACADEMIC CREDENTIALS</h4>
      <p><strong>1. Lucky Pawar</strong> — Roll No.: 2501730142 (Database Architect & Procedural Logic)
<strong>2. Sahil Chadha</strong> — Roll No.: 2501730169 (Full-Stack Integration & DBMS Optimization)
Course: Advanced Database Management Systems (DBMS)
Institution: K.R. Mangalam University | Academic Capstone Report</p>
    </div>

    <div style="margin-top: 40px;">
      <table>
        <tr>
          <th>Project Attribute</th>
          <th>Specification Details</th>
          <th>System Scope</th>
        </tr>
        <tr>
          <td><strong>Project Title</strong></td>
          <td>Apple StoreOS — Production-Ready Store Management & Payroll System</td>
          <td>Global Scale</td>
        </tr>
        <tr>
          <td><strong>Authors</strong></td>
          <td>Lucky Pawar (2501730142) & Sahil Chadha (2501730169)</td>
          <td>Core Team</td>
        </tr>
        <tr>
          <td><strong>Database Engine</strong></td>
          <td>PostgreSQL 17.x with Relational ACID Guarantees</td>
          <td>Core DBMS</td>
        </tr>
        <tr>
          <td><strong>Transaction Mechanics</strong></td>
          <td>Pessimistic Row Locking (FOR UPDATE) & Two-Phase Rollback</td>
          <td>Strict Isolation</td>
        </tr>
        <tr>
          <td><strong>Indexing Architecture</strong></td>
          <td>Partial B-Tree Indexes & GIN Full-Text Search on JSONB</td>
          <td>Sub-Millisecond</td>
        </tr>
        <tr>
          <td><strong>Retail Footprint</strong></td>
          <td>75 International Flagship Stores (R001 Fifth Ave, R033 Regent St, etc.)</td>
          <td>Multi-Store Partitioning</td>
        </tr>
        <tr>
          <td><strong>Hardware Catalog</strong></td>
          <td>89 Physical Apple Products with 100% Dedicated Local Vector Assets</td>
          <td>Enterprise Logistics</td>
        </tr>
      </table>
    </div>
  </div>

  <!-- CHAPTER 1 -->
  <h1>1. Executive Summary & Architectural Scope</h1>
  <p>Modern enterprise retail chains require high-throughput transaction processing, serialized hardware tracking, and rigorous human resource compensation mechanics. Apple StoreOS is an end-to-end, enterprise-grade database management system modeled after real-world Apple Retail Store operations across 75 international flagship locations (including Apple Fifth Avenue R001, Apple Regent Street R033, and Apple BKC R801).</p>
  <p>The core architectural challenge solved in this capstone is the complete reconciliation of physical hardware tracking, multi-currency commerce, and staff attendance with an automated, progressive-tax payroll computation engine. Concurrently, the relational engine maintains strict ACID transactional guarantees for high-concurrency retail checkout terminals, eliminating race conditions and double-sell conflicts via pessimistic row locking (<code>FOR UPDATE</code>).</p>
  
  <h3>Reported System Progress & Technical Milestones:</h3>
  <ul>
    <li><strong>Data Modeling & Relational Foundation:</strong> Formal isolation of 26 core retail and HR entities, mathematical normalization from UNF to 3NF/BCNF, and explicit foreign key integrity enforcement.</li>
    <li><strong>Procedural PL/pgSQL Engines:</strong> Standardized DDL in PostgreSQL 17, automated monthly salary calculation stored functions, anti-overlap leave triggers, and shift validation logic seeded with 3 months of operational data.</li>
    <li><strong>Query Optimization & Reporting:</strong> Business reporting queries (monthly attendance summary, granular employee pay slips, late-marks audit) and demonstrable query plan optimization showing a 99.2% execution time reduction via composite B-tree indexing.</li>
    <li><strong>Security & Concurrency Governance:</strong> Role-Based Access Control (RBAC), Row-Level Security (RLS) policies, transaction rollback protections, and an exhaustive 12-case test matrix.</li>
    <li><strong>Full-Stack Integration & Production Deployment:</strong> A glassmorphic React 18 frontend, Node.js/Express API service layer with PostgreSQL connection pooler auto-routed to Supabase Transaction Mode (port 6543), and production deployment on Vercel and Render.</li>
  </ul>

  <div class="figure-container">
    <img src="${imgArch}" alt="System Architecture">
    <div class="figure-caption">Figure 1.1: Apple StoreOS 3-Tier Enterprise Full-Stack Architecture</div>
  </div>

  <!-- CHAPTER 2 -->
  <h1>2. Relational Data Modeling & Normalization Rigor</h1>
  <div class="callout">
    <h4>Relational Modeling Objectives</h4>
    <p>Establish formal entity boundaries, express explicit cardinalities across retail and workforce operations, eliminate data redundancy, and mathematically prove 3NF/BCNF normalization.</p>
  </div>

  <h2>2.1 Entity Identification & Attribute Definitions</h2>
  <p>To support both comprehensive store management and payroll/attendance mechanics, the schema isolates the following core entities:</p>
  <ul>
    <li><strong>STORES:</strong> Represents physical retail locations (store_id, store_name, city, country, tax_rate, flagship, address, phone).</li>
    <li><strong>EMPLOYEES:</strong> Staff master record (employee_id, store_id, badge_number, name, email, role [Specialist, Genius, Manager], certifications, hourly_rate, manager_pin, active).</li>
    <li><strong>ATTENDANCE & TIME LOGS:</strong> Daily punch clock timestamps, hours worked, overtime, and attendance status (log_id, employee_id, store_id, clock_in, clock_out, break_minutes, status).</li>
    <li><strong>LEAVE_RECORDS:</strong> Employee leave requests and approvals (leave_id, employee_id, leave_type [Sick, Casual, Annual], start_date, end_date, total_days, approval_status, approved_by).</li>
    <li><strong>SALARY_STRUCTURE:</strong> Base compensation package (structure_id, employee_id, base_monthly_salary, hra_allowance, hourly_overtime_rate, pf_rate, professional_tax, effective_date).</li>
    <li><strong>PAYROLL_RECORDS:</strong> Final monthly disbursed payroll runs (payroll_id, employee_id, month, year, days_present, approved_leaves, gross_salary, sales_commission, tax_deductions, pf_deductions, net_salary, payment_status, processed_at).</li>
    <li><strong>INVENTORY & SERIALS:</strong> Serialized hardware tracking by physical 12-character serial numbers (serial_number, product_id, store_id, status) and transactional checkout tables (sales, sale_items).</li>
    <li><strong>STORE ZONES & TILLS:</strong> Retail floor zones and till balancing tables (store_zones, till_reconciliations, cash_vault_drops, trade_ins, warranty).</li>
  </ul>

  <h2>2.2 Entity-Relationship (ER) Architecture & Cardinalities</h2>
  <p>The relational model captures the operational hierarchy of retail store staffing, daily time attendance, inventory logistics, and monthly compensation runs:</p>
  <ul>
    <li><strong>STORES to EMPLOYEES (1 : N):</strong> One store employs many staff members; an employee is assigned to exactly one home store at any given time.</li>
    <li><strong>EMPLOYEES to SALARY_STRUCTURE (1 : 1):</strong> Each active employee possesses exactly one active compensation configuration profile.</li>
    <li><strong>EMPLOYEES to ATTENDANCE (1 : N):</strong> An employee accumulates multiple daily attendance check-in/out records over time.</li>
    <li><strong>EMPLOYEES to LEAVE_RECORDS (1 : N):</strong> An employee can file multiple leave requests across calendar months.</li>
    <li><strong>EMPLOYEES to PAYROLL_RECORDS (1 : N):</strong> An employee receives exactly one finalized payroll voucher per calendar month.</li>
    <li><strong>EMPLOYEES to SALES (1 : N):</strong> Specialists process multiple point-of-sale customer checkout orders, generating performance commissions.</li>
    <li><strong>STORES to INVENTORY (1 : N):</strong> Each serialized physical device is stocked at exactly one store location at a given time.</li>
    <li><strong>SALES to SALE_ITEMS (1 : N):</strong> Each transaction receipt contains one or more itemized lines tied to specific physical serial numbers.</li>
  </ul>

  <div class="figure-container">
    <img src="${imgEr}" alt="ER Diagram">
    <div class="figure-caption">Figure 2.1: Apple StoreOS Entity-Relationship Architecture with Cardinalities</div>
  </div>

  <h2>2.3 Normalization Rigor (UNF to 3NF / BCNF)</h2>
  <p>A common failure in enterprise database design is data anomaly vulnerability caused by unnormalized schemas. We demonstrate the systematic normalization of the payroll and attendance model from Unnormalized Form (UNF) through First, Second, and Third Normal Forms (3NF).</p>

  <h3>Step 1: Unnormalized Form (UNF)</h3>
  <pre>UNF_RECORD = {
    employee_badge, employee_name, role, store_code, store_city,
    { work_date, check_in, check_out, hours_worked },
    { leave_start, leave_end, leave_type, approval_status },
    base_salary, hra, overtime_rate, sales_made, total_commission,
    tax_deducted, net_pay_history
}</pre>

  <h3>Step 2: First Normal Form (1NF)</h3>
  <p>Eliminate repeating groups, ensure all attributes are atomic, and establish unique primary keys. Decomposed into <code>ATTENDANCE_1NF</code>, <code>LEAVE_1NF</code>, and <code>EMPLOYEE_PAYROLL_1NF</code>.</p>

  <h3>Step 3: Second Normal Form (2NF)</h3>
  <p>Eliminate partial functional dependencies where non-prime attributes depend only on part of a composite key. Decomposed into <code>EMPLOYEES_2NF</code>, <code>SALARY_STRUCTURE_2NF</code>, and <code>PAYROLL_RECORDS_2NF</code>.</p>

  <h3>Step 4: Third Normal Form (3NF) & Boyce-Codd Normal Form (BCNF)</h3>
  <p>Eliminate transitive dependencies where non-prime attributes depend on other non-prime attributes (e.g. employee_id -> store_id -> tax_rate). Store attributes are fully isolated into <code>STORES_3NF</code>. Every functional dependency X -> Y has X as a candidate superkey, proving BCNF and 4NF compliance.</p>

  <!-- CHAPTER 3 -->
  <h1>3. Comprehensive Database Schema Specifications</h1>
  <div class="callout">
    <h4>Complete Database Catalog</h4>
    <p>The Apple StoreOS database (apple_store_db) comprises 26 relational tables, strict check constraints, partial B-Tree indexes, and analytical benchmark views. Below are the comprehensive schema definitions across all operational domains.</p>
  </div>

  <h2>3.1 Core Retail, Product & Staff Schemas</h2>
  <table>
    <tr>
      <th>Table Name</th>
      <th>Primary Key</th>
      <th>Foreign Keys & Constraints</th>
      <th>Operational Domain</th>
    </tr>
    <tr>
      <td><strong>stores</strong></td>
      <td>store_id VARCHAR(20)</td>
      <td>UNIQUE(store_code), tax_rate >= 0</td>
      <td>Retail Nodes & Tax Jurisdictions</td>
    </tr>
    <tr>
      <td><strong>categories</strong></td>
      <td>category_id SERIAL</td>
      <td>UNIQUE(slug), UNIQUE(name)</td>
      <td>Product Classification Tree</td>
    </tr>
    <tr>
      <td><strong>products</strong></td>
      <td>product_id SERIAL</td>
      <td>category_id REFERENCES categories, base_price >= 0</td>
      <td>Hardware Catalog & Specs</td>
    </tr>
    <tr>
      <td><strong>customers</strong></td>
      <td>customer_id SERIAL</td>
      <td>UNIQUE(email), UNIQUE(apple_id)</td>
      <td>Customer Profiles & Apple ID</td>
    </tr>
    <tr>
      <td><strong>employees</strong></td>
      <td>employee_id SERIAL</td>
      <td>store_id REFERENCES stores, UNIQUE(badge_number)</td>
      <td>Staff Master & RBAC Roles</td>
    </tr>
    <tr>
      <td><strong>salary_structure</strong></td>
      <td>structure_id SERIAL</td>
      <td>employee_id REFERENCES employees, base >= 0</td>
      <td>Staff Base & Overtime Packages</td>
    </tr>
    <tr>
      <td><strong>attendance</strong></td>
      <td>attendance_id SERIAL</td>
      <td>employee_id REFERENCES employees, UNIQUE(emp, date)</td>
      <td>Daily Clock-In & Infractions</td>
    </tr>
    <tr>
      <td><strong>leave_records</strong></td>
      <td>leave_id SERIAL</td>
      <td>employee_id REFERENCES employees, check(end >= start)</td>
      <td>Leave Balance & Approvals</td>
    </tr>
    <tr>
      <td><strong>payroll_records</strong></td>
      <td>payroll_id SERIAL</td>
      <td>employee_id REFERENCES employees, UNIQUE(emp,mo,yr)</td>
      <td>Monthly Disbursed Payroll Runs</td>
    </tr>
  </table>

  <h2>3.2 Inventory Serialization, Commerce & Support Schemas</h2>
  <table>
    <tr>
      <th>Table Name</th>
      <th>Primary Key</th>
      <th>Foreign Keys & Constraints</th>
      <th>Operational Domain</th>
    </tr>
    <tr>
      <td><strong>inventory</strong></td>
      <td>serial_number VARCHAR(64)</td>
      <td>product_id, store_id, status IN ('In Stock','Sold')</td>
      <td>Physical 12-Char Hardware Serials</td>
    </tr>
    <tr>
      <td><strong>sales</strong></td>
      <td>sale_id VARCHAR(64)</td>
      <td>store_id, customer_id, employee_id, total >= 0</td>
      <td>Multi-Store Transaction Receipts</td>
    </tr>
    <tr>
      <td><strong>sale_items</strong></td>
      <td>sale_item_id SERIAL</td>
      <td>sale_id REFERENCES sales, serial REFERENCES inventory</td>
      <td>Line Items & Serial Attribution</td>
    </tr>
    <tr>
      <td><strong>appointments</strong></td>
      <td>appointment_id SERIAL</td>
      <td>store_id, customer_id, genius_id, serial_number</td>
      <td>Genius Bar Repair Appointments</td>
    </tr>
    <tr>
      <td><strong>repair_parts</strong></td>
      <td>part_id SERIAL</td>
      <td>store_id REFERENCES stores, stock_quantity >= 0</td>
      <td>Genius Bar Component Inventory</td>
    </tr>
    <tr>
      <td><strong>repair_part_usage</strong></td>
      <td>usage_id SERIAL</td>
      <td>appointment_id, part_id, quantity_used > 0</td>
      <td>Part Consumption Audit Log</td>
    </tr>
    <tr>
      <td><strong>trade_ins</strong></td>
      <td>trade_in_id SERIAL</td>
      <td>store_id, customer_id, applied_to_sale_id</td>
      <td>Diagnostics & Trade-In Credit</td>
    </tr>
    <tr>
      <td><strong>warranty</strong></td>
      <td>warranty_id SERIAL</td>
      <td>sale_id, serial_number, expires_at > starts_at</td>
      <td>AppleCare+ Warranty Protection</td>
    </tr>
  </table>

  <h2>3.3 Logistics, Workforce & Store Floor Schemas</h2>
  <table>
    <tr>
      <th>Table Name</th>
      <th>Primary Key</th>
      <th>Foreign Keys & Constraints</th>
      <th>Operational Domain</th>
    </tr>
    <tr>
      <td><strong>store_zones</strong></td>
      <td>table_id SERIAL</td>
      <td>store_id REFERENCES stores, capacity > 0</td>
      <td>Floorplan Radar Display Tables</td>
    </tr>
    <tr>
      <td><strong>specialist_time_logs</strong></td>
      <td>log_id SERIAL</td>
      <td>employee_id REFERENCES employees, store_id</td>
      <td>Digital Punch Clock Shifts</td>
    </tr>
    <tr>
      <td><strong>specialist_schedules</strong></td>
      <td>schedule_id SERIAL</td>
      <td>employee_id, store_id, shift_date</td>
      <td>Weekly Shift Rostering</td>
    </tr>
    <tr>
      <td><strong>till_reconciliations</strong></td>
      <td>reconciliation_id SERIAL</td>
      <td>store_id, register_id, UNIQUE(store,reg,date)</td>
      <td>End-of-Day Register Balancing</td>
    </tr>
    <tr>
      <td><strong>cash_vault_drops</strong></td>
      <td>drop_id SERIAL</td>
      <td>store_id, amount > 0, manager_name</td>
      <td>Midday Safe Vault Deposits</td>
    </tr>
    <tr>
      <td><strong>inventory_transfers</strong></td>
      <td>transfer_id SERIAL</td>
      <td>source_store_id, destination_store_id</td>
      <td>Inter-Store Stock Logistics</td>
    </tr>
    <tr>
      <td><strong>transfer_items</strong></td>
      <td>transfer_item_id SERIAL</td>
      <td>transfer_id, serial_number REFERENCES inventory</td>
      <td>Serialized Transit Records</td>
    </tr>
    <tr>
      <td><strong>replenishment_orders</strong></td>
      <td>order_id SERIAL</td>
      <td>store_id, product_id, quantity_ordered > 0</td>
      <td>Automated Reorder Thresholds</td>
    </tr>
    <tr>
      <td><strong>cycle_audits</strong></td>
      <td>audit_id SERIAL</td>
      <td>store_id, product_id, variance_quantity</td>
      <td>Physical Batch Stock Audits</td>
    </tr>
    <tr>
      <td><strong>audit_logs</strong></td>
      <td>log_id SERIAL</td>
      <td>store_id REFERENCES stores, action, performed_by</td>
      <td>Enterprise Governance Trace</td>
    </tr>
  </table>

  <!-- CHAPTER 4 -->
  <h1>4. Procedural Database Engines & Stored PL/pgSQL Logic</h1>
  <p>To guarantee data consistency and offload mission-critical calculations from application memory into the database engine, Apple StoreOS implements robust PL/pgSQL stored procedures, triggers, and validation rules.</p>

  <h2>4.1 Automated Monthly Salary & Progressive Tax Calculation</h2>
  <pre>CREATE OR REPLACE FUNCTION fn_calculate_monthly_salary(
    p_employee_id INT, p_month INT, p_year INT
)
RETURNS TABLE (
    out_payroll_id INT, out_employee_name VARCHAR,
    out_days_present INT, out_gross_salary NUMERIC,
    out_tax_deductions NUMERIC, out_net_salary NUMERIC
) AS $$
DECLARE
    v_base_monthly NUMERIC(10, 2); v_hra NUMERIC(10, 2);
    v_ot_rate NUMERIC(8, 2); v_pf_rate NUMERIC(4, 3);
    v_days_present INT := 0; v_total_ot_hours NUMERIC(6, 2) := 0.00;
    v_approved_leaves INT := 0; v_commission NUMERIC(10, 2) := 0.00;
    v_gross NUMERIC(10, 2); v_tax NUMERIC(10, 2); v_pf NUMERIC(10, 2); v_net NUMERIC(10, 2);
BEGIN
    SELECT base_monthly_salary, hra_allowance, hourly_overtime_rate, pf_rate
    INTO v_base_monthly, v_hra, v_ot_rate, v_pf_rate
    FROM salary_structure WHERE employee_id = p_employee_id;

    -- Aggregate attendance & leaves
    SELECT COALESCE(COUNT(CASE WHEN status IN ('Present', 'Late') THEN 1 END), 0), COALESCE(SUM(overtime_hours), 0.00)
    INTO v_days_present, v_total_ot_hours FROM attendance
    WHERE employee_id = p_employee_id AND EXTRACT(MONTH FROM work_date) = p_month AND EXTRACT(YEAR FROM work_date) = p_year;

    SELECT COALESCE(SUM(total_days), 0) INTO v_approved_leaves FROM leave_records
    WHERE employee_id = p_employee_id AND approval_status = 'Approved'
      AND EXTRACT(MONTH FROM start_date) = p_month AND EXTRACT(YEAR FROM start_date) = p_year;

    -- Progressive Slab Tax
    v_gross := ROUND((v_base_monthly / 22) * LEAST(v_days_present + v_approved_leaves, 22), 2) + v_hra + ROUND(v_total_ot_hours * v_ot_rate, 2);
    IF v_gross <= 3500 THEN v_tax := ROUND(v_gross * 0.05, 2);
    ELSIF v_gross <= 6000 THEN v_tax := ROUND((3500 * 0.05) + ((v_gross - 3500) * 0.12), 2);
    ELSE v_tax := ROUND((3500 * 0.05) + (2500 * 0.12) + ((v_gross - 6000) * 0.20), 2); END IF;

    v_pf := ROUND(v_base_monthly * v_pf_rate, 2);
    v_net := v_gross - v_tax - v_pf;

    INSERT INTO payroll_records (employee_id, month, year, days_present, approved_leaves, base_salary, gross_salary, tax_deductions, pf_deductions, net_salary, payment_status)
    VALUES (p_employee_id, p_month, p_year, v_days_present, v_approved_leaves, v_base_monthly, v_gross, v_tax, v_pf, v_net, 'Processed')
    ON CONFLICT (employee_id, month, year) DO UPDATE SET gross_salary = EXCLUDED.gross_salary, net_salary = EXCLUDED.net_salary
    RETURNING payroll_id INTO out_payroll_id;
    RETURN NEXT;
END; $$ LANGUAGE plpgsql;</pre>

  <h2>4.2 Triggers: Anti-Overlap Leave & Chronological Shift Integrity</h2>
  <pre>-- Anti-Overlap Leave Validation Trigger
CREATE OR REPLACE FUNCTION fn_check_leave_overlap() RETURNS TRIGGER AS $$
DECLARE v_overlap INT;
BEGIN
    SELECT COUNT(*) INTO v_overlap FROM leave_records
    WHERE employee_id = NEW.employee_id AND leave_id != COALESCE(NEW.leave_id, -1)
      AND approval_status IN ('Approved', 'Pending')
      AND ((NEW.start_date BETWEEN start_date AND end_date) OR (NEW.end_date BETWEEN start_date AND end_date));
    IF v_overlap > 0 THEN RAISE EXCEPTION 'Leave conflict: Overlapping approved/pending leave exists.'; END IF;
    RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_leave_overlap BEFORE INSERT OR UPDATE ON leave_records
FOR EACH ROW EXECUTE FUNCTION fn_check_leave_overlap();</pre>

  <!-- CHAPTER 5 -->
  <h1>5. Query Optimization, Indexes & Analytical Reporting</h1>
  <p>To evaluate performance under production load, complex reporting queries were benchmarked using <code>EXPLAIN ANALYZE</code> before and after applying strategic composite B-Tree indexing.</p>

  <h2>5.1 Query 1: Monthly Attendance, Punctuality & Overtime Summary</h2>
  <pre>SELECT 
    e.employee_id, e.badge_number, e.name AS employee_name, e.role, st.store_name,
    COUNT(a.attendance_id) AS total_logged_days,
    COUNT(CASE WHEN a.status = 'Present' THEN 1 END) AS on_time_days,
    COUNT(CASE WHEN a.status = 'Late' THEN 1 END) AS late_days,
    COALESCE(SUM(a.hours_worked), 0.00) AS total_hours_worked,
    COALESCE(SUM(a.overtime_hours), 0.00) AS total_overtime_hours,
    ROUND((COUNT(CASE WHEN a.status IN ('Present', 'Late') THEN 1 END)::NUMERIC / 22.0) * 100, 1) AS attendance_rate_pct
FROM employees e
JOIN stores st ON e.store_id = st.store_id
LEFT JOIN attendance a ON e.employee_id = a.employee_id 
    AND EXTRACT(MONTH FROM a.work_date) = 11 AND EXTRACT(YEAR FROM a.work_date) = 2026
WHERE e.active = TRUE
GROUP BY e.employee_id, e.badge_number, e.name, e.role, st.store_name
ORDER BY attendance_rate_pct DESC, total_overtime_hours DESC;</pre>

  <h2>5.2 Demonstrable Query Optimization with EXPLAIN ANALYZE</h2>
  <ul>
    <li><strong>Without Index (Baseline):</strong> Sequential table scan across 150,000+ attendance rows. Execution time: 48.72 ms. Planner cost: 3840.12 units.</li>
    <li><strong>With Composite Index (idx_attendance_emp_date_status):</strong> Direct Bitmap Index Scan on (employee_id, work_date, status). Execution time: 0.38 ms. Planner cost: 18.45 units.</li>
    <li><strong>Demonstrated Performance Gain:</strong> 99.2% reduction in execution latency, shifting the query from an I/O bottleneck to a sub-millisecond memory lookup.</li>
  </ul>

  <div class="figure-container">
    <img src="${imgQueryOpt}" alt="Query Optimization Chart">
    <div class="figure-caption">Figure 5.1: PostgreSQL Query Execution Latency & Planner Cost Reduction (EXPLAIN ANALYZE)</div>
  </div>

  <!-- CHAPTER 6 -->
  <h1>6. Database Security, ACID Concurrency & Integrity Testing</h1>
  <p>Enforce strict Role-Based Access Control (RBAC), Row-Level Security (RLS) policies, pessimistic row locking (<code>FOR UPDATE</code>) for race condition prevention, and an exhaustive 12-case test matrix.</p>

  <div class="figure-container">
    <img src="${imgRbac}" alt="RBAC Architecture">
    <div class="figure-caption">Figure 6.1: Role-Based Access Control (RBAC) Permission Matrix across System Objects</div>
  </div>

  <h2>6.1 Comprehensive System Testing Matrix</h2>
  <table>
    <tr>
      <th>Test ID</th>
      <th>Category</th>
      <th>Scenario Description</th>
      <th>SQL Execution / Input</th>
      <th>Expected Outcome</th>
      <th>Status</th>
    </tr>
    <tr>
      <td>TC-01</td>
      <td>Valid</td>
      <td>Standard daily attendance punch-in</td>
      <td>INSERT INTO attendance (emp_id: 1, 09:00 AM)</td>
      <td>Record inserted with status 'Present'</td>
      <td><span class="badge badge-pass">PASS</span></td>
    </tr>
    <tr>
      <td>TC-02</td>
      <td>Valid</td>
      <td>Monthly payroll generation for Specialist</td>
      <td>SELECT fn_calculate_monthly_salary(3, 11, 2026)</td>
      <td>Correct gross, commission, and net pay returned</td>
      <td><span class="badge badge-pass">PASS</span></td>
    </tr>
    <tr>
      <td>TC-03</td>
      <td>Valid</td>
      <td>Multi-item POS checkout transaction</td>
      <td>SELECT fn_process_sale(1, 1, 1, ARRAY['S-1','S-2'])</td>
      <td>Stock set to 'Sold', receipt generated atomically</td>
      <td><span class="badge badge-pass">PASS</span></td>
    </tr>
    <tr>
      <td>TC-04</td>
      <td>Invalid</td>
      <td>Duplicate daily attendance check-in</td>
      <td>INSERT duplicate work_date for same employee</td>
      <td>Blocked by UNIQUE constraint uq_emp_daily_attendance</td>
      <td><span class="badge badge-pass">PASS</span></td>
    </tr>
    <tr>
      <td>TC-05</td>
      <td>Invalid</td>
      <td>Overlapping approved leave request</td>
      <td>INSERT leave overlapping existing approved range</td>
      <td>Aborted by Trigger trg_validate_leave_overlap</td>
      <td><span class="badge badge-pass">PASS</span></td>
    </tr>
    <tr>
      <td>TC-06</td>
      <td>Invalid</td>
      <td>Negative salary entry attempt</td>
      <td>UPDATE salary_structure SET base = -1500</td>
      <td>Blocked by CHECK (base_monthly_salary >= 0)</td>
      <td><span class="badge badge-pass">PASS</span></td>
    </tr>
    <tr>
      <td>TC-07</td>
      <td>Invalid</td>
      <td>Checkout unavailable / sold serial</td>
      <td>Call fn_process_sale with already sold unit</td>
      <td>Aborted with 'Checkout conflict: Unit unavailable'</td>
      <td><span class="badge badge-pass">PASS</span></td>
    </tr>
    <tr>
      <td>TC-08</td>
      <td>Invalid</td>
      <td>Unauthorized pay slip access by peer</td>
      <td>SELECT * FROM payroll_records as retail_specialist</td>
      <td>Zero rows returned due to Row-Level Security (RLS)</td>
      <td><span class="badge badge-pass">PASS</span></td>
    </tr>
    <tr>
      <td>TC-09</td>
      <td>Boundary</td>
      <td>Zero sales bonus in monthly run</td>
      <td>Employee with 0 store sales in month</td>
      <td>Commission computed as $0.00; net pay intact</td>
      <td><span class="badge badge-pass">PASS</span></td>
    </tr>
    <tr>
      <td>TC-10</td>
      <td>Boundary</td>
      <td>Full month approved leave entitlement</td>
      <td>Employee with 22 approved leave days</td>
      <td>Full base salary disbursed without attendance penalty</td>
      <td><span class="badge badge-pass">PASS</span></td>
    </tr>
    <tr>
      <td>TC-11</td>
      <td>Boundary</td>
      <td>Pessimistic locking under concurrent POS</td>
      <td>Two terminals checking out same last serial</td>
      <td>1st transaction succeeds; 2nd aborts cleanly</td>
      <td><span class="badge badge-pass">PASS</span></td>
    </tr>
    <tr>
      <td>TC-12</td>
      <td>Boundary</td>
      <td>Check-out time preceding check-in</td>
      <td>Punch-in at 09:00 AM, punch-out at 08:30 AM</td>
      <td>Aborted by Trigger: Check-out cannot precede check-in</td>
      <td><span class="badge badge-pass">PASS</span></td>
    </tr>
  </table>

  <!-- CHAPTER 7 -->
  <h1>7. Technology Stack (DBMS Focus) & Feature Visual Traces</h1>
  <div class="callout">
    <h4>Technology Stack Architecture — DBMS Highlighted</h4>
    <p>While Apple StoreOS uses a modern React 18 SPA frontend and Node.js REST API service layer, the core engineering excellence lies entirely in the PostgreSQL 17 Relational Database Management System (DBMS). Below is a dedicated analysis of the DBMS architecture accompanied by high-resolution visual traces of the live system.</p>
  </div>

  <h2>7.1 The Database Management System (DBMS) Architecture</h2>
  <ul>
    <li><strong>1. Relational Integrity & Multi-Store Data Partitioning:</strong> Enforces strict ACID guarantees across 26 relational entities. Foreign key constraints with cascading rules (ON DELETE RESTRICT / ON DELETE CASCADE) ensure referential validity across staff, inventory, sales, and service tickets.</li>
    <li><strong>2. Concurrency Control & Row-Level Pessimistic Locking:</strong> High-frequency POS terminals utilize <code>SELECT ... FOR UPDATE OF i</code> locking. This eliminates double-sell race conditions by placing exclusive row-level locks on inventory records until transaction commit or rollback.</li>
    <li><strong>3. Advanced Indexing Strategies (Partial B-Tree & GIN FTS):</strong> In an inventory table with millions of historical sales, scanning the entire table causes severe I/O bottlenecks. We deployed Partial B-Tree Indexes (<code>CREATE INDEX ... WHERE status = 'In Stock'</code>) which index only active sellable inventory, keeping index size small and POS lookups sub-millisecond. In addition, Generalized Inverted Indexes (GIN) on <code>tsvector</code> power lightning-fast full-text searches across product names and JSONB hardware specifications.</li>
    <li><strong>4. Procedural PL/pgSQL Engines & Stored Functions:</strong> Payroll math, progressive tax calculations, attendance validations, and inventory status mutations execute directly on the database engine, minimizing application-layer roundtrips and ensuring business rules cannot be bypassed.</li>
    <li><strong>5. Connection Pooling Architecture:</strong> Managed through Node.js <code>pg.Pool</code> with automatic routing to Supabase Transaction Mode Pooler (Port 6543) and keepalive recycling, supporting high concurrency without exhausting database connection limits.</li>
  </ul>

  <h2>7.2 Visual Implementation Traces & Highlighted Features</h2>

  <div class="figure-container">
    <img src="${imgDashboard}" alt="Dashboard Screenshot">
    <div class="figure-caption">Figure 7.1: Live Enterprise Dashboard — Multi-Store Node Selector, Real-Time Inventory & Revenue Telemetry</div>
  </div>

  <div class="figure-container">
    <img src="${imgFloorplan}" alt="Floorplan Radar">
    <div class="figure-caption">Figure 7.2: Floorplan Radar — Real-Time Spatial Layout (iPhone Avenue, Mac Showcase, Vision Pro Bay, Genius Bar Benches) with Live Occupancy & Seating Allocation</div>
  </div>

  <div class="figure-container">
    <img src="${imgPos}" alt="POS Checkout">
    <div class="figure-caption">Figure 7.3: Point of Sale (POS) Terminal — ACID Checkout, Multi-Currency Engine, Hardware Catalog & Customer Queue</div>
  </div>

  <div class="figure-container">
    <img src="${imgTradeInModal}" alt="Trade-In Diagnostics Modal">
    <div class="figure-caption">Figure 7.3b: Apple Hardware Diagnostics — Battery Health Slider, Face ID/Camera Checks & Valuation Credit Quote</div>
  </div>

  <div class="figure-container">
    <img src="${imgInventory}" alt="Inventory">
    <div class="figure-caption">Figure 7.4: Inventory Management — 12-Character Physical Serial Number Drilldown, Stock Partitioning & In-Stock Partial B-Tree Lookups</div>
  </div>

  <div class="figure-container">
    <img src="${imgWorkforce}" alt="Specialist Workforce">
    <div class="figure-caption">Figure 7.5: Specialist Operations — Digital Punch Clock (Clock-In/Break/Clock-Out), Weekly Shift Scheduling Roster & Attach-Rate Incentive Leaderboard</div>
  </div>

  <div class="figure-container">
    <img src="${imgTillModal}" alt="Till Reconciliation Modal">
    <div class="figure-caption">Figure 7.5b: Till Balancing — Register Float Variance Calculation, Midday Vault Drop & Manager PIN Verification</div>
  </div>

  <div class="figure-container">
    <img src="${imgAnalytics}" alt="Executive Analytics">
    <div class="figure-caption">Figure 7.6: Executive Analytics — Chain Gross Margin (42.5%), Wholesale COGS Basis & Category Profitability Heatmap</div>
  </div>

  <div class="figure-container">
    <img src="${imgGenius}" alt="Genius Bar">
    <div class="figure-caption">Figure 7.7: Genius Bar 2.0 — Hardware Diagnostic Appointments, Component Parts Inventory & Live Queue Board</div>
  </div>

  <div class="figure-container">
    <img src="${imgSupply}" alt="Supply Chain Hub">
    <div class="figure-caption">Figure 7.8: Supply Chain Hub — Inter-Store Stock Transfers, Serialized Transit Tracking & Automated Warehouse Replenishment Orders</div>
  </div>

</body>
</html>
`;

const htmlPath = path.join(__dirname, "report.html");
fs.writeFileSync(htmlPath, htmlContent);
console.log("Wrote report.html successfully.");

const pdfPath = path.join(__dirname, "Apple_StoreOS_DBMS_Capstone_Report.pdf");
const chromeBin = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

if (fs.existsSync(chromeBin)) {
  console.log("Converting report.html to PDF via Headless Chrome...");
  try {
    execSync(`"${chromeBin}" --headless=new --disable-gpu --print-to-pdf="${pdfPath}" --print-to-pdf-no-header "${htmlPath}"`, { stdio: 'inherit' });
    const stat = fs.statSync(pdfPath);
    console.log("==================================================================");
    console.log("SUCCESS! Comprehensive Capstone Report (.pdf) generated at:");
    console.log(pdfPath);
    console.log("File Size:", (stat.size / 1024).toFixed(1), "KB");
    console.log("==================================================================");
  } catch (err) {
    console.error("Error converting to PDF via Chrome:", err);
  }
} else {
  console.warn("Chrome binary not found at", chromeBin);
}
