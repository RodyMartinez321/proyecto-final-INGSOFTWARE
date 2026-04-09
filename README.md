# Portal de Pedidos

Una aplicación de carrito de compras construida con **React**, **Vite** y **Tailwind CSS**. El proyecto ofrece un catálogo de productos, carrito persistente, página de facturas y autenticación local simple.

## Características

- Catálogo de productos con categorías y descripción.
- Carrito de compras persistente usando `localStorage`.
- Página separada de carrito (`public/carrito.html`).
- Página de facturas (`public/facturas.html`).
- Autenticación básica de usuario y registro local.
- Animaciones visuales para interacción en el carrito.
- Estilos con Tailwind CSS y layout responsivo.

## Estructura principal

- `src/App.jsx` - componente principal de React y lógica de la tienda.
- `src/main.jsx` - punto de entrada de Vite.
- `src/index.css` - estilos personalizados y utilidades Tailwind.
- `public/` - incluye páginas estáticas `carrito.html` y `facturas.html`.
- `package.json` - scripts de desarrollo y dependencias.

## Tecnologías usadas

- React 18
- Vite
- Tailwind CSS
- JavaScript moderno (ESM)
- HTML / CSS
- `localStorage` para persistencia de carrito y usuario

## Requisitos

- Node.js 18 o superior
- npm 10 o superior (o `pnpm` si prefieres)

## Instalación

Desde la carpeta del proyecto:

```bash
npm install
```

Si usas `pnpm`:

```bash
pnpm install
```

## Ejecución en desarrollo

```bash
npm run dev
```

Abre la URL que indique Vite en la terminal, normalmente:

```bash
http://localhost:5173
```

## Construcción para producción

```bash
npm run build
```

## Notas

- El carrito y el usuario se guardan en el navegador con `localStorage`.
- Las páginas de `carrito.html` y `facturas.html` son independientes y pueden abrirse directamente desde la carpeta `public`.
- No se requieren cambios en la app para usar este README.

## Autores

- Rody Mathis — matrícula 100581144
- Breilin de la Cruz — matrícula 100616363
