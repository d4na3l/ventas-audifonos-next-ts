// src/app/api/products/route.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Product from '../../../models/Product';
import type { IProduct } from '../../../types/product';

/** 
 * GET /api/products
 * Devuelve lista completa de productos.
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const productos = await Product.find({}).sort({ fechaCreacion: -1 });
    return NextResponse.json({
      success: true,
      data: productos,
      count: productos.length
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/** 
 * POST /api/products
 * Crea un nuevo producto
 * Se espera un JSON con { nombre, sku, descripcion, categoria, precioBase, especificaciones }.
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body: Partial<IProduct> = await request.json();

    const requiredFields: Array<keyof IProduct> = ['nombre', 'sku', 'descripcion', 'categoria', 'precioBase'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Falta el campo obligatorio: ${field}` },
          { status: 400 }
        );
      }
    }

    // Evitar que envie campos no deseados:
    const nuevoProductoData: Partial<IProduct> = {
      nombre: String(body.nombre).trim(),
      sku: String(body.sku).trim().toUpperCase(),
      descripcion: String(body.descripcion).trim(),
      categoria: body.categoria as IProduct['categoria'],
      precioBase: Number(body.precioBase),
      especificaciones: (body.especificaciones as IProduct['especificaciones']) || {}
    };

    const productoExistente = await Product.findOne({ sku: nuevoProductoData.sku });
    if (productoExistente) {
      return NextResponse.json(
        { success: false, error: 'Ya existe un producto con ese SKU' },
        { status: 409 }
      );
    }

    const productoCreado = await Product.create(nuevoProductoData);
    return NextResponse.json({ success: true, data: productoCreado }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
