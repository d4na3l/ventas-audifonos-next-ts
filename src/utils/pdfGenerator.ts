// src/utils/pdfGenerator.ts

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { IQuotationResponseData } from '../types/quotation';

/**
 * generatePdf: función que construye y descarga un PDF
 * basado en el reporte de cotización y el porcentaje de comisión.
 *
 * @param reporte               - Objeto con la data del reporte (líneas, subtotal, comisión, total)
 * @param comisionPorcentaje    - Porcentaje de comisión aplicado
 * @param fileNamePrefix?       - Prefijo para el nombre del archivo (opcional)
 */
export function generatePdf(
  reporte: IQuotationResponseData,
  comisionPorcentaje: number,
  fileNamePrefix: string = 'cotizacion'
) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });

  // ----- HEADER -----
  const generatePdfHeader = (): number => {
    const pageWidth = doc.internal.pageSize.width;

    // Fondo azul
    doc.setFillColor(59, 130, 246); // blue-600
    doc.rect(0, 0, pageWidth, 60, 'F');

    // Logo placeholder (círculo blanco con texto)
    doc.setFillColor(255, 255, 255);
    doc.circle(40, 30, 15, 'F');
    doc.setTextColor(59, 130, 246);
    doc.setFontSize(12);
    doc.text('LOGO', 32, 35);

    // Título principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('COTIZACIÓN DE AUDÍFONOS', 80, 25);

    // Subtítulo
    doc.setFontSize(12);
    doc.text('Sistema de Cotización Profesional', 80, 40);

    // Línea decorativa blanca
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(2);
    doc.line(80, 45, pageWidth - 40, 45);

    return 80; // Y inicial después del header
  };

  // ----- INFO SECTION -----
  const generateInfoSection = (yStart: number): number => {
    const pageWidth = doc.internal.pageSize.width;
    const currentDate = new Date();

    // Fondo gris claro
    doc.setFillColor(248, 250, 252); // gray-50
    doc.rect(40, yStart, pageWidth - 80, 60, 'F');
    // Borde gris más oscuro
    doc.setDrawColor(226, 232, 240); // gray-300
    doc.rect(40, yStart, pageWidth - 80, 60, 'S');

    doc.setTextColor(51, 65, 85); // slate-700
    doc.setFontSize(14);
    doc.text('INFORMACIÓN DE LA COTIZACIÓN', 50, yStart + 15);

    doc.setFontSize(10);
    doc.text(
      `Fecha de generación: ${currentDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      50,
      yStart + 30
    );
    doc.text(`Número de productos: ${reporte.lineas.length}`, 50, yStart + 40);
    doc.text(`Comisión aplicada: ${comisionPorcentaje}%`, 50, yStart + 50);

    return yStart + 80;
  };

  // ----- TABLA DE LÍNEAS -----
  const generateTableHeader = (yStart: number): number => {
    const pageWidth = doc.internal.pageSize.width;
    const tableWidth = pageWidth - 80;
    const colWidths = [
      tableWidth * 0.4,
      tableWidth * 0.15,
      tableWidth * 0.15,
      tableWidth * 0.1,
      tableWidth * 0.2,
    ];
    let x = 40;

    // Header de tabla azul oscuro
    doc.setFillColor(30, 64, 175); // blue-800
    doc.rect(40, yStart, tableWidth, 25, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text('PRODUCTO', x + 5, yStart + 15);
    x += colWidths[0];
    doc.text('SKU', x + 5, yStart + 15);
    x += colWidths[1];
    doc.text('PRECIO UNIT.', x + 5, yStart + 15);
    x += colWidths[2];
    doc.text('CANT.', x + 5, yStart + 15);
    x += colWidths[3];
    doc.text('TOTAL LÍNEA', x + 5, yStart + 15);

    return yStart + 25;
  };

  const generateTableRow = (
    yStart: number,
    linea: IQuotationResponseData['lineas'][number],
    isEven: boolean
  ): number => {
    const pageWidth = doc.internal.pageSize.width;
    const tableWidth = pageWidth - 80;
    const colWidths = [
      tableWidth * 0.4,
      tableWidth * 0.15,
      tableWidth * 0.15,
      tableWidth * 0.1,
      tableWidth * 0.2,
    ];
    let x = 40;

    // Fila alterna con gris claro
    if (isEven) {
      doc.setFillColor(248, 250, 252); // gray-50
      doc.rect(40, yStart, tableWidth, 20, 'F');
    }

    doc.setTextColor(51, 65, 85); // slate-700
    doc.setFontSize(9);

    // Nombre (cortado si largo)
    const nombreText =
      linea.producto.nombre.length > 35
        ? linea.producto.nombre.substring(0, 32) + '...'
        : linea.producto.nombre;
    doc.text(nombreText, x + 5, yStart + 12);
    x += colWidths[0];

    // SKU
    doc.text(linea.producto.sku, x + 5, yStart + 12);
    x += colWidths[1];

    // Precio unitario
    doc.text(`$${linea.producto.precioBase.toFixed(2)}`, x + 5, yStart + 12);
    x += colWidths[2];

    // Cantidad
    doc.text(linea.cantidad.toString(), x + 5, yStart + 12);
    x += colWidths[3];

    // Total línea
    doc.setFontSize(10);
    doc.text(`$${linea.totalLinea.toFixed(2)}`, x + 5, yStart + 12);

    // Línea divisoria
    doc.setDrawColor(226, 232, 240); // gray-300
    doc.line(40, yStart + 20, pageWidth - 40, yStart + 20);

    return yStart + 20;
  };

  // ----- RESUMEN FINANCIERO -----
  const generateSummarySection = (
    yStart: number
  ): number => {
    const pageWidth = doc.internal.pageSize.width;
    const summaryWidth = 200;
    const summaryX = pageWidth - summaryWidth - 40;

    // Fondo gris claro
    doc.setFillColor(248, 250, 252); // gray-50
    doc.rect(summaryX, yStart, summaryWidth, 80, 'F');
    // Borde azul
    doc.setDrawColor(30, 64, 175); // blue-800
    doc.setLineWidth(2);
    doc.rect(summaryX, yStart, summaryWidth, 80, 'S');

    // Título del resumen
    doc.setFillColor(30, 64, 175); // blue-800
    doc.rect(summaryX, yStart, summaryWidth, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('RESUMEN FINANCIERO', summaryX + 10, yStart + 13);

    // Subtotal
    doc.setTextColor(51, 65, 85); // slate-700
    doc.setFontSize(11);
    doc.text('Subtotal:', summaryX + 10, yStart + 35);
    doc.text(`$${reporte.subtotal.toFixed(2)}`, summaryX + summaryWidth - 80, yStart + 35);

    // Comisión
    doc.text(`Comisión (${comisionPorcentaje}%):`, summaryX + 10, yStart + 50);
    doc.text(`$${reporte.comision.toFixed(2)}`, summaryX + summaryWidth - 80, yStart + 50);

    // Línea separadora
    doc.setDrawColor(30, 64, 175);
    doc.line(summaryX + 10, yStart + 58, summaryX + summaryWidth - 10, yStart + 58);

    // Total
    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129); // green-500
    doc.text('TOTAL:', summaryX + 10, yStart + 72);
    doc.text(`$${reporte.total.toFixed(2)}`, summaryX + summaryWidth - 80, yStart + 72);

    return yStart + 100;
  };

  // ----- PIE DE PÁGINA -----
  const generateFooter = () => {
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    doc.setDrawColor(59, 130, 246); // blue-600
    doc.setLineWidth(2);
    doc.line(40, pageHeight - 40, pageWidth - 40, pageHeight - 40);

    doc.setTextColor(107, 114, 128); // gray-500
    doc.setFontSize(8);
    doc.text('Generado automáticamente por Sistema de Cotización v1.0', 40, pageHeight - 25);
    doc.text(
      `Página ${doc.getCurrentPageInfo().pageNumber}`,
      pageWidth - 80,
      pageHeight - 25
    );
    doc.text(new Date().toISOString(), 40, pageHeight - 15);
  };

  // ===== Construcción del PDF =====
  let y = generatePdfHeader();
  y = generateInfoSection(y);
  y = generateTableHeader(y);

  reporte.lineas.forEach((linea, idx) => {
    y = generateTableRow(y, linea, idx % 2 === 1);
    if (y > 750 && idx < reporte.lineas.length - 1) {
      doc.addPage();
      y = 40;
      y = generateTableHeader(y);
    }
  });

  y = generateSummarySection(y);
  generateFooter();

  // Descargar PDF
  doc.save(`${fileNamePrefix}_${Date.now()}.pdf`);
}
