import carInfo from './carInfo.json';

const entries = Object.entries(carInfo)
  .map(([technical, info]) => ({
    technical,
    displayName: info.displayName,
    class: info.class,
    length: technical.length,
  }))
  .sort((a, b) => b.length - a.length);

export function resolveCarInfo(vehicleClass) {
  if (!vehicleClass) return null;
  for (const entry of entries) {
    if (vehicleClass.includes(entry.technical)) {
      return entry;
    }
  }
  return { technical: vehicleClass, displayName: vehicleClass, class: '' };
}
