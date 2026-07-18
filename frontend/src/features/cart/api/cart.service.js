import { api } from '@/api/axios';

function mapCartItem(item) {
  return {
    id: item.id,
    productId: item.product_id,
    quantity: item.quantity,
    specLabel: null,
    product: {
      id: item.product_id,
      name: item.title,
      slug: item.slug,
      price: item.price,
      image: item.image,
    },
  };
}

export async function getCart() {
  const { data } = (await api.get('/cart')).data;
  return data.items.map(mapCartItem);
}

export async function addToCart(productId, quantity) {
  return (await api.post(`/cart/${productId}`, { quantity })).data;
}

export async function updateCartItem(cartItemId, quantity) {
  return (await api.patch(`/cart/${cartItemId}`, { quantity })).data;
}

export async function removeCartItem(cartItemId) {
  return (await api.delete(`/cart/${cartItemId}`)).data;
}
