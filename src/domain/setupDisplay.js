import { resolveCarInfo } from './carInfo';
import { getAssetPath } from './assetPaths';

export function splitSetupKey(setupKey) {
  if (!setupKey) return { track: '', setupName: '' };

  const separatorIndex = setupKey.indexOf('/');
  if (separatorIndex === -1) {
    return { track: '', setupName: setupKey };
  }

  return {
    track: setupKey.slice(0, separatorIndex),
    setupName: setupKey.slice(separatorIndex + 1),
  };
}

export function getSetupEntry(setupIndex, track, setupName) {
  const setups = setupIndex?.[track];
  if (!Array.isArray(setups)) return null;

  const match = setups.find((setup) => {
    if (typeof setup === 'string') {
      return setup === setupName;
    }

    return setup?.name === setupName;
  });
  if (!match) return null;

  if (typeof match === 'string') {
    return { name: match, carTechnicalName: '' };
  }

  return match;
}

export function getSetupDisplayAssets(carInfo) {
  const brand = carInfo?.brand;
  const brandIconPath = brand ? getAssetPath(`assets/brands/${brand}.png`) : '';
  const classIconPath = carInfo?.class ? getAssetPath(`assets/classes/${carInfo.class}.png`) : '';
  return { brandIconPath, classIconPath };
}

export const defaultClassOrderKeys = ['hy', 'lmgt3', 'lmp2_elms', 'lmp2_wec', 'gte', 'lmp3'];

export const defaultClassOrder = new Map(
  defaultClassOrderKeys.map((value, index) => [value, index])
);

export function sortSetupsByClassAndBrand(setups, classOrder = defaultClassOrder) {
  return setups.sort((a, b) => {
    const aClass = a.carInfo?.class || '';
    const bClass = b.carInfo?.class || '';
    const aOrder = classOrder.has(aClass) ? classOrder.get(aClass) : classOrder.size + 1;
    const bOrder = classOrder.has(bClass) ? classOrder.get(bClass) : classOrder.size + 1;
    if (aOrder !== bOrder) return aOrder - bOrder;

    const aBrand = a.carInfo?.brand || '';
    const bBrand = b.carInfo?.brand || '';
    const brandCompare = aBrand.localeCompare(bBrand);
    if (brandCompare !== 0) return brandCompare;

    return a.name.localeCompare(b.name);
  });
}

export function buildSetupMenuData(
  setupIndex,
  trackInfo,
  excludeValue,
  classOrder = defaultClassOrder,
  classFilter = null
) {
  if (!setupIndex || typeof setupIndex !== 'object') {
    return [];
  }

  const filterSet = Array.isArray(classFilter) ? new Set(classFilter) : null;

  return Object.entries(setupIndex)
    .map(([track, setups]) => {
      if (!Array.isArray(setups)) return null;

      const items = setups
        .map((setup) => {
          const setupName = typeof setup === 'string' ? setup : setup?.name;
          if (!setupName) return null;

          const value = `${track}/${setupName}`;
          if (excludeValue && value === excludeValue) return null;

          const carTechnicalName = typeof setup === 'string' ? '' : setup?.carTechnicalName;
          const carInfo = resolveCarInfo(carTechnicalName);
          const { brandIconPath, classIconPath } = getSetupDisplayAssets(carInfo);
          const classKey = carInfo?.class;

          if (filterSet && !filterSet.has(classKey)) {
            return null;
          }

          return {
            name: setupName,
            carInfo,
            brandIconPath,
            classIconPath,
          };
        })
        .filter(Boolean);

      if (!items.length) return null;

      sortSetupsByClassAndBrand(items, classOrder);

      const trackEntry = trackInfo?.[track];

      return {
        track,
        trackLabel: trackEntry?.displayName || track,
        countryCode: trackEntry?.countryCode,
        items,
      };
    })
    .filter(Boolean);
}
