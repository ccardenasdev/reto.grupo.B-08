# ReciclaConecta ♻️

Sitio web para comprar y vender material reciclable con un precio justo y claro.
Conecta a quienes venden (hogares, recicladores, emprendedores) con quienes compran
(acopios, empresas, impresión 3D, reparadores).

Proyecto final · FrontEnd · Desarrollo Web (JavaScript Full Stack)
Autora: Carol Estefani Cárdenas Rodríguez

## Tecnologías

- React + Vite
- React Router (rutas anidadas, `Outlet`, `useParams`, `useNavigate`)
- Material UI
- CSS propio con efectos 3D (`perspective`, `transform-style: preserve-3d`)

## Cómo ejecutarlo

```bash
yarn
yarn dev
```

Abrir http://localhost:5173

## Funcionalidades (MVP)

1. **Publicar material (Create):** tipo, cantidad (kilos, bolsas o unidades), foto y barrio.
2. **Precio estimado:** se calcula con la tabla de precios de referencia por kilo
   (`public/data/precios.json`). Aparatos y materiales especiales no tienen precio por kilo:
   los compradores ofertan directo. Los materiales especiales solo aceptan compradores verificados.
3. **Ver ofertas:** el vendedor ve las ofertas, elige la mejor y ve el precio final y los datos
   para coordinar la entrega o la recogida.

## CRUD de publicaciones

| URL | Pantalla | Archivo | Operación |
| --- | --- | --- | --- |
| `/` | Inicio | `pages/Inicio.jsx` | — |
| `/precios` | Tabla de precios | `pages/Precios.jsx` | — |
| `/publicaciones` | Listado con búsqueda y filtro | `pages/publicaciones/Listado.jsx` | Read |
| `/publicaciones/crear` | Nueva publicación | `pages/publicaciones/Crear.jsx` | Create |
| `/publicaciones/editar/:id` | Editar publicación | `pages/publicaciones/Editar.jsx` | Update |
| `/publicaciones/:id` | Detalle y ofertas | `pages/publicaciones/Detalle.jsx` | Update |
| (botón Eliminar) | Diálogo de confirmación | `pages/publicaciones/Listado.jsx` | Soft delete |
| cualquier otra | 404 | `pages/NoEncontrada.jsx` | — |

**Soft delete:** al eliminar, la publicación no se borra; se marca `activo: false`.
Se puede ver con el interruptor "Ver eliminadas" y restaurar.

## Estructura

```
public/data/
  publicaciones.json   ← datos semilla
  precios.json         ← tabla de precios por kilo
src/
  hooks/useCrud.js     ← fetch + estados cargando/error + crear/actualizar/eliminar
  utils/precio.js      ← cálculo del precio estimado
  components/          ← Layout, Tarjeta3D, Cubo3D, TarjetaPublicacion, FormularioPublicacion, EstadoCarga
  pages/               ← Inicio, Precios, NoEncontrada y publicaciones/
  theme.js             ← tema de Material UI
  index.css            ← estilos y efectos 3D
```

Los datos viven en `App.jsx` (que no se desmonta) y se cargan una vez con `fetch` dentro de `useEffect`.
Cuando exista el backend, solo hay que cambiar la URL de `useCrud`.
