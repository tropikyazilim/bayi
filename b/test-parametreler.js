import { getConnection } from "./db.js";

async function checkParameterTypes() {
  try {
    console.log("Checking parametreler table...");
    const connection = await getConnection();
    
    // Display table structure
    const tableInfo = await connection.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'parametreler'
      ORDER BY ordinal_position;
    `);
    console.log("Table structure:", tableInfo.rows);
    
    // Display data in the table
    const tableData = await connection.query(`
      SELECT * FROM parametreler ORDER BY parametreid;
    `);
    console.log("Existing data:", tableData.rows);
    
    // Test update with string
    console.log("\nTesting parameter update with string value...");
    try {
      const testUpdateStringResult = await connection.query(
        'UPDATE parametreler SET "deger" = $1 WHERE parametreid = $2 RETURNING *',
        ["test-value-123", "1"]
      );
      console.log("String update result:", testUpdateStringResult.rows);
    } catch (err) {
      console.error("String update error:", err);
    }
    
    // Test update with number
    console.log("\nTesting parameter update with number value...");
    try {
      const testUpdateNumberResult = await connection.query(
        'UPDATE parametreler SET "deger" = $1 WHERE parametreid = $2 RETURNING *',
        [123, "1"]
      );
      console.log("Number update result:", testUpdateNumberResult.rows);
    } catch (err) {
      console.error("Number update error:", err);
    }
    
    // Test update with JSON
    console.log("\nTesting parameter update with JSON value...");
    try {
      const testUpdateJsonResult = await connection.query(
        'UPDATE parametreler SET "deger" = $1 WHERE parametreid = $2 RETURNING *',
        [JSON.stringify({test: "value"}), "1"]
      );
      console.log("JSON update result:", testUpdateJsonResult.rows);
    } catch (err) {
      console.error("JSON update error:", err);
    }
    
  } catch (error) {
    console.error("Error in test:", error);
  } finally {
    process.exit(0);
  }
}

checkParameterTypes();
