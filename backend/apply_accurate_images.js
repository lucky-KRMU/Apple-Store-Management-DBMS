const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const localMapping = {};
const svgPids = new Set(['P-63', 'P-64', 'P-67', 'P-68', 'P-69', 'P-70', 'P-71', 'P-72', 'P-73']);

for (let i = 1; i <= 89; i++) {
  const pid = `P-${i}`;
  if (svgPids.has(pid)) {
    localMapping[pid] = `/images/products/${pid}.svg`;
  } else {
    localMapping[pid] = `/images/products/${pid}.jpg`;
  }
}

async function run() {
  console.log(`Setting 100% local, distinct images for all 89 items...`);
  
  // Save local mapping
  const jsonPath = path.join(__dirname, 'product_images.json');
  fs.writeFileSync(jsonPath, JSON.stringify(localMapping, null, 2));
  console.log(`✓ Updated ${jsonPath} with local asset paths`);

  // Update Database
  const pool = new Pool({
    host: process.env.PGHOST || 'localhost',
    port: process.env.PGPORT || 5432,
    user: process.env.PGUSER || 'sahilchadha',
    password: process.env.PGPASSWORD || '',
    database: process.env.PGDATABASE || 'apple_store_db'
  });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const [pid, imgUrl] of Object.entries(localMapping)) {
      await client.query(
        'UPDATE products SET image_url = $1, updated_at = NOW() WHERE product_id = $2',
        [imgUrl, pid]
      );
    }
    await client.query('COMMIT');
    console.log(`✓ Successfully updated database products table for all 89 items with local images.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Database update failed:', err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
