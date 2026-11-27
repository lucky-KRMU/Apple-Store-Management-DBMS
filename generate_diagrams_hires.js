const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("Generating ultra-large, high-visibility diagrams (20-26px font scale)...");

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

// 1. ER DIAGRAM HTML TEMPLATE (ULTRA LARGE TEXT)
const erHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1780px;
      height: 1260px;
      background: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .main-frame {
      width: 100%;
      height: 100%;
      border: 2.5px solid #0f172a;
      border-radius: 14px;
      padding: 26px 30px;
      position: relative;
      background: #ffffff;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    }
    .header-title {
      text-align: center;
      margin-bottom: 26px;
    }
    .header-title h1 {
      font-size: 38px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.6px;
    }
    .header-title p {
      font-size: 21px;
      font-weight: 600;
      color: #475569;
      margin-top: 5px;
    }
    .canvas {
      position: relative;
      width: 100%;
      height: 1100px;
    }
    .entity-card {
      position: absolute;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 6px 16px rgba(0,0,0,0.08);
      border: 3px solid;
    }
    .card-head {
      padding: 12px 16px;
      color: #ffffff;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 0.8px;
      text-align: center;
      text-transform: uppercase;
    }
    .card-body {
      padding: 14px 18px;
      background: #ffffff;
    }
    .attr-row {
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
      font-size: 19px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      line-height: 1.4;
    }
    .attr-pk {
      color: #0284c7;
      font-weight: 900;
    }
    .attr-fk {
      color: #6366f1;
      font-weight: 800;
    }
    .badge {
      display: inline-block;
      font-size: 14px;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 5px;
      margin-left: 8px;
      vertical-align: middle;
    }
    .badge-pk { background: #e0f2fe; color: #0369a1; border: 1.5px solid #bae6fd; }
    .badge-fk { background: #e0e7ff; color: #4338ca; border: 1.5px solid #c7d2fe; }
    .badge-uq { background: #fef3c7; color: #92400e; border: 1.5px solid #fde68a; }
    .badge-check { background: #dcfce7; color: #15803d; border: 1.5px solid #86efac; }

    /* SVG Lines & Labels */
    svg.connections {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }
    .rel-line {
      stroke: #334155;
      stroke-width: 2.8;
      stroke-dasharray: 7,5;
      fill: none;
    }
    .rel-line-solid {
      stroke: #334155;
      stroke-width: 2.8;
      fill: none;
    }
    .rel-badge {
      position: absolute;
      background: #ffffff;
      border: 2.5px solid #0284c7;
      color: #0284c7;
      font-size: 17px;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 16px;
      z-index: 2;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
      transform: translate(-50%, -50%);
    }
    .card-label {
      position: absolute;
      background: #ffffff;
      border: 2px solid #475569;
      color: #0f172a;
      font-size: 17px;
      font-weight: 900;
      padding: 2px 9px;
      border-radius: 6px;
      z-index: 2;
      box-shadow: 0 1px 5px rgba(0,0,0,0.1);
      transform: translate(-50%, -50%);
    }

    /* Color Themes */
    .c-stores { border-color: #0284c7; }
    .c-stores .card-head { background: #0284c7; }

    .c-employees { border-color: #0d9488; }
    .c-employees .card-head { background: #0d9488; }

    .c-salary { border-color: #d97706; }
    .c-salary .card-head { background: #d97706; }

    .c-payroll { border-color: #059669; }
    .c-payroll .card-head { background: #059669; }

    .c-attendance { border-color: #4f46e5; }
    .c-attendance .card-head { background: #4f46e5; }

    .c-leave { border-color: #7c3aed; }
    .c-leave .card-head { background: #7c3aed; }

    .c-sales { border-color: #be123c; }
    .c-sales .card-head { background: #be123c; }

    .c-inventory { border-color: #1e293b; }
    .c-inventory .card-head { background: #1e293b; }
  </style>
</head>
<body>
  <div class="main-frame">
    <div class="header-title">
      <h1>Apple StoreOS: Enterprise Payroll & Store Management ER Model</h1>
      <p>Normalized Relational Architecture (3NF / BCNF) with Explicit Referential Cardinalities</p>
    </div>

    <div class="canvas">
      <!-- SVG Connector Lines -->
      <svg class="connections">
        <!-- STORES (380, 130) to EMPLOYEES (440, 130) -->
        <path d="M 370 130 L 440 130" class="rel-line-solid" />

        <!-- EMPLOYEES (820, 130) to SALARY_STRUCTURE (880, 130) -->
        <path d="M 820 130 L 880 130" class="rel-line-solid" />

        <!-- SALARY_STRUCTURE (1270, 130) to PAYROLL_RECORDS (1330, 130) -->
        <path d="M 1270 130 L 1330 130" class="rel-line" />

        <!-- EMPLOYEES bottom (630, 395) to ATTENDANCE top (425, 455) -->
        <path d="M 540 395 L 425 455" class="rel-line" />

        <!-- EMPLOYEES bottom (630, 395) to LEAVE_RECORDS top (685, 455) -->
        <path d="M 630 395 L 685 455" class="rel-line" />

        <!-- EMPLOYEES bottom (630, 395) to SALES & COMMISSIONS top (1180, 455) -->
        <path d="M 720 395 L 1180 455" class="rel-line" />

        <!-- STORES bottom (185, 395) down to stocks to INVENTORY (640, 930) -->
        <path d="M 185 395 L 185 930 L 640 930" class="rel-line" />
      </svg>

      <!-- Relationship Badges & Cardinalities -->
      <!-- STORES - EMPLOYEES -->
      <div class="rel-badge" style="left: 405px; top: 110px;">employs</div>
      <div class="card-label" style="left: 382px; top: 145px;">1</div>
      <div class="card-label" style="left: 428px; top: 145px;">N</div>

      <!-- EMPLOYEES - SALARY -->
      <div class="rel-badge" style="left: 850px; top: 110px;">defines</div>
      <div class="card-label" style="left: 832px; top: 145px;">1</div>
      <div class="card-label" style="left: 868px; top: 145px;">1</div>

      <!-- SALARY - PAYROLL -->
      <div class="rel-badge" style="left: 1300px; top: 110px;">receives</div>
      <div class="card-label" style="left: 1282px; top: 145px;">1</div>
      <div class="card-label" style="left: 1318px; top: 145px;">N</div>

      <!-- EMPLOYEES - ATTENDANCE -->
      <div class="rel-badge" style="left: 480px; top: 415px;">logs</div>
      <div class="card-label" style="left: 535px; top: 395px;">1</div>
      <div class="card-label" style="left: 440px; top: 440px;">N</div>

      <!-- EMPLOYEES - LEAVE -->
      <div class="rel-badge" style="left: 670px; top: 420px;">requests</div>
      <div class="card-label" style="left: 625px; top: 395px;">1</div>
      <div class="card-label" style="left: 695px; top: 440px;">N</div>

      <!-- EMPLOYEES - SALES -->
      <div class="rel-badge" style="left: 935px; top: 415px;">generates sales</div>
      <div class="card-label" style="left: 755px; top: 395px;">1</div>
      <div class="card-label" style="left: 1150px; top: 440px;">N</div>

      <!-- STORES - INVENTORY -->
      <div class="rel-badge" style="left: 185px; top: 620px;">stocks</div>
      <div class="card-label" style="left: 202px; top: 410px;">1</div>
      <div class="card-label" style="left: 615px; top: 930px;">N</div>

      <!-- ROW 1 CARDS -->
      <!-- STORES -->
      <div class="entity-card c-stores" style="left: 10px; top: 10px; width: 360px;">
        <div class="card-head">STORES</div>
        <div class="card-body">
          <div class="attr-row"><span class="attr-pk">store_id</span> <span class="badge badge-pk">PK</span></div>
          <div class="attr-row">store_code <span class="badge badge-uq">UQ</span></div>
          <div class="attr-row">name</div>
          <div class="attr-row">city, country</div>
          <div class="attr-row">tax_rate</div>
          <div class="attr-row">flagship</div>
          <div class="attr-row">created_at</div>
        </div>
      </div>

      <!-- EMPLOYEES -->
      <div class="entity-card c-employees" style="left: 440px; top: 10px; width: 380px;">
        <div class="card-head">EMPLOYEES</div>
        <div class="card-body">
          <div class="attr-row"><span class="attr-pk">employee_id</span> <span class="badge badge-pk">PK</span></div>
          <div class="attr-row"><span class="attr-fk">store_id</span> <span class="badge badge-fk">FK</span></div>
          <div class="attr-row">badge_number <span class="badge badge-uq">UQ</span></div>
          <div class="attr-row">name</div>
          <div class="attr-row">email <span class="badge badge-uq">UQ</span></div>
          <div class="attr-row">role (Specialist/Genius/Mgr)</div>
          <div class="attr-row">active</div>
          <div class="attr-row">created_at</div>
        </div>
      </div>

      <!-- SALARY_STRUCTURE -->
      <div class="entity-card c-salary" style="left: 880px; top: 10px; width: 390px;">
        <div class="card-head">SALARY_STRUCTURE</div>
        <div class="card-body">
          <div class="attr-row"><span class="attr-pk">structure_id</span> <span class="badge badge-pk">PK</span></div>
          <div class="attr-row"><span class="attr-fk">employee_id</span> <span class="badge badge-fk">FK</span></div>
          <div class="attr-row">base_monthly_salary</div>
          <div class="attr-row">hra_allowance</div>
          <div class="attr-row">hourly_overtime_rate</div>
          <div class="attr-row">pf_rate</div>
          <div class="attr-row">effective_date</div>
        </div>
      </div>

      <!-- PAYROLL_RECORDS -->
      <div class="entity-card c-payroll" style="left: 1330px; top: 10px; width: 400px;">
        <div class="card-head">PAYROLL_RECORDS</div>
        <div class="card-body">
          <div class="attr-row"><span class="attr-pk">payroll_id</span> <span class="badge badge-pk">PK</span></div>
          <div class="attr-row"><span class="attr-fk">employee_id</span> <span class="badge badge-fk">FK</span></div>
          <div class="attr-row">month, year</div>
          <div class="attr-row">days_present</div>
          <div class="attr-row">gross_salary</div>
          <div class="attr-row">tax_deductions</div>
          <div class="attr-row">sales_bonus</div>
          <div class="attr-row">net_salary <span class="badge badge-check">CHECK&gt;=0</span></div>
        </div>
      </div>

      <!-- ROW 2 CARDS -->
      <!-- ATTENDANCE -->
      <div class="entity-card c-attendance" style="left: 230px; top: 455px; width: 390px;">
        <div class="card-head">ATTENDANCE</div>
        <div class="card-body">
          <div class="attr-row"><span class="attr-pk">attendance_id</span> <span class="badge badge-pk">PK</span></div>
          <div class="attr-row"><span class="attr-fk">employee_id</span> <span class="badge badge-fk">FK</span></div>
          <div class="attr-row">work_date</div>
          <div class="attr-row">check_in, check_out</div>
          <div class="attr-row">status (Present/Late/Half)</div>
          <div class="attr-row">hours_worked</div>
          <div class="attr-row">overtime_hours</div>
        </div>
      </div>

      <!-- LEAVE_RECORDS -->
      <div class="entity-card c-leave" style="left: 670px; top: 455px; width: 400px;">
        <div class="card-head">LEAVE_RECORDS</div>
        <div class="card-body">
          <div class="attr-row"><span class="attr-pk">leave_id</span> <span class="badge badge-pk">PK</span></div>
          <div class="attr-row"><span class="attr-fk">employee_id</span> <span class="badge badge-fk">FK</span></div>
          <div class="attr-row">leave_type</div>
          <div class="attr-row">start_date, end_date</div>
          <div class="attr-row">total_days</div>
          <div class="attr-row">approval_status</div>
          <div class="attr-row"><span class="attr-fk">approved_by</span> <span class="badge badge-fk">FK</span></div>
        </div>
      </div>

      <!-- SALES & COMMISSIONS -->
      <div class="entity-card c-sales" style="left: 1120px; top: 455px; width: 420px;">
        <div class="card-head">SALES & COMMISSIONS</div>
        <div class="card-body">
          <div class="attr-row"><span class="attr-pk">sale_id</span> <span class="badge badge-pk">PK</span></div>
          <div class="attr-row">receipt_number <span class="badge badge-uq">UQ</span></div>
          <div class="attr-row"><span class="attr-fk">store_id</span> <span class="badge badge-fk">FK</span></div>
          <div class="attr-row"><span class="attr-fk">employee_id</span> <span class="badge badge-fk">FK</span></div>
          <div class="attr-row">sale_date</div>
          <div class="attr-row">subtotal</div>
          <div class="attr-row">tax_amount</div>
          <div class="attr-row">total_amount</div>
          <div class="attr-row">payment_method</div>
        </div>
      </div>

      <!-- ROW 3 CARD -->
      <!-- INVENTORY -->
      <div class="entity-card c-inventory" style="left: 640px; top: 795px; width: 440px;">
        <div class="card-head">INVENTORY</div>
        <div class="card-body">
          <div class="attr-row"><span class="attr-pk">serial_number</span> <span class="badge badge-pk">PK</span></div>
          <div class="attr-row"><span class="attr-fk">product_id</span> <span class="badge badge-fk">FK</span></div>
          <div class="attr-row"><span class="attr-fk">store_id</span> <span class="badge badge-fk">FK</span></div>
          <div class="attr-row">status (In Stock/Sold/Repair)</div>
          <div class="attr-row">store_location</div>
          <div class="attr-row">updated_at</div>
        </div>
      </div>

    </div>
  </div>
</body>
</html>
`;

// 2. SYSTEM ARCHITECTURE HTML TEMPLATE (ULTRA LARGE TEXT)
const archHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      width: 1780px;
      height: 1220px;
      background: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .main-frame {
      width: 100%;
      height: 100%;
      border: 2.5px solid #0f172a;
      border-radius: 14px;
      padding: 28px 34px;
      background: #ffffff;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .header-title {
      text-align: center;
      margin-bottom: 26px;
    }
    .header-title h1 {
      font-size: 38px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.6px;
    }
    .header-title p {
      font-size: 21px;
      font-weight: 600;
      color: #475569;
      margin-top: 5px;
    }
    .tiers-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 26px;
    }
    .tier-box {
      width: 480px;
      background: #ffffff;
      border-radius: 14px;
      box-shadow: 0 6px 16px rgba(0,0,0,0.08);
      border: 3px solid;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .tier-header {
      padding: 16px 18px;
      text-align: center;
      border-bottom: 3px solid;
    }
    .tier-header h2 {
      font-size: 23px;
      font-weight: 800;
      letter-spacing: 0.8px;
      margin-bottom: 5px;
      text-transform: uppercase;
    }
    .tier-header .sub {
      font-size: 18px;
      font-weight: 700;
      color: #334155;
    }
    .tier-body {
      padding: 22px 26px;
      background: #ffffff;
    }
    .tier-body ul {
      list-style-type: none;
    }
    .tier-body li {
      font-size: 18.5px;
      font-weight: 600;
      color: #0f172a;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      line-height: 1.45;
    }
    .tier-body li::before {
      content: "•";
      font-size: 24px;
      margin-right: 12px;
      font-weight: 900;
    }

    /* TIER COLORS */
    .tier-blue { border-color: #0284c7; }
    .tier-blue .tier-header { background: #f0f9ff; border-color: #0284c7; }
    .tier-blue .tier-header h2 { color: #0369a1; }
    .tier-blue li::before { color: #0284c7; }

    .tier-teal { border-color: #0d9488; }
    .tier-teal .tier-header { background: #f0fdfa; border-color: #0d9488; }
    .tier-teal .tier-header h2 { color: #0f766e; }
    .tier-teal li::before { color: #0d9488; }

    .tier-purple { border-color: #7c3aed; }
    .tier-purple .tier-header { background: #faf5ff; border-color: #7c3aed; }
    .tier-purple .tier-header h2 { color: #6d28d9; }
    .tier-purple li::before { color: #7c3aed; }

    /* CONNECTOR ARROWS */
    .connector {
      width: 135px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .arrow-line {
      width: 100%;
      height: 3.5px;
      background: #0284c7;
      position: relative;
    }
    .arrow-badge {
      background: #0284c7;
      color: #ffffff;
      font-size: 15px;
      font-weight: 800;
      padding: 7px 12px;
      border-radius: 10px;
      text-align: center;
      margin-bottom: 10px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      white-space: nowrap;
    }
    .arrow-badge.tcp {
      background: #0d9488;
    }

    /* SECURITY & RESILIENCE PANEL */
    .sec-panel {
      background: #f8fafc;
      border: 3px solid #cbd5e1;
      border-radius: 14px;
      padding: 24px 30px;
    }
    .sec-title {
      text-align: center;
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin-bottom: 18px;
    }
    .sec-columns {
      display: flex;
      justify-content: space-between;
      gap: 24px;
    }
    .sec-col {
      width: 32%;
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px 22px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    }
    .sec-col h3 {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 10px;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 8px;
    }
    .sec-col ul {
      list-style-type: none;
    }
    .sec-col li {
      font-size: 16.5px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 8px;
      line-height: 1.45;
      display: flex;
      align-items: flex-start;
    }
    .sec-col li::before {
      content: "•";
      font-size: 20px;
      margin-right: 10px;
      color: #0f172a;
      font-weight: 900;
    }
  </style>
</head>
<body>
  <div class="main-frame">
    <div class="header-title">
      <h1>Apple StoreOS: Enterprise Full-Stack Tier Architecture</h1>
      <p>Integrated Payroll, Attendance & Retail Store Management (Reported Progress)</p>
    </div>

    <div class="tiers-container">
      <!-- PRESENTATION TIER -->
      <div class="tier-box tier-blue">
        <div class="tier-header">
          <h2>PRESENTATION TIER</h2>
          <div class="sub">React 18 + Tailwind CSS</div>
        </div>
        <div class="tier-body">
          <ul>
            <li>Apple StoreOS Glass Interface</li>
            <li>Global Store Switcher (75 Locations)</li>
            <li>HR & Store Manager Dashboard</li>
            <li>Employee Self-Service Attendance</li>
            <li>Real-time POS Checkout Flow</li>
            <li>Genius Bar Diagnostics Panel</li>
            <li>Production CDN on Vercel / Render</li>
          </ul>
        </div>
      </div>

      <!-- CONNECTOR 1 -->
      <div class="connector">
        <div class="arrow-badge">HTTPS / JSON</div>
        <div class="arrow-line"></div>
      </div>

      <!-- APPLICATION TIER -->
      <div class="tier-box tier-teal">
        <div class="tier-header">
          <h2>APPLICATION & API TIER</h2>
          <div class="sub">Node.js & Express REST Engine</div>
        </div>
        <div class="tier-body">
          <ul>
            <li>Express 4.19 Router & Middleware</li>
            <li>RESTful Endpoints (/api/payroll, etc.)</li>
            <li>JWT & Role-Based Access Control</li>
            <li>ACID Transaction Wrappers</li>
            <li>Multi-path .env Environment Loader</li>
            <li>PostgreSQL Connection Pooler</li>
            <li>Auto-routing to Port 6543 (Tx Mode)</li>
          </ul>
        </div>
      </div>

      <!-- CONNECTOR 2 -->
      <div class="connector">
        <div class="arrow-badge tcp">TCP / Port: 6543</div>
        <div class="arrow-line" style="background: #0d9488;"></div>
      </div>

      <!-- DATABASE TIER -->
      <div class="tier-box tier-purple">
        <div class="tier-header">
          <h2>DATABASE & DATA TIER</h2>
          <div class="sub">PostgreSQL 17+ Relational Engine</div>
        </div>
        <div class="tier-body">
          <ul>
            <li>3NF Normalized Payroll Schema</li>
            <li>Stored Functions (fn_calculate_salary)</li>
            <li>Validation Triggers (Leave/Shift)</li>
            <li>Pessimistic Row Locking (FOR UPDATE)</li>
            <li>Partial & Full-Text Search Indexes</li>
            <li>Analytical Views (v_store_performance)</li>
            <li>Supabase Cloud Transaction Pooler</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- SECURITY, ISOLATION & RESILIENCE PANEL -->
    <div class="sec-panel">
      <div class="sec-title">ENTERPRISE SECURITY, ISOLATION & RESILIENCE ARCHITECTURE</div>
      <div class="sec-columns">
        <div class="sec-col">
          <h3>Role-Based Access Control (RBAC):</h3>
          <ul>
            <li>hr_admin: Full schema CRUD + batch runs</li>
            <li>retail_employee: Scoped read-only access</li>
            <li>Row-Level Security (RLS) on personal records</li>
          </ul>
        </div>
        <div class="sec-col">
          <h3>ACID Transaction Safety:</h3>
          <ul>
            <li>BEGIN ... COMMIT / ROLLBACK on errors</li>
            <li>Pessimistic row locking against race conditions</li>
            <li>Check constraints enforce positive salary & inventory</li>
          </ul>
        </div>
        <div class="sec-col">
          <h3>High-Availability Cloud Deployment:</h3>
          <ul>
            <li>Vercel Edge Serverless functions (low latency)</li>
            <li>Supabase Transaction Pooler (0 session exhaustion)</li>
            <li>Automated schema migrations & realistic seeding</li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</body>
</html>
`;

fs.writeFileSync('/tmp/er_diagram.html', erHtml);
fs.writeFileSync('/tmp/system_architecture.html', archHtml);

console.log("Rendering ER Diagram via Headless Chrome at 2x Retina...");
execSync(`"${CHROME_PATH}" --headless --disable-gpu --force-device-scale-factor=2 --window-size=1780,1260 --screenshot="${path.join(__dirname, 'docs/diagrams/er_diagram.png')}" /tmp/er_diagram.html`);

console.log("Rendering System Architecture Diagram via Headless Chrome at 2x Retina...");
execSync(`"${CHROME_PATH}" --headless --disable-gpu --force-device-scale-factor=2 --window-size=1780,1220 --screenshot="${path.join(__dirname, 'docs/diagrams/system_architecture.png')}" /tmp/system_architecture.html`);

console.log("Done! Checking generated diagram files:");
execSync(`sips -g pixelWidth -g pixelHeight docs/diagrams/er_diagram.png docs/diagrams/system_architecture.png`, { stdio: 'inherit' });
