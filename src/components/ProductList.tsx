import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import { IProduct } from '../types/product';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import ProductCard from './ProductCard';

interface ProductListProps {
  productos: IProduct[];
  loading: boolean;
  onAddToQuotation: (producto: IProduct) => void;
}

export default function ProductList({
  productos,
  loading,
  onAddToQuotation,
}: ProductListProps) {
  const [busqueda, setBusqueda] = React.useState<string>('');
  const [categoriaFiltro, setCategoriaFiltro] = React.useState<string>('');

  // Categorías únicas
  const categorias = useMemo(
    () => Array.from(new Set(productos.map((p) => p.categoria))),
    [productos]
  );

  // Filtrar productos
  const productosFiltrados = useMemo(
    () =>
      productos.filter((producto) => {
        const matchNombre = producto.nombre
          .toLowerCase()
          .includes(busqueda.toLowerCase());
        const matchSku = producto.sku
          .toLowerCase()
          .includes(busqueda.toLowerCase());
        const matchCategoria =
          categoriaFiltro === '' || producto.categoria === categoriaFiltro;
        return (matchNombre || matchSku) && matchCategoria;
      }),
    [productos, busqueda, categoriaFiltro]
  );

  if (loading) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Search className="mr-2" size={20} />
        Catálogo de Productos
      </h2>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar value={busqueda} onChange={setBusqueda} />
        </div>
        <div>
          <CategoryFilter
            categorias={categorias}
            selected={categoriaFiltro}
            onChange={setCategoriaFiltro}
          />
        </div>
      </div>

      {/* Lista de Productos */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {productosFiltrados.map((producto) => (
          <ProductCard
            key={producto.id}
            producto={producto}
            onAdd={onAddToQuotation}
          />
        ))}
      </div>
    </div>
  );
}
