import carInfo from './carInfo.json';

let preloaded = false;

function getUniqueValues(key) {
  const values = Object.values(carInfo)
    .map((info) => info?.[key])
    .filter(Boolean);
  return Array.from(new Set(values));
}

export function preloadBrandAndClassIcons() {
  if (preloaded) return [];
  if (typeof Image === 'undefined') return [];

  preloaded = true;

  const brandSources = getUniqueValues('brand').map((brand) => `/assets/brands/${brand}.png`);
  const classSources = getUniqueValues('class').map((carClass) => `/assets/classes/${carClass}.png`);
  const sources = [...brandSources, ...classSources];

  sources.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  return sources;
}
