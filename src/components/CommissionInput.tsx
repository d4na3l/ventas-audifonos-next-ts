import React from 'react';

interface CommissionInputProps {
  value: number;
  onChange: (valor: number) => void;
}

export default function CommissionInput({
  value,
  onChange,
}: CommissionInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Comisión de Venta (%)
      </label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        min={0}
        max={100}
        step={0.5}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
