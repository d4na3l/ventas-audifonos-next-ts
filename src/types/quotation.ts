import type { IProduct } from './product';

export interface QuotationItem {
  producto: IProduct;
  cantidad: number;
}

export interface QuotationState {
  items: QuotationItem[];
  comisionPorcentaje: number;
  isLoading: boolean;
}

export interface IQuotationItemRequest {
  productId: string;
  cantidad: number;
}

export interface IQuotationItemResponse {
  producto: {
    id: string;
    nombre: string;
    categoria: string,
    sku: string;
    precioBase: number;
  };
  cantidad: number;
  totalLinea: number;
}

export interface IQuotationRequest {
  items: IQuotationItemRequest[];
  comisionPorcentaje: number;
}

export interface IQuotationResponseData {
  lineas: IQuotationItemResponse[];
  subtotal: number;
  comision: number;
  total: number;
}
