import fs from 'fs';
import csv from 'csv-parser';
import { User } from './user';

export const parseCSV = async (filePath: string): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    const users: User[] = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const { id, first_name, last_name, age, admin } = row;

        // Skip rows with missing or invalid data
        if (!last_name) {
          return;
        }
        
        const name = `${first_name} ${last_name}`;

        // Validate and process data
        if (id && name && age && admin) {
          const userAge = parseInt(age, 10);
          if (userAge > 18) {
            users.push({
              id,
              name,
              age: userAge,
              isAdmin: admin.toLowerCase() === 'true',
            });
          }
        }
      })
      .on('end', () => resolve(users))
      .on('error', (error) => reject(error));
  });
};
