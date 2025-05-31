import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
interface ResolvedProductParams {
  productId: string;
}

export async function GET(
  request: Request,
  { params: paramsPromise }: { params: Promise<ResolvedProductParams> }
) {
  try {
    await dbConnect();

    const actualParams: ResolvedProductParams = await paramsPromise;
    const productId = actualParams.productId;
    
    if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
      return NextResponse.json(
        { success: false, error: 'ID de producto no válido' },
        { status: 400 }
      );
    }

    const product = await Product.findById(productId).exec();
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });

  } catch (error) {
    console.error('Error al obtener el producto:', error);
    
    let errorMessage = 'Error interno del servidor';
    let statusCode = 500;

    if (error instanceof Error && error.name === 'CastError') {
      const castError = error as any;
      if (castError.kind === 'ObjectId') {
        errorMessage = 'Formato de ID de producto inválido para la búsqueda.';
        statusCode = 400;
      }
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}