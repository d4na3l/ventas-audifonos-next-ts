// src/app/api/quotation/report/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import type {
  IQuotationRequest,
  IQuotationResponseData
} from '../../../../types/quotation';
import { generateQuotationReport } from '../../../../utils/calculations';

/**
 * POST /api/quotation/report
 * Recibe un JSON con { items: [{ productId, cantidad }, …], comisionPorcentaje } 
 * Devuelve un JSON con lineas, subtotal, comision y total.
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = (await request.json()) as Partial<IQuotationRequest>;
    if (!body.items || !Array.isArray(body.items) || typeof body.comisionPorcentaje !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Payload inválido: se requiere { items[], comisionPorcentaje }' },
        { status: 400 }
      );
    }

    // Validar cada item
    for (const item of body.items) {
      if (
        !item.productId ||
        typeof item.productId !== 'string' ||
        !/^[0-9a-fA-F]{24}$/.test(item.productId) ||
        typeof item.cantidad !== 'number' ||
        item.cantidad <= 0
      ) {
        return NextResponse.json(
          { success: false, error: `Item inválido en cotización: ${JSON.stringify(item)}` },
          { status: 400 }
        );
      }
    }

    // Traer de DB todos los productos cuyos IDs aparecen en items
    const ids = body.items.map(i => i.productId);
    const productosBD = await Product.find({ _id: { $in: ids } });

    // Generar reporte
    const reporte: IQuotationResponseData = generateQuotationReport(productosBD as any, body as IQuotationRequest);

    return NextResponse.json({ success: true, data: reporte });
  } catch (error: any) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
