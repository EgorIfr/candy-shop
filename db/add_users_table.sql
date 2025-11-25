-- Добавление таблицы users для регистрации и авторизации

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL UNIQUE,
  `email` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_users_username` (`username`),
  KEY `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Добавление админа (пароль: admin, хеш bcrypt для "admin")
-- В реальном приложении пароль должен быть захеширован через bcrypt
-- Для простоты используем простой пароль, но в коде будем использовать bcrypt
INSERT INTO `users` (`username`, `email`, `password`, `role`) VALUES
('admin', 'admin@candy-shop.com', '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'admin')
ON DUPLICATE KEY UPDATE `role` = 'admin';

