import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { faker } from '@faker-js/faker';
import dbConnect from '../lib/mongodb';
import Product from '../models/Product';
import type { IProduct } from '../types/product';

const categorias = ['In-Ear', 'Over-Ear', 'Gaming', 'Cancelación de Ruido', 'Deportivos'] as const;
type Categoria = typeof categorias[number];

const especsPorCategoria: Record<Categoria, {
  driver?: string[];
  impedancia?: string[];
  bluetooth?: string[];
  bateria?: string[];
  caracteristicas?: string[];
}> = {
  'Gaming': {
    driver: ['40mm', '50mm', '53mm'],
    impedancia: ['16 Ohms', '32 Ohms', '64 Ohms'],
    caracteristicas: ['Micrófono Retráctil', 'Iluminación RGB', 'Sonido 7.1']
  },
  'Cancelación de Ruido': {
    bluetooth: ['5.0', '5.1', '5.2'],
    bateria: ['20h', '30h', '40h'],
    caracteristicas: ['ANC Activa', 'Modo Transparencia', 'Carga Rápida']
  },
  'In-Ear': {
    driver: ['6mm', '8mm', '10mm'],
    impedancia: ['16 Ohms', '32 Ohms'],
    bluetooth: ['5.0', '5.2'],
    bateria: ['6h', '8h', '10h'],
    caracteristicas: ['Resistentes al agua', 'Micrófono integrado', 'Estuche de carga']
  },
  'Over-Ear': {
    driver: ['40mm', '42mm', '45mm'],
    impedancia: ['32 Ohms', '64 Ohms'],
    bluetooth: ['5.0', '5.1'],
    bateria: ['20h', '25h', '30h'],
    caracteristicas: ['Almohadillas de espuma', 'Diadema ajustable', 'Plegables']
  },
  'Deportivos': {
    driver: ['8mm', '10mm'],
    impedancia: ['16 Ohms', '32 Ohms'],
    bluetooth: ['5.0', '5.2'],
    bateria: ['8h', '10h', '12h'],
    caracteristicas: ['Resistentes al sudor', 'Ajuste seguro', 'Controles táctiles']
  }
};

async function seedProducts() {
  try {
    await dbConnect();
    console.log('🟢 Conectado a MongoDB para seed');

    // Borra todo antes de insertar
    await Product.deleteMany({});
    console.log('🧹 Todos los productos existentes fueron eliminados.');

    const nuevosProductos: Array<Partial<IProduct>> = [];

    for (let i = 0; i < 20; i++) {
      const categoria = faker.helpers.arrayElement(categorias);
      const specsGroup = especsPorCategoria[categoria] || {};

      const nuevasEspecificaciones: Partial<IProduct['especificaciones']> = {
        driver: specsGroup.driver
          ? faker.helpers.arrayElement(specsGroup.driver)
          : undefined,

        impedancia: specsGroup.impedancia
          ? faker.helpers.arrayElement(specsGroup.impedancia)
          : undefined,

        bluetooth: specsGroup.bluetooth
          ? faker.helpers.arrayElement(specsGroup.bluetooth)
          : undefined,

        bateria: specsGroup.bateria
          ? faker.helpers.arrayElement(specsGroup.bateria)
          : undefined,

        caracteristicas: specsGroup.caracteristicas || []
      };

      nuevosProductos.push({
        nombre: `${faker.commerce.productName()} ${categoria}`,
        sku: `AUD-${faker.string.alphanumeric(6).toUpperCase()}`,
        descripcion: faker.commerce.productDescription(),
        categoria,
        precioBase: parseFloat(faker.commerce.price({ min: 50, max: 500, dec: 2 })),
        especificaciones: nuevasEspecificaciones as IProduct['especificaciones']
      });
    }

    await Product.insertMany(nuevosProductos);
    console.log('✅ 20 productos creados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seedProducts:', error);
    process.exit(1);
  }
}

seedProducts();
