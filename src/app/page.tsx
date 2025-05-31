'use client';

import { useProducts } from '../hooks/useProducts';
import { useQuotation } from '../hooks/useQuotation';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductList from '../components/ProductList';
import QuotationPanel from '../components/QuotationPanel';

export default function Home() {
    const { productos, loading: loadingProductos, error } = useProducts();
    const {
      items,
      addToQuotation,
      removeFromQuotation,
      updateQuantity,
      comisionPorcentaje,
      setComisionPorcentaje,
      subtotal,
      comision,
      total,
      isLoading: loadingCotizacion,
      setIsLoading: setLoadingCotizacion,
    } = useQuotation();
  
    if (error) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-red-500">Error al cargar productos: {error}</p>
        </div>
      );
    }
  
    if (loadingProductos) {
      return <LoadingSpinner />;
    }
  
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Sistema de Cotización - Audífonos
          </h1>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Panel de Productos (2 columnas) */}
            <div className="lg:col-span-2">
              <ProductList
                productos={productos}
                loading={loadingProductos}
                onAddToQuotation={producto => {
                  setLoadingCotizacion(true);
                  addToQuotation(producto);
                  setLoadingCotizacion(false);
                }}
              />
            </div>
  
            {/* Panel de Cotización (1 columna) */}
            <QuotationPanel
              items={items}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromQuotation}
              comisionPorcentaje={comisionPorcentaje}
              setComisionPorcentaje={setComisionPorcentaje}
              subtotal={subtotal}
              comision={comision}
              total={total}
              isLoading={loadingCotizacion}
            />
          </div>
        </div>
      </div>
    );
}