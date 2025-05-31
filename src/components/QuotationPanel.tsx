// src/components/QuotationPanel.tsx
'use client';

import React from 'react';
import { Calculator } from 'lucide-react';
import { QuotationItem as QItem } from '../types/quotation';
import QuotationItem from './QuotationItem';
import CommissionInput from './CommissionInput';
import TotalsDisplay from './TotalsDisplay';
import GeneratePdfButton from './GeneratePdfButton';

interface QuotationPanelProps {
  items: QItem[];
  onUpdateQuantity: (productoId: string, cantidad: number) => void;
  onRemove: (productoId: string) => void;
  comisionPorcentaje: number;
  setComisionPorcentaje: (porc: number) => void;
  subtotal: number;
  comision: number;
  total: number;
  isLoading: boolean;
}

export default function QuotationPanel({
  items,
  onUpdateQuantity,
  onRemove,
  comisionPorcentaje,
  setComisionPorcentaje,
  subtotal,
  comision,
  total,
  isLoading,
}: QuotationPanelProps) {
  if (isLoading) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Calculator className="mr-2" size={20} />
        Cotización
      </h2>

      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No hay productos en la cotización
        </p>
      ) : (
        <>
          <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <QuotationItem
                key={item.producto.id}
                item={item}
                onUpdate={onUpdateQuantity}
                onRemove={onRemove}
              />
            ))}
          </div>

          {/* Input para modificar la comisión */}
          <CommissionInput
            value={comisionPorcentaje}
            onChange={setComisionPorcentaje}
          />

          {/* Mostramos sólo los totales */}
          <TotalsDisplay
            subtotal={subtotal}
            comision={comision}
            total={total}
            comisionPorcentaje={comisionPorcentaje}
          />

          {/* Botón que genera el PDF */}
          <GeneratePdfButton
            items={items}
            comisionPorcentaje={comisionPorcentaje}
          />
        </>
      )}
    </div>
  );
}
