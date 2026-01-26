export const setupCategories = {
  powertrain: {
    label: 'Powertrain',
    sectionGroups: [
      {
        name: 'ENGINE',
        keys: [
          'VirtualEnergySetting',
          'FuelCapacitySetting',
          'RevLimitSetting',
          'EngineMixtureSetting',
          'WaterRadiatorSetting',
          'OilRadiatorSetting',
        ],
      },
      {
        name: 'ELECTRONICS',
        keys: [
          'TractionControlMapSetting',
          'TCPowerCutMapSetting',
          'TCSlipAngleMapSetting',
          'RegenerationMapSetting',
          'ElectricMotorMapSetting',
        ],
      },
      {
        name: 'DIFFERENTIAL',
        keys: ['DiffPowerSetting', 'DiffCoastSetting', 'DiffPreloadSetting'],
      },
      {
        name: 'GEARING',
        keys: ['RatioSetSetting'],
      },
    ],
  },
  wheelsAndBrakes: {
    label: 'Wheels & Brakes',
    sectionGroups: [
      {
        name: 'FRONT LEFT',
        sourceSections: ['FRONTLEFT'],
        keys: ['CompoundSetting', 'PressureSetting', 'CamberSetting'],
      },
      {
        name: 'FRONT RIGHT',
        sourceSections: ['FRONTRIGHT'],
        keys: ['CompoundSetting', 'PressureSetting', 'CamberSetting'],
      },
      {
        name: 'REAR LEFT',
        sourceSections: ['REARLEFT'],
        keys: ['CompoundSetting', 'PressureSetting', 'CamberSetting'],
      },
      {
        name: 'REAR RIGHT',
        sourceSections: ['REARRIGHT'],
        keys: ['CompoundSetting', 'PressureSetting', 'CamberSetting'],
      },
      {
        name: 'BRAKES',
        keys: [
          'RearBrakeSetting',
          'BrakeMigrationSetting',
          'BrakePressureSetting',
          'BrakeDuctSetting',
          'BrakeDuctRearSetting',
        ],
      },
    ],
  },
  suspension: {
    label: 'Suspension',
    sectionGroups: [
      {
        name: 'FRONT LEFT',
        sourceSections: ['FRONTLEFT'],
        keys: ['SpringSetting', 'PackerSetting', 'RideHeightSetting'],
      },
      {
        name: 'FRONT 3rd SPRING',
        sourceSections: ['SUSPENSION'],
        keys: ['Front3rdSpringSetting', 'Front3rdPackerSetting'],
      },
      {
        name: 'FRONT RIGHT',
        sourceSections: ['FRONTRIGHT'],
        keys: ['SpringSetting', 'PackerSetting', 'RideHeightSetting'],
      },
      {
        name: 'REAR LEFT',
        sourceSections: ['REARLEFT'],
        keys: ['SpringSetting', 'PackerSetting', 'RideHeightSetting'],
      },
      {
        name: 'REAR 3rd SPRING',
        sourceSections: ['SUSPENSION'],
        keys: ['Rear3rdSpringSetting', 'Rear3rdPackerSetting'],
      },
      {
        name: 'REAR RIGHT',
        sourceSections: ['REARRIGHT'],
        keys: ['SpringSetting', 'PackerSetting', 'RideHeightSetting'],
      },
    ],
  },
  dampers: {
    label: 'Dampers',
    sectionGroups: [
      {
        name: 'FRONT LEFT',
        sourceSections: ['FRONTLEFT'],
        keys: ['SlowBumpSetting', 'SlowReboundSetting', 'FastBumpSetting', 'FastReboundSetting'],
      },
      {
        name: 'FRONT 3rd SPRING',
        sourceSections: ['SUSPENSION'],
        keys: [
          'Front3rdSlowBumpSetting',
          'Front3rdSlowReboundSetting',
          'Front3rdFastBumpSetting',
          'Front3rdFastReboundSetting',
        ],
      },
      {
        name: 'FRONT RIGHT',
        sourceSections: ['FRONTRIGHT'],
        keys: ['SlowBumpSetting', 'SlowReboundSetting', 'FastBumpSetting', 'FastReboundSetting'],
      },
      {
        name: 'REAR LEFT',
        sourceSections: ['REARLEFT'],
        keys: ['SlowBumpSetting', 'SlowReboundSetting', 'FastBumpSetting', 'FastReboundSetting'],
      },
      {
        name: 'REAR 3rd SPRING',
        sourceSections: ['SUSPENSION'],
        keys: [
          'Rear3rdSlowBumpSetting',
          'Rear3rdSlowReboundSetting',
          'Rear3rdFastBumpSetting',
          'Rear3rdFastReboundSetting',
        ],
      },
      {
        name: 'REAR RIGHT',
        sourceSections: ['REARRIGHT'],
        keys: ['SlowBumpSetting', 'SlowReboundSetting', 'FastBumpSetting', 'FastReboundSetting'],
      },
    ],
  },
  chassisAndAero: {
    label: 'Chassis & Aero',
    sectionGroups: [
      {
        name: 'FRONT',
        keys: ['FrontToeInSetting', 'FrontAntiSwaySetting', 'SteerLockSetting', 'FWSetting'],
      },
      {
        name: 'REAR',
        keys: ['RearToeInSetting', 'RearAntiSwaySetting', 'RWSetting'],
      },
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
