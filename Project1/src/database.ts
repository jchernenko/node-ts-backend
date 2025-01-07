import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { User } from './user';

// Initialize the database connection
export const initializeDb = async (): Promise<Database> => {
  const db = await open({
    filename: './Project1/database.sqlite',
    driver: sqlite3.Database,
  });

  // Create the `users` table if it doesn't already exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      age INTEGER NOT NULL,
      isAdmin BOOLEAN NOT NULL
    )
  `);

  console.log('Connected to SQLite database.');
  return db;
};

// Function to insert users into the database
export const insertUsers = async (db: Database, users: User[]): Promise<void> => {
  for (const user of users) {
    try {
      // Check if the user already exists
      const existingUser = await db.get('SELECT id FROM users WHERE id = ?', user.id);
      if (!existingUser) {
        await db.run(
          'INSERT INTO users (id, name, email, age, isAdmin) VALUES (?, ?, ?, ?, ?)',
          user.id,
          user.name,
          user.email,
          user.age,
          user.isAdmin ? 1 : 0
        );
      }
    } catch (error) {
      console.error('Error inserting user:', error instanceof Error ? error.message : error);
    }
  }
};

// Function to reset the `users` table (Optional for debugging or resetting data)
export const resetUsersTable = async (db: Database): Promise<void> => {
  await db.exec('DROP TABLE IF EXISTS users');
  await db.exec(`
    CREATE TABLE users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TeXT NOT NULL,
      age INTEGER NOT NULL,
      isAdmin BOOLEAN NOT NULL
    )
  `);
  console.log('Users table has been reset.');
};