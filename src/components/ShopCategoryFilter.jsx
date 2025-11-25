import { memo, useMemo } from 'react';
import menuData from '../data/menu.json';

const ShopCategoryFilter = memo(({ selectedCategory, onCategoryChange }) => {
  // Собираем все категории из menuData
  const allCategories = useMemo(() => {
    const categories = [];
    menuData.forEach((menu) => {
      if (menu.categories) {
        menu.categories.forEach((cat) => {
          if (cat.categoryId) {
            categories.push({
              id: cat.categoryId,
              title: cat.title,
              sectionId: menu.sectionId,
            });
          }
        });
      }
    });
    return categories;
  }, []);

  if (allCategories.length === 0) return null;

  return (
    <div className="shop-category-filter">
      <label htmlFor="category-select" className="shop-category-label">
        Категория:
      </label>
      <select
        id="category-select"
        className="shop-category-select"
        value={selectedCategory || ''}
        onChange={(e) => onCategoryChange(e.target.value || null)}
      >
        <option value="">Все категории</option>
        {allCategories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.title}
          </option>
        ))}
      </select>
    </div>
  );
});

ShopCategoryFilter.displayName = 'ShopCategoryFilter';

export default ShopCategoryFilter;

