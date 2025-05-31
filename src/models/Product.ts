import mongoose, { Model } from 'mongoose';
import type { IProduct, IEspecificaciones } from '../types/product';

const EspecificacionesSchema = new mongoose.Schema<IEspecificaciones>({
  driver: { type: String },
  impedancia: { type: String },
  bluetooth: { type: String },
  bateria: { type: String },
  caracteristicas: { type: [String], default: [] },
}, { _id: false });

const ProductSchema = new mongoose.Schema<IProduct, Model<IProduct>>({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'El SKU es requerido'],
    unique: true,
    uppercase: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: {
      values: ['In-Ear', 'Over-Ear', 'Gaming', 'Cancelación de Ruido', 'Deportivos'],
      message: 'Categoría no válida'
    }
  },
  precioBase: {
    type: Number,
    required: [true, 'El precio base es requerido'],
    min: [0, 'El precio debe ser positivo']
  },
  especificaciones: {
    type: EspecificacionesSchema,
    default: {}
  }
}, {
  timestamps: {
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  },
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

const Product = mongoose.models.Product as Model<IProduct> 
              || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
