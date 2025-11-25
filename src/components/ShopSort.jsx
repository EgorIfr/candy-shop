import { memo } from 'react';

const ShopSort = memo(({ sortBy, onSortChange }) => {
  const sortOptions = [
    { value: 'default', label: 'По умолчанию' },
    { value: 'price-asc', label: 'Цена: по возрастанию' },
    { value: 'price-desc', label: 'Цена: по убыванию' },
    { value: 'name-asc', label: 'Название: А-Я' },
    { value: 'name-desc', label: 'Название: Я-А' },
  ];

  return (
    <div className="shop-sort-container">
      <label htmlFor="sort-select" className="shop-sort-label">
        Сортировка:
      </label>
      <select
        id="sort-select"
        className="shop-sort-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

ShopSort.displayName = 'ShopSort';

export default ShopSort;

