// Nota Task 2: el contenido ES/EN vive como JSON plano en
// src/content/landing.{es,en}.json y se carga con loaders tipados
// (utils/i18n.ts, Task 3). Este fichero solo existe porque Astro v6+
// exige src/content.config.ts cuando hay un src/content/config.*
// (ver LegacyContentConfigError); de momento no hay collections.
export const collections = {};
