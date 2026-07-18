export const queryKeys = {
  products: (params = {}) => ['products', params],
  product: (id) => ['product', id],
  categories: ['categories'],
  brands: ['brands'],
  me: ['me'],
  cart: ['cart'],
  addresses: ['addresses'],
  shippingPrices: ['shipping-prices'],
  orders: (params = {}) => ['orders', params],
  order: (id) => ['order', id],
};
