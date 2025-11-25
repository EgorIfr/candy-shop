import { memo } from 'react';

const ShopSearch = memo(({ searchQuery, onSearchChange }) => {
  return (
    <div className="shop-search-container">
      <input
        type="text"
        className="shop-search-input"
        placeholder="Поиск товаров..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchQuery && (
        <button
          className="shop-search-clear"
          onClick={() => onSearchChange('')}
          aria-label="Очистить поиск"
        >
          ×
        </button>
      )}
    </div>
  );
});

ShopSearch.displayName = 'ShopSearch';

export default ShopSearch;

