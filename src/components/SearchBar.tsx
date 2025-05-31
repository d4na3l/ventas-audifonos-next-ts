import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (valor: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Buscar por nombre o SKU..."
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  );
}
