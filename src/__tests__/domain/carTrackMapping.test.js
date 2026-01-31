import { resolveCarInfo } from '../../domain/carInfo';

describe('car/track mapping', () => {
  it('resolves car info by substring match', () => {
    const cases = [
      {
        vehicleClass: 'GT3 McLaren_720S_LMGT3_Evo WEC2025',
        technical: 'McLaren_720S_LMGT3_Evo',
        class: 'lmgt3',
        brand: 'mclaren',
        displayName: 'McLaren 720s LMGT3 Evo',
      },
      {
        vehicleClass: 'AstonMartin_Valkyrie Hypercar WEC2025',
        technical: 'AstonMartin_Valkyrie',
        class: 'hy',
        brand: 'aston',
        displayName: 'Aston Martin Valkyrie LMH',
      },
      {
        vehicleClass: 'LMP2 Oreca_07 WEC2025',
        technical: 'LMP2 Oreca_07',
        class: 'lmp2_wec',
        brand: 'lmp2',
        displayName: 'Oreca 07 (WEC)',
      },
      {
        vehicleClass: 'ELMS2025 LMP2_ELMS Oreca_07',
        technical: 'LMP2_ELMS Oreca_07',
        class: 'lmp2_elms',
        brand: 'lmp2',
        displayName: 'Oreca 07 (ELMS)',
      },
      {
        vehicleClass: 'ELMS2025 LMP3 Ligier_JS_P325',
        technical: 'ELMS2025 LMP3 Ligier_JS_P325',
        class: 'lmp3',
        brand: 'ligier',
        displayName: 'Ligier JS P325',
      },
    ];

    cases.forEach((expected) => {
      const info = resolveCarInfo(expected.vehicleClass);
      expect(info).toBeTruthy();
      expect(info.technical).toBe(expected.technical);
      expect(info.class).toBe(expected.class);
      expect(info.brand).toBe(expected.brand);
      expect(info.displayName).toBe(expected.displayName);
    });
  });
});
