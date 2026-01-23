import carNames from './carNames.json';

const entries = Object.entries(carNames)
  .map(([technical, readable]) => ({
    technical,
    readable,
    length: technical.length,
  }))
  .sort((a, b) => b.length - a.length);

export function resolveCarName(vehicleClass) {
  if (!vehicleClass) return '';
  for (const entry of entries) {
    if (vehicleClass.includes(entry.technical)) {
      return entry.readable;
    }
  }
  return vehicleClass;
}
