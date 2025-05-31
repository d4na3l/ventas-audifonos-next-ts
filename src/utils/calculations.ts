import { QuotationItem } from '../types/quotation';
import type { IQuotationItemResponse, IQuotationRequest, IQuotationResponseData } from '../types/quotation';
import type { IProduct } from '../types/product';

export function calculateSubtotal(items: QuotationItem[]): number {
  return items.reduce((total, item) => {
    return total + item.producto.precioBase * item.cantidad;
  }, 0);
}

export function calculateCommission(subtotal: number, percentage: number): number {
  return subtotal * (percentage / 100);
}

export function calculateTotal(subtotal: number, commission: number): number {
  return subtotal + commission;
}

/**
 * Calcula la cotización entera: dado un arreglo de productos desde BD
 * y el payload de items (productId + cantidad), retorna un objeto con
 * lineas (detalle) + subtotal + comision + total.
 */
export function generateQuotationReport(
  productos: IProduct[],
  payload: IQuotationRequest
): IQuotationResponseData {
  // 1. Creamos un map rápido de productId => producto
  const mapProductos = new Map<string, IProduct>();
  productos.forEach(p => mapProductos.set(String(p._id), p));

  const lineas: IQuotationItemResponse[] = payload.items.map(itemReq => {
    const prod = mapProductos.get(itemReq.productId);
    if (!prod) {
      // Si no encontramos el producto, parametrizamos un objeto con precio 0
      return {
        producto: { 
          id: itemReq.productId, 
          nombre: 'Producto no encontrado',
          sku: '',
          precioBase: 0
        },
        cantidad: itemReq.cantidad,
        totalLinea: 0
      };
    }
    const totalLinea = prod.precioBase * itemReq.cantidad;
    return {
      producto: {
        id: String(prod._id),
        nombre: prod.nombre,
        sku: prod.sku,
        precioBase: prod.precioBase
      },
      cantidad: itemReq.cantidad,
      totalLinea
    };
  });

  const subtotal = lineas.reduce((sum, linea) => sum + linea.totalLinea, 0);
  const comision = subtotal * (payload.comisionPorcentaje / 100);
  const total = subtotal + comision;

  return { lineas, subtotal, comision, total };
}