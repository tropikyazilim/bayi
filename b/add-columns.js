// Script to add missing columns to lisans table
import { getConnection } from './db.js';

// Wrap in an async IIFE to use await at top level
(async () => {
  try {
    console.log("Connecting to database...");
    const connection = await getConnection();
    console.log("Connected to database");
    
    // Add missing columns to lisans table
    console.log("Adding missing columns to lisans table...");
    await connection.query(`
      ALTER TABLE lisans 
      ADD COLUMN IF NOT EXISTS bayi_id INTEGER,
      ADD COLUMN IF NOT EXISTS musteri_id INTEGER,
      ADD COLUMN IF NOT EXISTS paket_id INTEGER
    `);
    
    console.log("Columns added successfully!");
    
    // Verify the table structure
    const result = await connection.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'lisans' ORDER BY ordinal_position"
    );
    
    console.log("Updated lisans table columns:");
    console.table(result.rows);
  } catch (error) {
    console.error('Error updating database structure:', error);
  } finally {
    console.log("Script completed.");
    process.exit(0); // Ensure script exits
  }
})();
