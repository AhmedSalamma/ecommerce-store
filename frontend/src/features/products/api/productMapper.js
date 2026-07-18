function computeDiscountPercent(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function mapProduct(raw) {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.title,
    description: raw.description,
    brand: raw.brand?.name ?? null,
    brandSlug: raw.brand?.slug ?? null,
    category: raw.category?.slug ?? null,
    categoryName: raw.category?.name ?? null,
    price: raw.price,
    oldPrice: raw.old_price,
    discountPercent: computeDiscountPercent(raw.price, raw.old_price),
    stock: raw.stock,
    inStock: raw.in_stock,
    color: raw.color,
    storage: raw.storage,
    rating: raw.rating,
    reviews: raw.reviews_count,
    badge: raw.badge,
    isFeatured: raw.is_featured,
    image: raw.image ?? null,
    images: raw.images ?? [],
  };
}
