import mysql from 'mysql2/promise';

const dbSettings = {
  host: 'mysql',
  user: 'root',
  password: 'guest',
  database: 'ion_users',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export const getConnection = async () => {
  try {
    const pool = mysql.createPool(dbSettings);
    return pool;
  } catch (error) {
    console.log(error, 'Error conection');
    throw error;
  }
};
