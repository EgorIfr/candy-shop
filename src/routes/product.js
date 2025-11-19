import express from 'express';
import mysql from 'mysql2/promise';

const router = express.Router();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'candy-shop',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// GET /api/featured
router.get('/featured', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, pl.label_text 
      FROM products p
      LEFT JOIN product_labels pl ON p.id = pl.product_id
      WHERE p.id IN (
        SELECT product_id FROM featured_collection_products 
        WHERE featured_collection_id = (
          SELECT id FROM featured_collections WHERE type = 'new'
        )
      )
      ORDER BY (
        SELECT display_order FROM featured_collection_products 
        WHERE product_id = p.id
      )
      LIMIT 8
    `);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/products
router.post('/products', async (req, res) => {
  try {
    const { title, price, image_url, description } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: 'Title and price are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO products (title, price, image_url, description) VALUES (?, ?, ?, ?)',
      [title, price, image_url, description]
    );

    res.status(201).json({
      id: result.insertId,
      title,
      price,
      image_url,
      description,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
