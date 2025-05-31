import { IProduct } from '../types/product';

export async function fetchAllProducts(): Promise<IProduct[]> {
  const res = await fetch('/api/products');
  const data = await res.json();
  if (!data.success) {
    throw new Error('Error al obtener productos');
  }
  return data.data as IProduct[];
}

export async function fetchProductById(productId: string): Promise<IProduct> {
  const res = await fetch(`/api/products/${productId}`);
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error || 'Error al obtener producto');
  }
  return data.data as IProduct;
}
