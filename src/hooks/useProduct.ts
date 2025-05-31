import { useState, useEffect } from 'react';
import { IProduct } from '../types/product';

interface UseProductReturn {
  producto: IProduct | null;
  loading: boolean;
  error: string | null;
}

/**
 * Llama a GET /api/products/:productId y devuelve el producto.
 */
export function useProduct(productId: string): UseProductReturn {
  const [producto, setProducto] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId || productId.length !== 24) {
      setError('ID inválido');
      setLoading(false);
      return;
    }

    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || 'Error desconocido');
        }
        setProducto(data.data as IProduct);
      } catch (err: any) {
        setError(err.message || 'Error al obtener producto');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  return { producto, loading, error };
}
