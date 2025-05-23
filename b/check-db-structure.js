import { getConnection } from "./db.js";

async function checkDatabaseStructure() {
  try {
    console.log("Connecting to database...");
    const connection = await getConnection();
    
    console.log("\nChecking 'bayiler' table structure:");
    const bayilerStructure = await connection.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'bayiler' ORDER BY ordinal_position"
    );
    console.log(bayilerStructure.rows);
    
    console.log("\nChecking 'musteri' table structure:");
    const musteriStructure = await connection.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'musteri' ORDER BY ordinal_position"
    );
    console.log(musteriStructure.rows);
    
    console.log("\nChecking 'lisans' table structure:");
    const lisansStructure = await connection.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'lisans' ORDER BY ordinal_position"
    );
    console.log(lisansStructure.rows);
    
    // Close the connection
    await connection.end();
    console.log("Connection closed");
  } catch (error) {
    console.error("Error checking database structure:", error);
  }
}

checkDatabaseStructure();
