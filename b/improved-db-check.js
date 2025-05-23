import { getConnection } from "./db.js";

async function checkDatabaseTables() {
  let connection;
  try {
    console.log("Connecting to database...");
    connection = await getConnection();
    
    console.log("\n=== 'bayiler' Table Structure ===");
    const bayilerStructure = await connection.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'bayiler' ORDER BY ordinal_position"
    );
    console.log(bayilerStructure.rows);
    
    // Get sample data from bayiler table
    console.log("\n=== Sample Data from 'bayiler' Table ===");
    const bayilerSample = await connection.query("SELECT * FROM bayiler LIMIT 1");
    console.log(bayilerSample.rows[0]);
    
    console.log("\n=== 'musteri' Table Structure ===");
    const musteriStructure = await connection.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'musteri' ORDER BY ordinal_position"
    );
    console.log(musteriStructure.rows);
    
    // Get sample data from musteri table
    console.log("\n=== Sample Data from 'musteri' Table ===");
    const musteriSample = await connection.query("SELECT * FROM musteri LIMIT 1");
    console.log(musteriSample.rows[0]);
    
    console.log("\n=== 'lisans' Table Structure ===");
    const lisansStructure = await connection.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'lisans' ORDER BY ordinal_position"
    );
    console.log(lisansStructure.rows);
    
    // Specifically check if 'il' column exists in tables
    console.log("\n=== Checking 'il' column in tables ===");
    const checkIlColumn = await connection.query(`
      SELECT 
        table_name, 
        column_name 
      FROM 
        information_schema.columns 
      WHERE 
        column_name = 'il' AND 
        table_name IN ('bayiler', 'musteri', 'lisans')
    `);
    console.log(checkIlColumn.rows);
    
  } catch (error) {
    console.error("Error checking database:", error);
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

checkDatabaseTables();
