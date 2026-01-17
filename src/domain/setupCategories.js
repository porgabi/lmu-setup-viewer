export const setupCategories = {
  powertrain: {
    label: 'Powertrain',
    sectionGroups: [
      {
        name: 'ENGINE',
        labels: [
          'Virtual Energy',
          'Fuel Ratio',
          'Rev Limiter',
          'Engine Mixture',
          'Water Radiator Cover',
          'Oil Radiator Cover',
        ],
      },
      {
        name: 'ELECTRONICS',
        labels: ['Onboard TC', 'TC Power Cut', 'TC Slip Angle', 'Regen Level', 'Electric Motor Map'],
      },
      {
        name: 'DIFFERENTIAL',
        labels: ['Power', 'Coast', 'Preload'],
      },
      {
        name: 'GEARING',
        labels: ['Ratio Set'],
      },
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
