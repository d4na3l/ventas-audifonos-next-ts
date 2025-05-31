import { useState, useEffect } from 'react';
import { IProduct } from '../types/product';
import { fetchAllProducts } from '../services/productService';

interface UseProductsReturn {
  productos: IProduct[];
  loading: boolean;
  error: string | null;
}

export function useProducts(): UseProductsReturn {
  const [productos, setProductos] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function cargar() {
      try {
        const lista = await fetchAllProducts();
        setProductos(lista);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  return { productos, loading, error };
}
