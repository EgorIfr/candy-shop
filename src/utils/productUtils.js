/**
 * Фильтрация товаров по поисковому запросу
 */
export const filterProductsBySearch = (products, searchQuery) => {
  if (!searchQuery || !searchQuery.trim()) {
    return products;
  }

  const query = searchQuery.toLowerCase().trim();
  return products.filter(
    (product) =>
      product.title?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
  );
};

/**
 * Сортировка товаров
 */
export const sortProducts = (products, sortBy) => {
  if (!sortBy || sortBy === 'default') {
    return [...products];
  }

  const sorted = [...products];

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return priceA - priceB;
      });

    case 'price-desc':
      return sorted.sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return priceB - priceA;
      });

    case 'name-asc':
      return sorted.sort((a, b) => {
        const titleA = (a.title || '').toLowerCase();
        const titleB = (b.title || '').toLowerCase();
        return titleA.localeCompare(titleB, 'ru');
      });

    case 'name-desc':
      return sorted.sort((a, b) => {
        const titleA = (a.title || '').toLowerCase();
        const titleB = (b.title || '').toLowerCase();
        return titleB.localeCompare(titleA, 'ru');
      });

    default:
      return sorted;
  }
};

