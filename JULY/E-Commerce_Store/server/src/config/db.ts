import { Pool } from 'pg';
import dotenv from 'dotenv';


dotenv.config();

export const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: Number(process.env.PGPORT),
});

export const connectDB = async () => {
  try {
    await pool.connect();
    console.log('PostgreSQL Connected!');
  } catch (error) {
    console.error('DB Connection Failed:', error);
    throw error;
  }
};
