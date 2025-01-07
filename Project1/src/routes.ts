import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const router = express.Router();

// Helper function to initialize the database connection
const getDb = async () => {
  return await open({
    filename: './Project1/database.sqlite',
    driver: sqlite3.Database,
  });
};

// Route: Get users with pagination and filtering by admin status
router.get('/users', async (req, res) => {
  const { limit = 10, isAdmin } = req.query;
  try {
    const db = await getDb();
    let query = 'SELECT * FROM users';
    const params: any[] = [];

    // Filter by admin status
    if (isAdmin !== undefined) {
      query += ' WHERE isAdmin = ?';
      params.push(isAdmin === 'true' ? 1 : 0);
    }

    query += ' LIMIT ?';
    params.push(parseInt(limit as string, 10));

    const users = await db.all(query, params);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error instanceof Error ? error.message : error);
    res.status(500).send('Internal Server Error');
  }
});

// Route: Get a user by ID
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE id = ?', id);

    if (!user) {
      res.status(404).send('User not found');
      return;
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error instanceof Error ? error.message : error);
    res.status(500).send('Internal Server Error');
  }
});

// Route: Delete a user by ID
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    const result = await db.run('DELETE FROM users WHERE id = ?', id);

    if (result.changes === 0) {
      res.status(404).send('User not found');
      return;
    }

    res.send('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error instanceof Error ? error.message : error);
    res.status(500).send('Internal Server Error');
  }
});

// Route: Create a new user
router.post('/users', async (req, res) => {
  const { id, name, age, isAdmin } = req.body;

  // Validate request body
  if (!id || !name || !age || isAdmin === undefined) {
    res.status(400).send('Missing required fields');
    return;
  }

  if (age <= 18) {
    res.status(400).send('User must be older than 18');
    return;
  }

  try {
    const db = await getDb();
    await db.run(
      'INSERT INTO users (id, name, age, isAdmin) VALUES (?, ?, ?, ?)',
      id,
      name,
      age,
      isAdmin ? 1 : 0
    );
    res.status(201).send('User created successfully');
  } catch (error) {
    console.error('Error creating user:', error instanceof Error ? error.message : error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;