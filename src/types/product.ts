// src/types/product.ts
import { Document } from 'mongoose';

export interface IEspecificaciones {
  driver?: string;
  impedancia?: string;
  bluetooth?: string;
  bateria?: string;
  caracteristicas?: string[];
}

export interface IProduct extends Document {
  id?: string;
  nombre: string;
  sku: string;
  descripcion: string;
  categoria:
    | 'In-Ear'
    | 'Over-Ear'
    | 'Gaming'
    | 'Cancelación de Ruido'
    | 'Deportivos';
  precioBase: number;
  especificaciones: IEspecificaciones;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
}
