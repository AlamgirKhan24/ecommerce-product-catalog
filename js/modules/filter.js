// ---------------------------------------------
// Filter — category / price / color / brand / rating filtering
// Pure functions: takes the full product array + a filter state object,
// returns a filtered array. No DOM, no storage — filtersUI.js owns state.
// ---------------------------------------------

/**
 * Default/empty filter state shape, so filtersUI.js has a consistent starting point.
 */
export function createDefaultFilterState() {
  return {
    categories: [],   // e.g. ['Headphones', 'Carry']
    brands: [],       // e.g. ['Nitec']
    colors: [],       // e.g. ['#1767d8']
    badges: [],       // e.g. ['new', 'sale']
    priceRange: null, // e.g. [0, 200], null = no price filter applied
    minRating: 0,     // e.g. 4 -> only 4+ star products
    inStockOnly: false,
  };
}

/** Apply the full filter state to a product array */
export function applyFilters(products, filters) {
  return products.filter((product) => {
    if (filters.categories.length && !filters.categories.includes(product.category)) {
      return false;
    }

    if (filters.brands.length && !filters.brands.includes(product.brand)) {
      return false;
    }

    if (filters.colors.length) {
      const hasMatchingColor = product.colors?.some((c) => filters.colors.includes(c));
      if (!hasMatchingColor) return false;
    }

    if (filters.badges?.length && !filters.badges.includes(product.badge)) {
      return false;
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      if (product.price < min || product.price > max) return false;
    }

    if (filters.minRating > 0 && product.rating < filters.minRating) {
      return false;
    }

    if (filters.inStockOnly && (!product.stock || product.stock <= 0)) {
      return false;
    }

    return true;
  });
}

/** Toggle a value in/out of a filter array field (categories, brands, colors, badges) */
export function toggleFilterValue(filters, field, value) {
  const current = filters[field];
  const exists = current.includes(value);

  return {
    ...filters,
    [field]: exists ? current.filter((v) => v !== value) : [...current, value],
  };
}

/** Count how many filters are currently active — used for a "Filters (3)" badge */
export function countActiveFilters(filters) {
  let count = 0;
  count += filters.categories.length;
  count += filters.brands.length;
  count += filters.colors.length;
  count += filters.badges?.length || 0;
  count += filters.priceRange ? 1 : 0;
  count += filters.minRating > 0 ? 1 : 0;
  count += filters.inStockOnly ? 1 : 0;
  return count;
}

/** Derive available price min/max from the full dataset — feeds the noUiSlider range */
export function getPriceBounds(products) {
  if (!products.length) return { min: 0, max: 0 };
  const prices = products.map((p) => p.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}

/** Derive unique filter option lists from the dataset (for rendering checkboxes) */
export function getFilterOptions(products) {
  return {
    categories: [...new Set(products.map((p) => p.category))].sort(),
    brands: [...new Set(products.map((p) => p.brand))].sort(),
    colors: [...new Set(products.flatMap((p) => p.colors ?? []))],
  };
}