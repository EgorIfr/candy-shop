-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Ноя 24 2025 г., 20:49
-- Версия сервера: 10.4.32-MariaDB
-- Версия PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `candy-shop`
--

-- --------------------------------------------------------

--
-- Структура таблицы `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `section_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `categories`
--

INSERT INTO `categories` (`id`, `section_id`, `title`, `display_order`, `created_at`) VALUES
(1, 1, 'Шоколадные', 1, '2025-11-19 16:24:16'),
(2, 1, 'Фруктовые', 2, '2025-11-19 16:24:16'),
(3, 2, 'Популярные миксы', 1, '2025-11-19 16:24:16'),
(4, 3, 'Без сахара', 1, '2025-11-19 16:24:16'),
(5, 3, 'Веганские', 2, '2025-11-19 16:24:16'),
(6, 4, 'О компании', 1, '2025-11-19 16:24:16');

-- --------------------------------------------------------

--
-- Структура таблицы `featured_collections`
--

CREATE TABLE `featured_collections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `featured_collections`
--

INSERT INTO `featured_collections` (`id`, `name`, `type`, `created_at`, `updated_at`, `is_active`) VALUES
(9, 'Новинки', 'new', '2025-11-19 16:32:25', '2025-11-19 16:32:25', 1),
(10, 'Популярные', 'popular', '2025-11-19 16:32:25', '2025-11-19 16:32:25', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `featured_collection_products`
--

CREATE TABLE `featured_collection_products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `featured_collection_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `featured_collection_products`
--

INSERT INTO `featured_collection_products` (`id`, `featured_collection_id`, `product_id`, `display_order`, `created_at`) VALUES
(22, 9, 19, 1, '2025-11-19 16:32:25'),
(23, 9, 20, 2, '2025-11-19 16:32:25'),
(24, 9, 21, 3, '2025-11-19 16:32:25'),
(25, 9, 22, 4, '2025-11-19 16:32:25'),
(26, 9, 23, 5, '2025-11-19 16:32:25'),
(27, 9, 24, 6, '2025-11-19 16:32:25'),
(28, 9, 25, 7, '2025-11-19 16:32:25'),
(29, 9, 26, 8, '2025-11-19 16:32:25'),
(30, 10, 19, 1, '2025-11-19 16:32:25'),
(31, 10, 22, 2, '2025-11-19 16:32:25'),
(32, 10, 24, 3, '2025-11-19 16:32:25'),
(33, 10, 26, 4, '2025-11-19 16:32:25');

-- --------------------------------------------------------

--
-- Структура таблицы `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `category_id` int(11) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`id`, `title`, `description`, `price`, `image_url`, `created_at`, `updated_at`, `category_id`, `display_order`) VALUES
(19, 'Шоколадные конфеты \"Премиум\"', 'Набор из отборных шоколадных конфет с разными начинками', 1250.00, '/images/chocolate-premium.png', '2025-11-19 16:32:25', '2025-11-19 16:32:25', 1, 1),
(20, 'Мармеладные фрукты', 'Натуральный мармелад с соком настоящих фруктов', 680.00, '/images/fruit-gummies.png', '2025-11-19 16:32:25', '2025-11-19 16:32:25', 2, 2),
(21, 'Карамельный набор \"Радуга\"', 'Разноцветные карамельные леденцы ручной работы', 420.00, '/images/rainbow-caramel.png', '2025-11-19 16:32:25', '2025-11-19 16:32:25', 3, 3),
(22, 'Трюфельный шоколад', 'Изысканный шоколад с трюфельной начинкой', 890.00, '/images/truffle-chocolate.png', '2025-11-19 16:32:25', '2025-11-19 16:32:25', 1, 4),
(23, 'Фруктовые пастилки', 'Нежные пастилки из натурального фруктового пюре', 320.00, '/images/fruit-pastilles.png', '2025-11-19 16:32:25', '2025-11-19 16:32:25', 2, 5),
(24, 'Шоколадные батончики \"Энергия\"', 'Питательные батончики с орехами и сухофруктами', 550.00, '/images/energy-bars.png', '2025-11-19 16:32:25', '2025-11-19 16:32:25', 1, 6),
(25, 'Карамель с морской солью', 'Сливочная карамель с кристаллами морской соли', 380.00, '/images/salted-caramel.png', '2025-11-19 16:32:25', '2025-11-19 16:32:25', 3, 7),
(26, 'Марципановые фигурки', 'Фигурки из марципана ручной лепки', 720.00, '/images/marzipan-figures.png', '2025-11-19 16:32:25', '2025-11-19 16:32:25', 1, 8);

-- --------------------------------------------------------

--
-- Структура таблицы `product_labels`
--

CREATE TABLE `product_labels` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `label_type` varchar(50) NOT NULL,
  `label_text` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `product_labels`
--

INSERT INTO `product_labels` (`id`, `product_id`, `label_type`, `label_text`, `created_at`) VALUES
(8, 19, 'new', 'New', '2025-11-19 16:32:25'),
(9, 20, 'new', 'New', '2025-11-19 16:32:25'),
(10, 21, 'new', 'New', '2025-11-19 16:32:25'),
(11, 22, 'new', 'New', '2025-11-19 16:32:25'),
(12, 23, 'new', 'New', '2025-11-19 16:32:25'),
(13, 24, 'new', 'New', '2025-11-19 16:32:25'),
(14, 25, 'new', 'New', '2025-11-19 16:32:25'),
(15, 26, 'new', 'New', '2025-11-19 16:32:25');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_categories_section_id` (`section_id`);

--
-- Индексы таблицы `featured_collections`
--
ALTER TABLE `featured_collections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_featured_collection_type` (`type`);

--
-- Индексы таблицы `featured_collection_products`
--
ALTER TABLE `featured_collection_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_featured_products_order` (`display_order`),
  ADD KEY `idx_featured_products_collection_id` (`featured_collection_id`),
  ADD KEY `idx_featured_products_product_id` (`product_id`);

--
-- Индексы таблицы `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_products_category_id` (`category_id`),
  ADD KEY `idx_products_display_order` (`display_order`),
  ADD KEY `idx_products_created_at` (`created_at`);

--
-- Индексы таблицы `product_labels`
--
ALTER TABLE `product_labels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_product_labels_type` (`label_type`),
  ADD KEY `idx_product_labels_product_id` (`product_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT для таблицы `featured_collections`
--
ALTER TABLE `featured_collections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `featured_collection_products`
--
ALTER TABLE `featured_collection_products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT для таблицы `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT для таблицы `product_labels`
--
ALTER TABLE `product_labels`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
