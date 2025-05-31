// src/components/GeneratePdfButton.tsx
'use client';

import React, { useState } from 'react';
import { QuotationItem, IQuotationRequest, IQuotationResponseData } from '../types/quotation';
import { FileText, Download, Loader2, CheckCircle } from 'lucide-react';
import { generatePdf } from '../utils/pdfGenerator'; // <— Importamos la función utilitaria

interface GeneratePdfButtonProps {
  items: QuotationItem[];
  comisionPorcentaje: number;
}

export default function GeneratePdfButton({
  items,
  comisionPorcentaje,
}: GeneratePdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  const handleGenerate = async () => {
    setError(null);
    setIsGenerating(true);

    // 1) Construir el payload a partir de "items" y "comisionPorcentaje"
    const payload: IQuotationRequest = {
      items: items.map((item) => ({
        productId: item.producto.id!, // asumimos que id existe
        cantidad: item.cantidad,
      })),
      comisionPorcentaje,
    };

    try {
      // 2) Llamar al endpoint /api/quotation/report
      const res = await fetch('/api/quotation/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Error desconocido al generar reporte');
      }

      // 3) Cuando tenemos el reporte, llamar a la función generatePdf
      const reporte: IQuotationResponseData = data.data;
      generatePdf(reporte, comisionPorcentaje);

      // 4) Marcar "lastGenerated" y terminar
      setLastGenerated(new Date());
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al generar el reporte');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-4">
      {error && <p className="text-red-500 text-sm mb-2">Error: {error}</p>}

      <button
        onClick={handleGenerate}
        className={`w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-md font-medium ${
          isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
        }`}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin h-5 w-5" />
            Generando…
          </>
        ) : lastGenerated ? (
          <>
            <CheckCircle className="h-5 w-5 text-white" />
            Generar de Nuevo
          </>
        ) : (
          <>
            <FileText className="h-5 w-5 text-white" />
            Generar Cotización
          </>
        )}
      </button>
    </div>
  );
}
