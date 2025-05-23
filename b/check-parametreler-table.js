import { getConnection } from "./db.js";

async function checkAndCreateParametersTable() {
  try {
    console.log("Checking and creating parameters table...");
    const connection = await getConnection();
    
    // Check if the table exists
    const checkResult = await connection.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'parametreler'
      );
    `);
    
    const tableExists = checkResult.rows[0].exists;
    
    if (tableExists) {
      console.log("Parametreler table already exists.");
      
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
      
    } else {
      console.log("Parametreler table does not exist. Creating now...");
      
      // Create the table
      await connection.query(`
        CREATE TABLE parametreler (
          parametreid SERIAL PRIMARY KEY,
          modul CHARACTER VARYING(50),
          parametreadi CHARACTER VARYING(100),
          deger CHARACTER VARYING(50),
          kayitzamani TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log("Table created successfully.");
      
      // Insert example data
      await connection.query(`
        INSERT INTO parametreler (modul, parametreadi, deger)
        VALUES ('Moduller', 'Modül Kodu Default Değeri', '100');
      `);
      console.log("Example data inserted successfully.");
    }
    
    console.log("Operation completed successfully.");
    await connection.end();
    
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the function
checkAndCreateParametersTable();