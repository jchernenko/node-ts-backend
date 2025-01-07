import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';
import { initializeDb, insertUsers } from './database';
import { parseCSV } from './csvParser';
import path from 'path';

const app = express();
app.use(bodyParser.json());
app.use('/api', router);

const startServer = async () => {
  try {
    // Initialize the database
    const db = await initializeDb();

    // Parse the CSV file and insert users into the database
    const filePath = path.join(__dirname, '../MOCK_DATA.csv');
    const users = await parseCSV(filePath);
    await insertUsers(db, users);

    // Start the server
    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000');
    });
  } catch (error) {
    // Error handling
    if (error instanceof Error) {
      console.error('Error starting the server:', error.message);
    } else {
      console.error('Unknown error occurred:', error);
    }
  }
};

startServer();
