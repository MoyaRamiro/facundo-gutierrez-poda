# Especificación de Diseño: Landing Page Facundo Gutiérrez - Poda en Fuengirola

**Fecha:** 2026-09-04  
**Estado:** Aprobado para implementación  
**Proyecto:** Sitio web unilingüe (ES/EN) para negocio de poda local

---

## 1. Resumen Ejecutivo

Landing page estática de una sola página (`/` en español, `/en` en inglés) para captar clientes de poda de palmeras, árboles y servicios relacionados en Fuengirola y municipios vecinos (Mijas, Benalmádena, Alhaurín). Optimizada para SEO local, conversión móvil y carga ultra-rápida.

**Objetivo principal:** Que el visitante contacte vía WhatsApp o llamada en < 15 segundos de aterrizar.

---

## 2. Arquitectura Técnica

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| Framework | **Astro 5.x** | Estático por defecto, islands para interactividad mínima, CWV óptimos |
| Estilos | **Tailwind CSS** | Utility-first, tema verde/naturaleza, bundle mínimo |
| i18n | Dos archivos JSON + Middleware Edge | Control total de URLs, schema, sitemaps; detección `Accept-Language` |
| Imágenes | **Astro Assets** | WebP/AVIF automático, responsive, lazy-load. Opcional: Cloudinary/Imgix para CDN externo si se requieren transformaciones avanzadas |
| Formularios | **Netlify Forms** | Sin backend, spam protection, webhook a WhatsApp/email |
| Hosting | **Netlify / Cloudflare Pages** | Edge middleware gratis, CDN global, deploy automático |
| Analytics | **Umami** | Privacidad-first, sin banner de cookies |
| Schema | **JSON-LD** inyectado por página | LocalBusiness, Service, FAQ, Review |

### Estructura de Rutas
```
/         → Landing page español (default para dispositivos ES)
/en       → Landing page inglés
```

### Detección de Idioma (Middleware Edge)
```typescript
// 1. URL explícita: /en → inglés, / → español
// 2. Sin prefijo: leer Accept-Language
//    - Empieza con "es" → servir español
//    - Cualquier otro → 302 redirect a /en
// 3. Cookie opcional `lang` para visitas recurrentes
```

---

## 3. Estructura de Contenido (Secciones de la Página)

| Sección | Propósito | Elementos Clave |
|---------|-----------|-----------------|
| **Hero** | Confianza inmediata + CTA | H1 geo-localizado, botones WhatsApp + Llamar full-width, badges confianza |
| **Servicios** | Claridad de oferta | 4 cards: Palmeras, Árboles, Tala/Descepe, Emergencias 24h |
| **Zona de Servicio** | Señal SEO local | Chips horizontales scrollables: Fuengirola, Mijas, Benalmádena, Alhaurín |
| **Por Qué Elegirnos** | Señales de confianza | 4 pilares: 15+ años, Seguro RC, Residuos gestionados, Respuesta <2h |
| **Galería** | Prueba visual | 6-8 antes/después, lightbox fullscreen, alt text con keywords |
| **Opiniones** | Prueba social | 3 reseñas Google curadas (estrellas, nombre, excerpt, avatar) |
| **FAQ** | Manejo objeciones + schema | 5 preguntas: precio, permisos, residuos, urgencias, frecuencia |
| **Contacto / CTA Final** | Conversión | Formulario (Nombre, Tel, Zona, Servicio, Mensaje) + WhatsApp pre-filled |

---

## 4. Componentes y Patrones UI (Mobile-First)

### Breakpoints
- **Mobile (< 640px):** Target principal — columna única, targets ≥44px, sticky CTA bar
- **Tablet (640–1024px):** 2-col grids, sidebar CTA
- **Desktop (> 1024px):** 3-4 col grids, hover states

### Componentes Principales

#### Header (Sticky)
- **Mobile:** Logo izq, botones Tel/WhatsApp der (iconos 44×44px)
- **Desktop:** Logo izq, CTA group der (Tel + WhatsApp + "Presupuesto")
- `bg-white/95 backdrop-blur-sm border-b border-green-100 z-50`

#### Hero
- **Mobile:** Altura viewport menos header. H1 `text-3xl sm:text-4xl`, subhead `text-base`. **2 botones apilados** full-width: WhatsApp (primario verde) + Llamar (outline). Badges confianza debajo.
- **Desktop:** 2 columnas — copy izq, ilustración/foto der. CTAs lado a lado.

#### Servicios (4 cards)
- **Mobile:** Stack vertical, cada card `p-4 rounded-xl bg-green-50 border-green-100`. Icono 48px, título, 1 línea beneficio, micro-CTA "Ver más →" (scroll suave a contacto).
- **Tablet+:** `sm:grid-cols-2`, **Desktop:** `lg:grid-cols-4`.

#### Zona de Servicio
- **Mobile:** Chips horizontales con `snap-x` + `scrollbar-hide`.
- **Desktop:** Grid o mapa SVG con pins.

#### Por Qué Elegirnos (4 pilares)
- **Mobile:** Cards apiladas, icono + título + 1 frase.
- **Desktop:** Grid 2×2 o 4-cols.

#### Galería (6-8 imágenes)
- **Mobile:** **Feed vertical single-column**, cada imagen full-width. Tap → lightbox fullscreen (PhotoSwipe o `<dialog>` nativo). Alt = "Poda palmera Fuengirola antes/después".
- **Desktop:** Masonry `columns-2 sm:columns-3`, hover zoom.

#### Opiniones (3)
- **Mobile:** Carrusel horizontal scroll-snap, 1 card visible.
- **Desktop:** Grid 3-cols.

#### FAQ (5 items)
- **Mobile/Nativo:** `<details>/<summary>` acordeón, uno abierto a la vez. Schema JSON-LD.
- **Desktop:** Igual o 2-cols.

#### Formulario Contacto
- **Mobile:** Columna única, inputs full-width, `inputmode="tel"` tel, `autocomplete="tel"`. Submit → mensaje WhatsApp pre-filled + Netlify Form.
- **Desktop:** 2-cols (Nombre+Tel / Zona+Servicio), Mensaje full-width.

#### Sticky CTA Bar (Solo Mobile)
- Fixed bottom: `WhatsApp` (verde fill) | `Llamar` (outline). `safe-area-inset-bottom`.
- Oculto en desktop (`hidden lg:block` en sidebar version).

#### Footer
- **Mobile:** Stack: NAP, links legal/privacidad, redes, schema.
- **Desktop:** Grid 3-4 columnas.

---

## 5. Accesibilidad y Touch (Checklist Obligatorio)

- [ ] Targets táctiles ≥ 44×44px (botones, links, inputs)
- [ ] `font-size: 16px` mínimo en inputs (evita zoom iOS)
- [ ] `touch-action: manipulation` en botones
- [ ] Focus visible: `focus-visible:ring-2 focus-visible:ring-green-500`
- [ ] Contraste ≥ 4.5:1 (tema verde sobre blanco/claro)
- [ ] `loading="lazy"` en imágenes bajo hero
- [ ] `prefetch` en `/en` para switch instantáneo

---

## 6. Métricas de Rendimiento (Mobile Target)

| Métrica | Objetivo |
|---------|----------|
| LCP | < 2.0s |
| CLS | < 0.05 |
| TBT | < 100ms |
| Lighthouse Performance | ≥ 95 |
| Bundle JS (gz) | < 15KB (solo lightbox + validación form) |

---

## 7. Estructura de Datos (Content Collections)

```
src/content/
├── landing.es.json   # Todo el copy ES + structured data
├── landing.en.json   # Todo el copy EN + structured data
└── config.ts         # NAP, teléfonos, WhatsApp, colores, social
```

### Esquema `landing.*.json`
```json
{
  "hero": { "h1": "...", "subhead": "...", "ctaWhatsApp": "...", "ctaPhone": "...", "badges": ["...", "..."] },
  "services": [ { "id": "palmeras", "title": "...", "benefit": "...", "icon": "palm" }, ... ],
  "areas": [ "Fuengirola", "Mijas", "Benalmádena", "Alhaurín" ],
  "whyUs": [ { "icon": "shield", "title": "...", "desc": "..." }, ... ],
  "gallery": [ { "src": "...", "alt": "...", "caption": "...", "service": "palmeras" }, ... ],
  "reviews": [ { "author": "...", "rating": 5, "text": "...", "avatar": "..." }, ... ],
  "faq": [ { "q": "...", "a": "..." }, ... ],
  "contact": { "whatsappNumber": "346XXXXXXXX", "phoneNumber": "34952XXXXXX", "email": "..." }  // ⚠️ REEMPLAZAR con números reales antes de deploy
}
```

---

## 8. SEO Local y Schema

### JSON-LD por Página (ES y EN)
- **LocalBusiness:** Nombre, teléfono, dirección, coordenadas, horario, areaServed (4 municipios), sameAs (Google Maps, Facebook, Instagram)
- **Service:** 4 servicios con `serviceType`, `areaServed`, `description`
- **FAQPage:** 5 preguntas frecuentes
- **Review / AggregateRating:** 3 reseñas curadas + rating agregado
- **hreflang:** `<link rel="alternate" hreflang="es" href="https://dominio.com/" />` y `hreflang="en" href="https://dominio.com/en/" />`
- **Sitemap.xml:** Generado automáticamente por `@astrojs/sitemap`

### Palabras Clave Objetivo (por sección)
- Hero: "poda palmeras Fuengirola", "poda árboles Fuengirola", "jardinero Fuengirola"
- Servicios: "poda palmeras precio", "tala árboles Mijas", "emergencia árbol caído Benalmádena"
- Áreas: "poda palmeras Mijas", "jardinero Alhaurín", "poda costa del sol"

---

## 9. Conversión y Analítica

### Eventos a Trackear (Umami / data-attributes)
- `click_whatsapp_hero`, `click_phone_hero`
- `click_whatsapp_sticky`, `click_phone_sticky`
- `click_service_cta` (por servicio)
- `form_submit_success`, `form_submit_error`
- `gallery_image_open` (por imagen)
- `faq_open` (por pregunta)
- `scroll_depth_25`, `50`, `75`, `100`

### KPIs de Éxito
- **CTA Click Rate** > 8% (WhatsApp + Tel combinados)
- **Form Submit Rate** > 2% de sesiones
- **Tiempo en página** > 45s median
- **Rebote** < 55%

---

## 10. Stack de Implementación Detallado

```json
{
  "dependencies": {
    "astro": "^5.x",
    "@astrojs/sitemap": "^3.x",
    "@astrojs/tailwind": "^5.x",
    "tailwindcss": "^3.x",
    "photoswipe": "^5.x",          // lightbox galería
    "zod": "^3.x",                 // validación formulario
    "@umami/astro": "^1.x"         // analytics privacy-first
  },
  "devDependencies": {
    "@types/node": "^20.x",
    "typescript": "^5.x"
  }
}
```

### Estructura de Archivos Clave
```
src/
├── components/
│   ├── Header.astro
│   ├── Hero.astro
│   ├── Services.astro
│   ├── ServiceArea.astro
│   ├── WhyUs.astro
│   ├── Gallery.astro
│   ├── Reviews.astro
│   ├── FAQ.astro
│   ├── ContactForm.astro
│   ├── StickyCTA.astro
│   └── Footer.astro
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── index.astro          // español
│   └── en/
│       └── index.astro      // inglés
├── middleware.ts            // detección idioma + redirect
├── content/
│   ├── landing.es.json
│   ├── landing.en.json
│   └── config.ts
├── styles/
│   └── global.css
└── utils/
    ├── schema.ts            // generadores JSON-LD
    ├── whatsapp.ts          // helper links WhatsApp
    └── i18n.ts              // utilidades idioma
```

---

## 11. Próximos Pasos

1. **Ejecutar `writing-plans` skill** para generar plan de implementación detallado
2. Setup proyecto Astro + Tailwind + TypeScript
3. Implementar middleware de detección de idioma
4. Crear componentes en orden: Layout → Hero → Services → Gallery → FAQ → Form → StickyCTA
5. Integrar Netlify Forms + webhook WhatsApp
6. Configurar schema JSON-LD dinámico por idioma
7. Optimización imágenes (Astro Assets + Cloudinary)
8. Testing móvil real (iOS Safari, Android Chrome)
9. Deploy a Netlify + configuración dominio + Search Console