'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import type { IProduct } from '../types/product';

interface ProductCardProps {
  producto: IProduct;
  onAdd: (producto: IProduct) => void;
}

export default function ProductCard({ producto, onAdd }: ProductCardProps) {
  const productId = producto.id?.toString() || '';

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {/* Usar productId validado */}
          <Link 
            href={`/products/${productId}`}
            className="font-semibold text-gray-800 hover:underline"
          >
            {producto.nombre}
          </Link>
          <p className="text-sm text-gray-600 mb-1">SKU: {producto.sku}</p>
          <p className="text-sm text-gray-600 mb-2">{producto.descripcion}</p>
          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
            {producto.categoria}
          </span>
          {producto.especificaciones && (
            <div className="mt-2 text-xs text-gray-500">
              {producto.especificaciones.driver &&
                `Driver: ${producto.especificaciones.driver} | `}
              {producto.especificaciones.bluetooth &&
                `Bluetooth: ${producto.especificaciones.bluetooth}`}
            </div>
          )}
        </div>
        <div className="text-right ml-4">
          <p className="text-lg font-bold text-green-600">
            ${producto.precioBase.toFixed(2)}
          </p>
          <button
            onClick={() => onAdd(producto)}
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm flex items-center"
          >
            <ShoppingCart size={14} className="mr-1" />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
