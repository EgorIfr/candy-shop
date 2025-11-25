import { memo } from 'react';

const ShopFilters = memo(({ 
  activeFilter, 
  onFilterChange, 
  onClearFilters, 
  hasActiveFilters 
}) => {
  const filters = [
    { value: 'all', label: 'Все товары' },
    { value: 'new', label: 'Новинки' },
    { value: 'popular', label: 'Популярные' },
  ];

  return (
    <div className="shop-filters-section">
      <div className="shop-filters">
        {filters.map((filter) => (
          <button
            key={filter.value}
            className={`filter-button ${
              (!activeFilter || activeFilter === 'all') && filter.value === 'all'
                ? 'active'
                : activeFilter === filter.value
                ? 'active'
                : ''
            }`}
            onClick={() => onFilterChange(filter.value === 'all' ? null : filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
      {hasActiveFilters && (
        <button
          className="clear-filters-button"
          onClick={onClearFilters}
        >
          Сбросить фильтры
        </button>
      )}
    </div>
  );
});

ShopFilters.displayName = 'ShopFilters';

export default ShopFilters;

