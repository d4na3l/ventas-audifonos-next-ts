import { useState, useMemo } from 'react';
import { QuotationItem } from '../types/quotation';
import {
  calculateSubtotal,
  calculateCommission,
  calculateTotal,
} from '../utils/calculations';
import { IProduct } from '../types/product';

interface UseQuotationReturn {
  items: QuotationItem[];
  addToQuotation: (producto: IProduct) => void;
  removeFromQuotation: (productoId: string) => void;
  updateQuantity: (productoId: string, cantidad: number) => void;
  clearQuotation: () => void;
  comisionPorcentaje: number;
  setComisionPorcentaje: (porc: number) => void;
  subtotal: number;
  comision: number;
  total: number;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

export function useQuotation(): UseQuotationReturn {
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [comisionPorcentaje, setComisionPorcentaje] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addToQuotation = (producto: IProduct) => {
    setItems(prev => {
      const existente = prev.find(item => item.producto.id === producto.id);
      if (existente) {
        return prev.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { producto, cantidad: 1 }];
    });
  };

  const removeFromQuotation = (productoId: string) => {
    setItems(prev => prev.filter(item => item.producto.id !== productoId));
  };

  const updateQuantity = (productoId: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromQuotation(productoId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.producto.id === productoId ? { ...item, cantidad } : item
      )
    );
  };

  const clearQuotation = () => {
    setItems([]);
    setComisionPorcentaje(10);
  };

  // Memoizamos los cálculos para no recalcule cada render
  const subtotal = useMemo(() => calculateSubtotal(items), [items]);
  const comision = useMemo(
    () => calculateCommission(subtotal, comisionPorcentaje),
    [subtotal, comisionPorcentaje]
  );
  const total = useMemo(() => calculateTotal(subtotal, comision), [
    subtotal,
    comision,
  ]);

  return {
    items,
    addToQuotation,
    removeFromQuotation,
    updateQuantity,
    clearQuotation,
    comisionPorcentaje,
    setComisionPorcentaje,
    subtotal,
    comision,
    total,
    isLoading,
    setIsLoading,
  };
}
