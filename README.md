# CasosSensibles

Prototipo frontend para la gestión interna de casos sensibles de atención al cliente.

El objetivo del proyecto es validar una futura aplicación empresarial que pueda sustituir progresivamente un proceso actual basado en Excel compartido. La aplicación permite registrar, consultar, filtrar, editar y archivar casos, además de visualizar métricas operativas en un dashboard.

Esta versión corresponde a una Fase 0 / UX Prototype. Funciona completamente en el navegador, con datos simulados y persistencia local. No incluye backend, base de datos real ni autenticación real.

---

## Objetivo del proyecto

Actualmente los casos se gestionan en una hoja de cálculo compartida. Este modelo permite trabajar rápido, pero introduce riesgos operativos:

- edición accidental de datos
- eliminación accidental de información
- baja trazabilidad
- valores inconsistentes
- dificultad para escalar el proceso
- poca gobernanza sobre datos de negocio

Este prototipo busca validar si una aplicación interna puede mejorar ese flujo mediante:

- registros estructurados
- formularios con validación
- campos controlados mediante desplegables
- roles diferenciados
- archivado seguro mediante soft delete
- dashboard operativo
- diseño visual tipo backoffice corporativo

---

## Estado actual

Fase actual: Phase 0 - Frontend UX Prototype

La finalidad de esta fase no es construir todavía el sistema definitivo, sino validar:

- estructura de datos
- pantallas principales
- experiencia de uso
- filtros y búsqueda
- formularios
- gestión de catálogos
- dashboard
- estilo visual
- flujo operativo diario

---

## Stack tecnológico

| Librería | Versión | Rol |
|---|---:|---|
| React | 18.3 | UI framework |
| TypeScript | 5.6 | Tipado estático |
| Vite | 5.4 | Dev server y build |
| React Router DOM | 6.27 | Enrutamiento |
| Zustand | 4.5 | Estado global |
| React Hook Form | 7.53 | Gestión de formularios |
| Zod | 3.23 | Validación |
| Recharts | 2.13 | Gráficos del dashboard |
| TanStack Table | 8.20 | Tabla de casos |
| Tailwind CSS | 3.4 | Estilos |
| date-fns | 3.6 | Utilidades de fecha |

---

## Requisitos previos

- Node.js >= 18
- npm >= 9

---

## Instalación y arranque

Instalar dependencias:

npm install

Arrancar el servidor de desarrollo:

npm run dev

La aplicación estará disponible en:

http://localhost:5173

En el primer arranque se generan automáticamente aproximadamente 150 casos de ejemplo en localStorage.

---

## Scripts disponibles

| Script | Descripción |
|---|---|
| npm run dev | Arranca el servidor de desarrollo |
| npm run build | Compila TypeScript y genera el build de producción |
| npm run preview | Previsualiza el build local |
| npm run typecheck | Verifica tipos sin emitir archivos |

---

## Alcance de la Fase 0

Incluido en esta versión:

- aplicación frontend
- datos mock
- persistencia local con localStorage
- listado de casos
- búsqueda, filtros y ordenación
- vista de detalle de caso
- formulario de creación
- formulario de edición
- archivado mediante soft delete
- restauración de casos archivados
- vista de casos archivados
- dashboard operativo
- gestión mock de catálogos
- simulación de roles editor y admin
- validación frontend
- estilo visual de herramienta interna empresarial

No incluido en esta versión:

- backend real
- base de datos real
- autenticación real
- SSO corporativo
- importación/exportación real
- audit log real de backend
- notificaciones
- adjuntos
- módulo de comentarios
- integraciones externas
- despliegue productivo

---

## Funcionalidades principales

- Gestión de casos: crear, editar, consultar y archivar casos.
- Soft delete: los casos se archivan, no se eliminan físicamente.
- Restauración: los admins pueden restaurar casos archivados.
- Filtros avanzados: búsqueda por texto y filtros por canal, mercado, estado, responsable, categoría y rango de fechas.
- Vista de detalle: panel estructurado con la información completa del caso.
- Gestos de compensación: registro de descuento porcentual, importe fijo o gift card.
- Dashboard: KPIs y gráficos operativos.
- Catálogos editables: simulación de gestión de valores para desplegables.
- Roles simulados: permisos diferenciados entre editor y admin.
- Persistencia local: datos almacenados en el navegador mediante localStorage.

---

## Estructura de datos

La estructura inicial está basada en los campos del Excel actual.

Campos principales del caso:

- CHANNEL
- CASE
- FIRST CONTACT
- MARKET
- RESP
- BU
- STATUS
- COMMENT
- GESTURE
- WH / STORE / COURIER
- SKU
- CATEGORY
- DESCRIPTION

---

## Campos controlados

Los siguientes campos se gestionan mediante desplegables:

- CHANNEL
- MARKET
- RESP
- CATEGORY
- STATUS

Valores iniciales de CHANNEL:

- CALL
- CHAT
- EMAIL
- H.REC
- SM
- WHATS

Valores iniciales de STATUS:

- UR
- CLOSED
- CUFC

MARKET utiliza códigos de país o mercado de dos letras, por ejemplo:

- ES
- PT
- DE
- NL
- US

Los valores de los catálogos pueden gestionarse desde la sección de administración mock.

---

## Roles de usuario

La aplicación simula dos roles.

| Permiso | Editor | Admin |
|---|:---:|:---:|
| Ver casos | Sí | Sí |
| Buscar y filtrar casos | Sí | Sí |
| Crear casos | Sí | Sí |
| Editar casos | Sí | Sí |
| Archivar casos | No | Sí |
| Restaurar casos archivados | No | Sí |
| Gestionar catálogos | No | Sí |
| Ver vista de archivados | No | Sí |

La autenticación no es real en Fase 0. El cambio de rol se simula desde la interfaz.

---

## Modelo de datos principal

Entidad Case:

- id
- caseNumber
- channel
- firstContact
- market
- resp
- bu
- status
- comment
- gesture
- whStoreCourier
- sku
- category
- description
- createdAt
- createdBy
- updatedAt
- updatedBy
- deletedAt
- deletedBy

Entidad Gesture:

- kind: percentage, fixed o giftcard
- value: número del descuento o importe
- currency: EUR

Tipos de gesto soportados:

- descuento porcentual
- importe fijo
- gift card

---

## Dashboard

El dashboard muestra métricas operativas calculadas sobre los casos activos, es decir, casos no archivados.

Incluye:

- total de casos activos
- casos por estado
- casos por canal
- casos por mercado
- casos por responsable
- casos por categoría
- evolución por periodo
- número de casos archivados
- métricas de gestos de compensación

Métricas de GESTURE:

- casos con gesto aplicado
- casos por tipo de gesto
- descuento porcentual medio
- total de importes fijos o gift cards cuando la moneda es consistente

El dashboard no pretende ser una solución BI completa. Su objetivo es validar qué métricas son útiles para el equipo.

---

## Persistencia local

Todos los datos se almacenan en el navegador mediante localStorage.

Esto significa que:

- no hay servidor
- no hay base de datos externa
- los datos son locales al navegador
- los datos pueden conservarse entre sesiones
- los datos pueden eliminarse limpiando el almacenamiento del navegador

Para limpiar los datos manualmente:

DevTools > Application > Storage > Local Storage

---

## Estructura del proyecto

src/
- main.tsx: punto de entrada y seed inicial
- routes.tsx: configuración de rutas
- types/index.ts: tipos y modelos de datos
- schemas/case.schema.ts: esquemas Zod para validación
- store/auth.store.ts: estado de usuario y rol
- store/cases.store.ts: CRUD de casos con soft delete
- store/catalogs.store.ts: valores de catálogos
- lib/id.ts: generación de IDs
- lib/format.ts: formateo de fechas y valores
- lib/storage.ts: claves de localStorage
- lib/seed.ts: generación de datos de ejemplo
- lib/cn.ts: helper de classnames
- components/ui/: componentes reutilizables
- components/layout/: AppShell, TopNav, RequireAdmin
- components/cases/: componentes específicos de casos
- components/dashboard/: KPIs y gráficos
- pages/CasesPage.tsx: listado con filtros y panel de detalle
- pages/CaseCreatePage.tsx: formulario de nuevo caso
- pages/CaseEditPage.tsx: formulario de edición
- pages/DeletedCasesPage.tsx: casos archivados
- pages/AdminCatalogsPage.tsx: gestión de catálogos
- pages/DashboardPage.tsx: analítica y KPIs

---

## Diseño visual

La interfaz sigue una dirección visual de herramienta interna empresarial:

- sobria
- minimalista
- centrada en datos
- table-centric
- poco decorativa
- paleta neutra
- separadores finos
- tipografía contenida
- uso limitado del color
- diseño orientado a operación diaria

El objetivo visual es acercarse a un backoffice corporativo refinado, no a un dashboard SaaS colorido ni a una demo de producto.

---

## Limitaciones actuales

Esta versión todavía no debe considerarse un sistema productivo.

Limitaciones principales:

- no hay backend
- no hay base de datos real
- no hay autenticación real
- no hay permisos reales de servidor
- no hay auditoría persistida en backend
- no hay importación/exportación real
- los datos se almacenan solo en el navegador

---

## Futuras fases

Posibles evoluciones:

- backend real
- base de datos PostgreSQL
- autenticación real
- autorización por roles
- audit log real
- importación desde Excel/CSV
- exportación CSV/Excel
- despliegue en infraestructura interna
- preparación para SSO corporativo
- reporting avanzado
- integraciones futuras

---

## Nota importante
