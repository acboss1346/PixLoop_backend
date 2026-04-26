import pool from './config/db.js';

async function migrate() {
  try {
    console.log('Running migrations...');
    await pool.query('ALTER TABLE posts ADD COLUMN community_id INT DEFAULT NULL;');
    await pool.query('ALTER TABLE posts ADD FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE;');
    console.log('Added community_id to posts.');
  } catch (err) {
    console.log('Error adding community_id, maybe it exists:', err.message);
  }

  try {
    await pool.query('ALTER TABLE communities ADD COLUMN creator_id INT DEFAULT NULL;');
    await pool.query('ALTER TABLE communities ADD FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE SET NULL;');
    console.log('Added creator_id to communities.');
  } catch (err) {
    console.log('Error adding creator_id, maybe it exists:', err.message);
  }

  process.exit();
}

migrate();
