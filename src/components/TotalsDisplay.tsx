import React from 'react';

interface TotalsDisplayProps {
  subtotal: number;
  comision: number;
  total: number;
  comisionPorcentaje: number;
}

export default function TotalsDisplay({
  subtotal,
  comision,
  total,
  comisionPorcentaje,
}: TotalsDisplayProps) {
  return (
    <div className="border-t pt-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Comisión ({comisionPorcentaje}%):</span>
          <span className="font-medium text-green-600">${comision.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t pt-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
