// server.js
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key-change-in-production'; // В продакшене использовать переменную окружения

// Middleware
app.use(cors());
app.use(express.json());

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'public', 'images');
    // Создаем папку, если её нет
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Только изображения разрешены!'));
    }
  }
});

// Раздача статических файлов
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Пул соединений
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'candy-shop',
});

// Middleware для проверки JWT токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Токен доступа отсутствует' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Недействительный токен' });
    }
    req.user = user;
    next();
  });
};

// Middleware для проверки админ-прав
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Требуются права администратора' });
  }
  next();
};

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
      SELECT DISTINCT p.*, pl.label_text, fcp.display_order
      FROM products p
      LEFT JOIN product_labels pl ON p.id = pl.product_id
      INNER JOIN featured_collection_products fcp ON p.id = fcp.product_id
      INNER JOIN featured_collections fc ON fcp.featured_collection_id = fc.id
      WHERE fc.type = 'new' AND (fc.is_active = 1 OR fc.is_active IS NULL)
      ORDER BY fcp.display_order ASC
      LIMIT 8
    `);

    console.log(`Found ${rows.length} featured products`);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ error: error.message });
  }
});

// Регистрация
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    // Проверка существования пользователя
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Пользователь с таким именем или email уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание пользователя
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    // Генерация JWT токена
    const token = jwt.sign(
      { id: result.insertId, username, email, role: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        username,
        email,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Авторизация
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Имя пользователя и пароль обязательны' });
    }

    // Поиск пользователя
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }

    const user = users[0];

    // Проверка пароля
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Неверное имя пользователя или пароль' });
    }

    // Генерация JWT токена
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: error.message });
  }
});

// Проверка текущего пользователя
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT id, username, email, role FROM users WHERE id = ?', [req.user.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create product endpoint (только для админа, с загрузкой изображения)
app.post('/api/products', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, price, description, category_id } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: 'Название и цена обязательны' });
    }

    // Путь к изображению
    let image_url = null;
    if (req.file) {
      image_url = `/images/${req.file.filename}`;
    }

    const [result] = await pool.execute(
      'INSERT INTO products (title, price, image_url, description, category_id) VALUES (?, ?, ?, ?, ?)',
      [title, parseFloat(price), image_url, description || null, category_id ? parseInt(category_id) : null]
    );

    const [newProduct] = await pool.execute('SELECT * FROM products WHERE id = ?', [result.insertId]);

    res.status(201).json(newProduct[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete product endpoint (только для админа)
app.delete('/api/products/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    // Получаем информацию о товаре для удаления изображения
    const [products] = await pool.execute('SELECT image_url FROM products WHERE id = ?', [productId]);

    if (products.length === 0) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    // Удаляем товар
    await pool.execute('DELETE FROM products WHERE id = ?', [productId]);

    // Удаляем изображение, если оно есть
    if (products[0].image_url) {
      const imagePath = path.join(__dirname, 'public', products[0].image_url);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Товар успешно удален' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all products with optional filtering
app.get('/api/products', async (req, res) => {
  try {
    const { section, category, filter } = req.query;

    console.log('Products request:', { section, category, filter });

    // Build query with filters
    let query = `
      SELECT DISTINCT p.*, pl.label_text 
      FROM products p
      LEFT JOIN product_labels pl ON p.id = pl.product_id
    `;
    const conditions = [];
    const params = [];
    let hasFeaturedJoin = false;

    // Filter by section (section_id in categories table)
    if (section && section !== '' && section !== 'null') {
      const sectionId = parseInt(section);
      if (!isNaN(sectionId)) {
        query +=
          ' INNER JOIN categories c_section ON p.category_id = c_section.id';
        conditions.push('c_section.section_id = ?');
        params.push(sectionId);
      }
    }

    // Filter by category
    if (category && category !== '' && category !== 'null') {
      const categoryId = parseInt(category);
      if (!isNaN(categoryId)) {
        conditions.push('p.category_id = ?');
        params.push(categoryId);
      }
    }

    // Filter by type (new, popular) - combined with other filters
    if (filter === 'new' || filter === 'popular') {
      // Use subquery approach similar to /api/featured endpoint for better reliability
      conditions.push(`p.id IN (
        SELECT product_id FROM featured_collection_products 
        WHERE featured_collection_id = (
          SELECT id FROM featured_collections WHERE type = ? AND (is_active = 1 OR is_active IS NULL)
        )
      )`);
      params.push(filter);
      hasFeaturedJoin = true;
    }

    // Add WHERE clause
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    // Add ORDER BY
    if (hasFeaturedJoin) {
      // Use subquery for ordering - it will use the same collection as in WHERE clause
      query += ` ORDER BY (
        SELECT fcp.display_order FROM featured_collection_products fcp
        INNER JOIN featured_collections fc ON fcp.featured_collection_id = fc.id
        WHERE fcp.product_id = p.id AND fc.type = ? AND (fc.is_active = 1 OR fc.is_active IS NULL)
        LIMIT 1
      )`;
      params.push(filter);
    } else {
      query += ' ORDER BY p.display_order ASC, p.created_at DESC';
    }

    console.log('SQL Query:', query);
    console.log('SQL Params:', params);

    const [rows] = await pool.execute(query, params);
    console.log(`Found ${rows.length} products`);
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
