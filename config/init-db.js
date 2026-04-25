import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function initDB() {
  let connection;
  try {
    // Connect without specifying the database first
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log(`Connected to MySQL server as id ${connection.threadId}`);

    // Create database if not exists
    const dbName = process.env.DB_NAME || 'pixloop';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log(`Database '${dbName}' checked/created.`);

    // Connect to the database
    await connection.changeUser({ database: dbName });

    // Read init.sql
    const sqlFile = path.join(__dirname, 'init.sql');
    const sqlQueries = fs.readFileSync(sqlFile, 'utf8');

    // Split queries by semicolon and execute them sequentially
    const queries = sqlQueries.split(';').filter(q => q.trim());

    for (const query of queries) {
      if (query.trim()) {
        await connection.query(query);
      }
    }
    
    console.log('Database schema initialized successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit();
  }
}

initDB();
