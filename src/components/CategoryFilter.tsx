import React from 'react';

interface CategoryFilterProps {
  categorias: string[];
  selected: string;
  onChange: (valor: string) => void;
}

export default function CategoryFilter({
  categorias,
  selected,
  onChange,
}: CategoryFilterProps) {
  return (
    <select
      value={selected}
      onChange={e => onChange(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">Todas las categorías</option>
      {categorias.map(cat => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}
