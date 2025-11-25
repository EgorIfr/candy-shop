// Скрипт для создания админа в базе данных
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'candy-shop',
});

async function initAdmin() {
  try {
    // Создаем таблицу users, если её нет
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        username varchar(255) NOT NULL UNIQUE,
        email varchar(255) NOT NULL UNIQUE,
        password varchar(255) NOT NULL,
        role enum('user','admin') NOT NULL DEFAULT 'user',
        created_at timestamp NOT NULL DEFAULT current_timestamp(),
        updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (id),
        KEY idx_users_username (username),
        KEY idx_users_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);

    // Хешируем пароль "admin"
    const hashedPassword = await bcrypt.hash('admin', 10);

    // Проверяем, существует ли админ
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE username = ?',
      ['admin']
    );

    if (existing.length > 0) {
      // Обновляем пароль админа
      await pool.execute(
        'UPDATE users SET password = ?, role = ? WHERE username = ?',
        [hashedPassword, 'admin', 'admin']
      );
      console.log('Админ обновлен: login=admin, password=admin');
    } else {
      // Создаем нового админа
      await pool.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        ['admin', 'admin@candy-shop.com', hashedPassword, 'admin']
      );
      console.log('Админ создан: login=admin, password=admin');
    }

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при создании админа:', error);
    await pool.end();
    process.exit(1);
  }
}

initAdmin();

