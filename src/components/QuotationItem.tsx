// src/components/QuotationItem.tsx
'use client';

import React from 'react';
import { Trash2 } from 'lucide-react';
import { QuotationItem as QItem } from '../types/quotation';

interface QuotationItemProps {
  item: QItem;
  onUpdate: (productoId: string, cantidad: number) => void;
  onRemove: (productoId: string) => void;
}

export default function QuotationItem({
  item,
  onUpdate,
  onRemove,
}: QuotationItemProps) {
  return (
    <div className="border border-gray-200 rounded p-3">
      <div className="flex justify-between items-start mb-2">
        {/* Muestro el nombre */}
        <h4 className="font-medium text-sm">{item.producto.nombre}</h4>
        <button
          onClick={() => onRemove(item.producto.id!)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <p className="text-xs text-gray-600 mb-2">SKU: {item.producto.sku}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => onUpdate(item.producto.id!, item.cantidad - 1)}
            className="bg-gray-200 px-2 py-1 rounded text-sm"
          >
            –
          </button>
          <span className="mx-2 font-medium">{item.cantidad}</span>
          <button
            onClick={() => onUpdate(item.producto.id!, item.cantidad + 1)}
            className="bg-gray-200 px-2 py-1 rounded text-sm"
          >
            +
          </button>
        </div>
        <div className="text-right">
          <p className="text-sm">
            ${item.producto.precioBase.toFixed(2)} c/u
          </p>
          <p className="font-bold">
            ${(item.producto.precioBase * item.cantidad).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
