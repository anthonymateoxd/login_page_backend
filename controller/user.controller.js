import { getConnection } from '../connection/connection.js';
import { createAccessToken } from '../libs/jwt.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config.js';

export const get_users = async (req, res) => {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM users');
    return res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error Fetching' });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const connection = await getConnection();

    if (!email || !password) {
      return res.status(400).json({
        message: 'Missing Fields',
      });
    }

    const [existingUser] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        message: 'Email Already Exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await connection.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    const token = await createAccessToken({ id: result.insertId });
    res.cookie('token', token);

    return res.status(201).json({ id: result.insertId, email });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error Creating User',
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const connection = await getConnection();

    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'User Not Found' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Password' });
    }

    const token = await createAccessToken({ id: user.id });

    res.cookie('token', token);
    console.log(token);

    return res.status(200).json({ id: user.id, email: user.email });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error en login' });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Unauthorized' });

      const connection = await getConnection();
      const [rows] = await connection.execute(
        'SELECT id, email FROM users WHERE id = ?',
        [decoded.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Aquí respondemos directo en vez de usar next()
      return res.json({ user: rows[0] });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error verifying token' });
  }
};
