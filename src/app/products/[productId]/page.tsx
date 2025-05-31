// src/app/products/[productId]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { IProduct } from '../../../types/product';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const router = useRouter();
  const [producto, setProducto] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId || productId.length !== 24) {
      setError('ID de producto inválido');
      setLoading(false);
      return;
    }

    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (!data.success) {
          setError(data.error || 'Error desconocido');
          setLoading(false);
          return;
        }
        setProducto(data.data);
      } catch (e: any) {
        setError(e.message || 'Error al conectarse');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  if (!producto) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No se encontró el producto.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline mb-4"
        >
          ← Volver
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{producto.nombre}</h1>
          <p className="text-sm text-gray-600 mb-2">SKU: {producto.sku}</p>
          <p className="mb-4">{producto.descripcion}</p>
          <div className="space-y-2 mb-6">
            <p>
              <span className="font-semibold">Categoría:</span> {producto.categoria}
            </p>
            <p>
              <span className="font-semibold">Precio base:</span> $
              {producto.precioBase.toFixed(2)}
            </p>
            {producto.especificaciones && (
              <div>
                <h2 className="font-semibold mt-4">Especificaciones:</h2>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {producto.especificaciones.driver && (
                    <li>Driver: {producto.especificaciones.driver}</li>
                  )}
                  {producto.especificaciones.impedancia && (
                    <li>Impedancia: {producto.especificaciones.impedancia}</li>
                  )}
                  {producto.especificaciones.bluetooth && (
                    <li>Bluetooth: {producto.especificaciones.bluetooth}</li>
                  )}
                  {producto.especificaciones.bateria && (
                    <li>Batería: {producto.especificaciones.bateria}</li>
                  )}
                  {producto.especificaciones.caracteristicas &&
                    producto.especificaciones.caracteristicas.length > 0 && (
                      <li>
                        Características:{" "}
                        {producto.especificaciones.caracteristicas.join(", ")}
                      </li>
                    )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
