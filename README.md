# Sistema de Cotización de Productos

Este proyecto es una aplicación web para gestionar cotizaciones de productos. Combina **Next.js** con **TypeScript** y **MongoDB** como base de datos.

## 🚀 Empezando

### Prerrequisitos

- Node.js v18 o superior
- MongoDB (local o Atlas)
- npm o yarn

### Instalación

1. **Clonar el repositorio:**
  ```bash
  git clone https://github.com/d4na3l/ventas-audifonos-next-ts
  cd ventas-audifonos-next-ts
  ```

2. **Instalar dependencias:**
  ```bash
  npm install
  # o
  yarn install
  ```

3. **Configurar variables de entorno:**
  Crear un archivo `.env.local` en la raíz del proyecto:
  ```env
  MONGODB_URI=mongodb+srv://usuario:contraseña@cluster0.tucluster.mongodb.net/nombre-db?retryWrites=true&w=majority
  PORT=3000
  ```

4. **Poblar la base de datos:**
  ```bash
  npm run db:seed
  ```

5. **Iniciar la aplicación:**
  ```bash
  npm run dev
  # o
  yarn dev
  ```

La aplicación estará disponible en: [http://localhost:3000](http://localhost:3000)


## ⚙️ Funcionalidades Principales

### 1. Gestión de Productos

- Catálogo de productos organizado por categorías
- Búsqueda y filtrado de productos
- Detalles técnicos de cada producto

### 2. Sistema de Cotización

- **Crear cotizaciones:**
  - Agregar/eliminar productos
  - Ajustar cantidades
  - Ver subtotal en tiempo real

- **Cálculo automático:**
  - Comisiones basadas en reglas de negocio
  - Impuestos y descuentos
  - Total final

- **Generar cotizaciones:**
  - Generar reporte en formato PDF
