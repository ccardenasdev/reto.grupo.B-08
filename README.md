# Carsystem Repuestos · prototipo

Prototipo académico · Bootcamp Estud-IA · datos del caso. Catálogo público, solicitud única de cotización, seguimiento, cuentas de clientes, precio mayorista y panel interno con MFA.

**Cambios frente al alcance inicial, decididos por la autora:** hay registro público para clientes (el personal interno sigue creándose solo por script) y existe un pago en línea **simulado**, que no mueve dinero ni pide datos bancarios. Reglas comerciales: 20 % mayorista para clientes registrados con el botón activo y más de 24 unidades en el pedido; 5 % en la primera compra; no se acumulan y se aplica el mayorista.

## Verlo sin configurar nada

```bash
npm install
npm run demo
```

Abre http://localhost:5173 con las migraciones y funciones reales sobre un Postgres en memoria. El panel está en `/panel`, con las cuentas `dueno@demo.local`, `asesor@demo.local`, `asesor2@demo.local`, `bodega@demo.local`, `coordinadora@demo.local` y `gerencia@demo.local`, todas con contraseña `demo`. El inicio de sesión es simulado y se salta el MFA, y los datos se borran al cerrar.

## Cómo ejecutarlo

Requisitos: Node 24 y un proyecto de Supabase dedicado a este prototipo, con el registro público desactivado y TOTP habilitado.

```bash
npm install
cp .env.example .env.local        # valores públicos del frontend
npx supabase login
npx supabase link --project-ref <ref>
npx supabase db push
npx supabase secrets set IP_HASH_SALT=<cadena-larga> ALLOWED_ORIGINS=http://localhost:5173
npx supabase functions deploy crear-solicitud
npx supabase functions deploy consultar-seguimiento
npx supabase functions deploy simular-pago
npm run dev
```

Crear personal interno (la contraseña se muestra una sola vez y el MFA se configura en el primer ingreso):

```bash
node scripts/crear-usuario.mjs correo@ejemplo.com asesor "Nombre visible"
```

Roles: `dueno`, `asesor`, `bodega`, `coordinadora`, `gerencia`.

Para regenerar los datos del caso que ve el dueño: `node scripts/generar-datos-caso.mjs <carpeta-csv>`. `clientes.csv` e `interacciones.csv` no se importan y se elimina `cliente_id`.

Despliegue desde Windows (evita el error `EPERM ... symlink` de la CLI de Vercel, porque compila aquí y sube el resultado):

```bash
npx vercel login
npm run vercel:preparar
npx vercel deploy --prebuilt --prod --yes
npx supabase secrets set ALLOWED_ORIGINS=http://localhost:5173,https://<tu-sitio>.vercel.app
```

Las variables `VITE_*` se toman de `.env.local` al compilar.

## Pruebas

| Comando | Qué ejercita |
|---|---|
| `npm test` | Migraciones reales sobre Postgres embebido (PGlite), con roles y `auth` simulados; código real de los manejadores; componentes React |
| `npm run test:e2e` | Proyecto real: REST, Auth con TOTP y Edge Functions desplegadas. Requiere `~/.carsystem/.env.test.local` |

El proyecto vive en OneDrive. Para que no se sincronice, la clave secreta está en `~/.carsystem/.env.test.local`.

## Control, evidencia y estado

Estado a 2026-11-08. **Local** significa probado en Postgres embebido, con 141 de 141 pruebas aprobadas. **Real** significa probado contra el proyecto de Supabase con Auth, TOTP y Edge Functions desplegadas: 34 aprobadas, 0 fallidas y 1 omitida, la de cabeceras, que requiere el sitio en Vercel.

| Control | Evidencia | Local | Real |
|---|---|---|---|
| 1. Anónimo no lee solicitudes, costos ni stock exacto | `seguridad.test.ts` §1 (20 casos); e2e §1 (13) | Aprobado | Aprobado |
| 2. No se ve un registro ajeno cambiando el ID | §2 (3); e2e §2 | Aprobado | Aprobado |
| 3. Alterar el precio no cambia el total | §3 (3); e2e §3 | Aprobado | Aprobado |
| 4. Un asesor no aprueba descuentos | §4 (6); e2e §4 | Aprobado | Aprobado |
| 5. Bodega no ve teléfonos; enmascarado por rol | §5 (4); e2e §5 | Aprobado | Aprobado |
| 6. Auditoría sin edición ni borrado | §6 (18); e2e §6 (3) | Aprobado | Aprobado |
| 7. Payload XSS se muestra como texto | §7 (1) y `seguridad-ui.test.tsx` (7); e2e §7 | Aprobado | Aprobado |
| 8. Seguimiento se bloquea tras 5 intentos | §8 (4); e2e §8 | Aprobado | Aprobado |
| 9. Sin autorización de datos no se envía | §9 (6) y formulario (3); e2e §9 | Aprobado | Aprobado |
| Un usuario no cambia su propio rol | Controles adicionales; e2e §5 | Aprobado | Aprobado |
| Tiempos sellados por la base; perdida exige motivo | Controles adicionales | Aprobado | No repetido |
| Stock solo por movimientos append-only | Controles adicionales | Aprobado | No repetido |
| Campo trampa | Controles adicionales; e2e Plataforma | Aprobado | Aprobado |
| Límite de peticiones con IP en hash | Controles adicionales; e2e Plataforma | Aprobado | Aprobado |
| Evasión del límite falsificando `X-Forwarded-For` | e2e Plataforma | No aplica | Aprobado |
| MFA obligatorio | Enrolamiento y verificación TOTP por API; sesión `aal1` rechazada | Parcial | Aprobado |
| Un cliente registrado no obtiene acceso interno | `tienda.test.ts`; e2e Tienda | Aprobado | Aprobado |
| Mayorista y 5 % calculados por el servidor; no falsificables | `tienda.test.ts`; e2e Tienda | Aprobado | Aprobado |
| Un cliente no ve pedidos de otro | `tienda.test.ts`; e2e Tienda | Aprobado | Aprobado |
| Pago simulado: cambia una sola vez, sin datos bancarios | `tienda.test.ts`; e2e Tienda | Aprobado | Aprobado |
| Solo el dueño edita productos y ve datos del caso | `tienda.test.ts`; e2e Tienda | Aprobado | Aprobado |
| Teléfono para WhatsApp solo a asesor asignado y dueño, con registro en auditoría | `whatsapp.test.ts`; e2e WhatsApp | Aprobado | Aprobado |
| Excel generado con la CSP real activa | Navegador: archivo .xlsx válido, sin violaciones | Aprobado | Pendiente en Vercel |
| RLS en todas las tablas | Activado en las 16 tablas de `public` | Aprobado | Aprobado |
| CSP y demás cabeceras | `vercel.json` validado; app cargada en Chrome con esas cabeceras, sin violaciones | Parcial | Pendiente en Vercel |
| `service_role` fuera del frontend | Búsqueda en `src` y en el bundle compilado | Aprobado | No aplica |

### Límites conocidos

- Los triggers de la auditoría bloquean a todos los roles de la aplicación y al dueño de la tabla en operación normal, pero quien administre la base podría desactivarlos deliberadamente.
- Las pantallas del panel se recorrieron en navegador con la demo local, donde el inicio de sesión es simulado. Falta recorrerlas con Supabase Auth y TOTP reales.
- El asesor de seguridad de Supabase reporta 1 error por la vista `catalogo_publico` y 15 avisos por funciones `SECURITY DEFINER`. Son decisiones de diseño: la vista expone solo columnas seguras y cada función exige rol con MFA, ambas cosas probadas.
- WhatsApp funciona con enlaces: el mensaje se abre listo y una persona lo envía. El envío automático requiere la API oficial de WhatsApp Business. Al usar "Confirmar disponibilidad y enviar precio" el estado cambia con el clic, aunque luego no se presione enviar en WhatsApp.
- El registro de clientes no exige confirmar el correo, para que funcione en la demostración. Con correos inventados alguien podría repetir el 5 %; en operación real debe activarse la confirmación.
- Las "vistas" del panel son el alcance de las campañas de julio a septiembre. La tienda no mide todavía las visitas a sus propias páginas.
- El aviso de privacidad tiene campos `[completar]`: NIT, domicilio y canal de atención.
- Con menos de un trimestre de datos, la comparación contra la línea base en el panel de gerencia es solo ilustrativa, y hoy incluye solicitudes de demostración.
