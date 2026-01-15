export const setupCategories = {
  powertrain: {
    label: 'Powertrain',
    keywords: ['engine', 'gear', 'drivetrain', 'differential', 'fuel', 'turbo'],
  },
  wheelsAndBrakes: {
    label: 'Wheels & Brakes',
    keywords: ['wheel', 'tyre', 'tire', 'brake'],
  },
  suspension: {
    label: 'Suspension',
    keywords: [
      'suspension',
      'spring',
      'arb',
      'antiroll',
      'camber',
      'toe',
      'caster',
      'ride height',
      'rideheight',
    ],
  },
  dampers: {
    label: 'Dampers',
    keywords: ['damper', 'bump', 'rebound', 'slow', 'fast'],
  },
  chassisAndAero: {
    label: 'Chassis & Aero',
    keywords: ['aero', 'wing', 'splitter', 'body', 'chassis', 'rake', 'floor'],
  },
};

export function getSetupCategory(categoryKey) {
  return setupCategories[categoryKey] || { label: categoryKey, keywords: [] };
}