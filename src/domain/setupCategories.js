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
    sectionGroups: [
      {
        name: 'FRONT LEFT',
        labels: ['Front Left Tyre Compound', 'Front Left Tyre Pressure', 'Front Left Camber'],
      },
      {
        name: 'FRONT RIGHT',
        labels: ['Front Right Tyre Compound', 'Front Right Tyre Pressure', 'Front Right Camber'],
      },
      {
        name: 'REAR LEFT',
        labels: ['Rear Left Tyre Compound', 'Rear Left Tyre Pressure', 'Rear Left Camber'],
      },
      {
        name: 'REAR RIGHT',
        labels: ['Rear Right Tyre Compound', 'Rear Right Tyre Pressure', 'Rear Right Camber'],
      },
      {
        name: 'BRAKES',
        labels: ['Brake Bias', 'Brake Migration', 'Max Pedal Force', 'Front Brake Ducts', 'Rear Brake Ducts'],
      },
    ],
  },
  suspension: {
    label: 'Suspension',
    sectionGroups: [
      {
        name: 'FRONT LEFT',
        labels: ['Front Left Spring Rate', 'Front Left Packers', 'Front Left Ride Height'],
      },
      {
        name: 'FRONT 3rd SPRING',
        labels: ['Front 3rd Spring Rate', 'Front 3rd Packer'],
      },
      {
        name: 'FRONT RIGHT',
        labels: ['Front Right Spring Rate', 'Front Right Packers', 'Front Right Ride Height'],
      },
      {
        name: 'REAR LEFT',
        labels: ['Rear Left Spring Rate', 'Rear Left Packers', 'Rear Left Ride Height'],
      },
      {
        name: 'REAR 3rd SPRING',
        labels: ['Rear 3rd Spring Rate', 'Rear 3rd Spring Packer'],
      },
      {
        name: 'REAR RIGHT',
        labels: ['Rear Right Spring Rate', 'Rear Right Packers', 'Rear Right Ride Height'],
      },
    ],
  },
  dampers: {
    label: 'Dampers',
    sectionGroups: [
      {
        name: 'FRONT LEFT',
        labels: [
          'Front Left Slow Bump',
          'Front Left Slow Rebound',
          'Front Left Fast Bump',
          'Front Left Fast Rebound',
        ],
      },
      {
        name: 'FRONT 3rd SPRING',
        labels: [
          'Front 3rd Spring Slow Bump',
          'Front 3rd Spring Slow Rebound',
          'Front 3rd Spring Fast Bump',
          'Front 3rd Spring Fast Rebound',
        ],
      },
      {
        name: 'FRONT RIGHT',
        labels: [
          'Front Right Slow Bump',
          'Front Right Slow Rebound',
          'Front Right Fast Bump',
          'Front Right Fast Rebound',
        ],
      },
      {
        name: 'REAR LEFT',
        labels: [
          'Rear Left Slow Bump',
          'Rear Left Slow Rebound',
          'Rear Left Fast Bump',
          'Rear Left Fast Rebound',
        ],
      },
      {
        name: 'REAR 3rd SPRING',
        labels: [
          'Rear 3rd Spring Slow Bump',
          'Rear 3rd Spring Slow Rebound',
          'Rear 3rd Spring Fast Bump',
          'Rear 3rd Spring Fast Rebound',
        ],
      },
      {
        name: 'REAR RIGHT',
        labels: [
          'Rear Right Slow Bump',
          'Rear Right Slow Rebound',
          'Rear Right Fast Bump',
          'Rear Right Fast Rebound',
        ],
      },
    ],
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
