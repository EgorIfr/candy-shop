// server.js
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Пул соединений
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'candy-shop',
});

// Проверка сервера
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
  });
});

// Featured products endpoint
app.get('/api/featured', async (req, res) => {
  try {
    console.log('Fetching featured products...');

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

    console.log(`Found ${rows.length} featured products`);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create product endpoint
app.post('/api/products', async (req, res) => {
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
      created_at: new Date(),
      updated_at: new Date(),
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all products with optional filtering
app.get('/api/products', async (req, res) => {
  try {
    const { section, category, filter } = req.query;
    
    // If filter is 'new' and no other filters, use featured endpoint logic
    if (filter === 'new' && !section && !category) {
      const [rows] = await pool.execute(`
        SELECT DISTINCT p.*, pl.label_text 
        FROM products p
        LEFT JOIN product_labels pl ON p.id = pl.product_id
        INNER JOIN featured_collection_products fcp ON p.id = fcp.product_id
        INNER JOIN featured_collections fc ON fcp.featured_collection_id = fc.id
        WHERE fc.type = 'new'
        ORDER BY (
          SELECT display_order FROM featured_collection_products 
          WHERE product_id = p.id
        )
      `);
      return res.json(rows);
    }

    // Build query with filters
    let query = `
      SELECT DISTINCT p.*, pl.label_text 
      FROM products p
      LEFT JOIN product_labels pl ON p.id = pl.product_id
    `;
    const conditions = [];
    const params = [];

    // Filter by section (section_id in categories table)
    if (section) {
      query += ' INNER JOIN categories c_section ON p.category_id = c_section.id';
      conditions.push('c_section.section_id = ?');
      params.push(parseInt(section));
    }

    // Filter by category
    if (category) {
      conditions.push('p.category_id = ?');
      params.push(parseInt(category));
    }

    // Filter by type (new, popular) - combined with other filters
    if (filter === 'new') {
      query += ` INNER JOIN featured_collection_products fcp ON p.id = fcp.product_id
                 INNER JOIN featured_collections fc ON fcp.featured_collection_id = fc.id
                 AND fc.type = 'new'`;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    } else if (filter === 'new') {
      query = query.replace('AND fc.type', 'WHERE fc.type');
    }

    if (filter === 'new') {
      query += ` ORDER BY (
        SELECT display_order FROM featured_collection_products 
        WHERE product_id = p.id
      )`;
    } else {
      query += ' ORDER BY p.display_order ASC, p.created_at DESC';
    }

    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Featured products: http://localhost:${PORT}/api/featured`);
  console.log(`All products: http://localhost:${PORT}/api/products`);
});
