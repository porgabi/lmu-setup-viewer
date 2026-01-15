export const setupCategories = {
  powertrain: {
    label: 'Powertrain',
    sectionNames: ['HEADER', 'GENERAL', 'CONTROLS', 'ENGINE', 'DRIVELINE'],
    entryKeywords: [
      'VehicleClass',
      'Upgrade',
      'Fuel',
      'VirtualEnergy',
      'Pitstop',
      'Steer',
      'Brake',
      'TC',
      'ABS',
      'Engine',
      'Rev',
      'Boost',
      'Regeneration',
      'Electric',
      'Mixture',
      'Braking',
      'Gear',
      'Ratio',
      'Diff',
      'Split',
    ],
  },
  wheelsAndBrakes: {
    label: 'Wheels & Brakes',
    sectionNames: ['FRONTLEFT', 'FRONTRIGHT', 'REARLEFT', 'REARRIGHT'],
    entryKeywords: ['Pressure', 'Brake', 'Compound', 'Tyre', 'Tire', 'Wheel'],
  },
  suspension: {
    label: 'Suspension',
    sectionNames: ['SUSPENSION', 'FRONTLEFT', 'FRONTRIGHT', 'REARLEFT', 'REARRIGHT'],
    entryKeywords: [
      'Camber',
      'Toe',
      'Caster',
      'RideHeight',
      'Spring',
      'Tender',
      'Packer',
      'Rubber',
      'AntiSway',
      'Track',
      'TrackBar',
      'WheelTrack',
      'ChassisAdj',
    ],
  },
  dampers: {
    label: 'Dampers',
    sectionNames: ['SUSPENSION', 'FRONTLEFT', 'FRONTRIGHT', 'REARLEFT', 'REARRIGHT'],
    entryKeywords: ['Bump', 'Rebound'],
  },
  chassisAndAero: {
    label: 'Chassis & Aero',
    sectionNames: ['LEFTFENDER', 'RIGHTFENDER', 'FRONTWING', 'REARWING', 'BODYAERO', 'BASIC', 'GENERAL'],
    entryKeywords: [
      'Wing',
      'Fender',
      'Radiator',
      'BrakeDuct',
      'Downforce',
      'Balance',
      'Ride',
      'Gearing',
      'CG',
      'Wedge',
      'Aero',
      'Body',
      'Chassis',
    ],
  },
};

export function getSetupCategory(categoryKey) {
  return (
    setupCategories[categoryKey] || {
      label: categoryKey,
      sectionNames: [],
      entryKeywords: [],
    }
  );
}
