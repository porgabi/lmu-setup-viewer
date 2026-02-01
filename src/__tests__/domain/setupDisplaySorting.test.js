import { defaultClassOrder, sortSetupsByClassAndBrand } from '../../domain/setupDisplay';

describe('sortSetupsByClassAndBrand', () => {
  it('orders by class, then brand, then setup name', () => {
    const setups = [
      { name: 'Porsche_911_GT3_R_LMGT3', carInfo: { class: 'lmgt3', brand: 'porsche' } },
      { name: 'Toyota_GR010', carInfo: { class: 'hy', brand: 'toyota' } },
      { name: 'BMW_M4_LMGT3', carInfo: { class: 'lmgt3', brand: 'bmw' } },
      { name: 'Corvette_Z06_LMGT3R', carInfo: { class: 'lmgt3', brand: 'corvette' } },
      { name: 'Ligier_JS_P325', carInfo: { class: 'lmp3', brand: 'ligier' } },
    ];

    const sorted = sortSetupsByClassAndBrand([...setups], defaultClassOrder);

    expect(sorted.map((entry) => entry.name)).toEqual([
      'Toyota_GR010',
      'BMW_M4_LMGT3',
      'Corvette_Z06_LMGT3R',
      'Porsche_911_GT3_R_LMGT3',
      'Ligier_JS_P325',
    ]);
  });
});
