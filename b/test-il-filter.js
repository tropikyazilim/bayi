import { getConnection } from "./db.js";

async function testIlFilter() {
  let connection;
  try {
    console.log("Connecting to database...");
    connection = await getConnection();
    
    // Check if 'il' column exists in the tables
    console.log("\nChecking if 'il' column exists in the tables:");
    const ilColumnQuery = `
      SELECT table_name, column_name 
      FROM information_schema.columns 
      WHERE column_name = 'il' AND table_name IN ('bayiler', 'musteri', 'lisans')
    `;
    const ilColumnResult = await connection.query(ilColumnQuery);
    console.log("Tables with 'il' column:", ilColumnResult.rows);
    
    // Test the JOIN query that's causing issues
    const testIl = 'İstanbul'; // Test with a Turkish city name
    console.log(`\nTesting JOIN query with il='${testIl}':`);
    
    // Function to convert Turkish characters to lowercase
    function turkishToLower(str) {
      if (!str) return '';
      return str
        .replace(/İ/g, "i")
        .replace(/I/g, "ı")
        .replace(/Ş/g, "ş")
        .replace(/Ğ/g, "ğ")
        .replace(/Ü/g, "ü")
        .replace(/Ö/g, "ö")
        .replace(/Ç/g, "ç")
        .toLowerCase();
    }
    
    function turkishToLowerSql(column) {
      return `LOWER(
        TRANSLATE(
          ${column},
          'İIŞĞÜÖÇ',
          'iışğüöç'
        )
      )`;
    }
    
    // Convert the test city name to lowercase
    const ilLower = turkishToLower(testIl);
    
    // Build the query with proper placeholders
    const testQuery = `
      SELECT DISTINCT l.* 
      FROM lisans l
      LEFT JOIN bayiler b ON l.bayi_adi = b.unvan
      LEFT JOIN musteri m ON l.musteri_adi = m.unvan
      WHERE (${turkishToLowerSql('b.il')} ILIKE $1 OR ${turkishToLowerSql('m.il')} ILIKE $2)
      ORDER BY l.id DESC
    `;
    
    // Use proper placeholders
    const params = [`%${ilLower}%`, `%${ilLower}%`];
    
    console.log("SQL query:", testQuery);
    console.log("Parameters:", params);
    
    // Execute the query
    const result = await connection.query(testQuery, params);
    console.log(`Found ${result.rows.length} licenses for il='${testIl}'`);
    if (result.rows.length > 0) {
      console.log("First license:", result.rows[0]);
    }
    
  } catch (error) {
    console.error("Error testing il filter:", error);
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log("Database connection closed");
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  }
}

testIlFilter();
