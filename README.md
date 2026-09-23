# Traductor de endosos

Servicio Node.js + TypeScript + Hapi para transformar solicitudes planas de endosos al contrato estructurado requerido por el core.

## Objetivo

La traducción se basa en plantillas almacenadas en PostgreSQL. La configuración define los campos dinámicos, su orden, su origen, valores por defecto y la secuencia de eventos aplicados. Agregar un producto o tipo de endoso debe resolverse mediante datos de configuración y no mediante condicionales específicos en código.

## Arquitectura

Se aplica una arquitectura hexagonal pragmática:

```text
HTTP / Hapi
    |
Controller
    |
Application Service
    |
Repository Port
    |
TypeORM Adapter
    |
PostgreSQL
```

El dominio y el caso de uso no dependen de Hapi ni de TypeORM.

## Endpoints

- `POST /endorse/translate`: ruta solicitada por el reto.
- `POST /api/v1/endorsements/translate`: contrato versionado.
- `GET /health`: verificación básica de disponibilidad.

## Ejecución local

El servicio está preparado para ejecutarse dentro del `docker-compose.yml` del repositorio `technical-challenge-infrastructure`, junto con PostgreSQL, el servicio de rutas y el frontend.

Para ejecutarlo de forma independiente:

```bash
cp .env.example .env
npm install
npm run dev
```

## Calidad

```bash
npm run lint
npm run test
npm run test:coverage
npm run build
npm run quality
```

## Diseño de datos

- `endorsement_templates`: versión activa por producto y tipo de endoso.
- `endorsement_template_fields`: etiquetas, origen, valor por defecto, obligatoriedad y orden.
- `endorsement_template_events`: eventos y orden de aplicación.

Los scripts de creación y datos de ejemplo se encuentran en `docker/postgres/init`.
