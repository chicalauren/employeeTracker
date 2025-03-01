// Purpose: Connection to the database.
import * as dotenv from 'dotenv' 
dotenv.config();

// Import the pg module
import * as pg from 'pg';
const { Pool } = pg;

// Create a new pool
const pool = new Pool({
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  database: process.env.DB_NAME,
    port: 5432
});

// Connect to the database
const connectDB = async () => {
    try {
        await pool.connect();
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database: ', error);
    }
    };

    // Export the connection
    export { pool, connectDB };