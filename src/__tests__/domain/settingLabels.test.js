import fs from 'fs';
import path from 'path';
import { parseSetup } from '../../domain/setupParser';
import labels from '../../domain/settingLabels.json';
import { applySettingLabels, getSettingLabel } from '../../domain/settingLabels';

const fixturesDir = path.resolve(__dirname, '../../test-assets/svm');

function readFixture(name) {
  return fs.readFileSync(path.join(fixturesDir, name), 'utf-8');
}

describe('settingLabels', () => {
  it('maps labels and hides removed entries', () => {
    expect(getSettingLabel('FuelCapacitySetting', 'GENERAL')).toBe('Fuel Ratio');
    expect(getSettingLabel('Note', 'HEADER')).toBeNull();
    expect(getSettingLabel('UnknownSetting', 'GENERAL')).toBe('UnknownSetting');
  });

  it('filters removed entries and lines across all sections', () => {
    const removedKeysBySection = Object.entries(labels)
      .filter(([, value]) => value === 'REMOVE')
      .reduce((accumulator, [fullKey]) => {
        const splitIndex = fullKey.indexOf('.');
        if (splitIndex === -1) return accumulator;
        
        const section = fullKey.slice(0, splitIndex);
        const key = fullKey.slice(splitIndex + 1);
        
        if (!accumulator[section]) accumulator[section] = [];
        
        accumulator[section].push(key);
        return accumulator;
      }, {});

    Object.entries(removedKeysBySection).forEach(([sectionName, removedKeys]) => {
      const section = {
        name: sectionName,
        entries: removedKeys.map((key) => ({ key, value: 'remove-me', comment: '', raw: '' })),
        lines: [...removedKeys.map((key) => `//${key}=0`), 'Freeform line'],
      };

      const labeled = applySettingLabels(section);
      const keys = labeled.entries.map((entry) => entry.key);

      removedKeys.forEach((key) => {
        expect(keys).not.toContain(key);
      });
      expect(labeled.lines).toEqual(['Freeform line']);
    });
  });

  it('applies labels for every mapped setting', () => {
    const labelsBySection = Object.entries(labels)
      .filter(([, value]) => value !== 'REMOVE')
      .reduce((accumulator, [fullKey, label]) => {
        const splitIndex = fullKey.indexOf('.');
        if (splitIndex === -1) return accumulator;

        const section = fullKey.slice(0, splitIndex);
        const key = fullKey.slice(splitIndex + 1);

        if (!accumulator[section]) accumulator[section] = [];

        accumulator[section].push({ key, label });
        return accumulator;
      }, {});

    Object.entries(labelsBySection).forEach(([sectionName, entries]) => {
      const section = {
        name: sectionName,
        entries: entries.map(({ key }) => ({ key, value: '0', comment: '', raw: '' })),
        lines: [],
      };

      const labeled = applySettingLabels(section);
      const labelsByKey = new Map(labeled.entries.map((entry) => [entry.key, entry.label]));

      entries.forEach(({ key, label }) => {
        expect(labelsByKey.get(key)).toBe(label);
      });
    });
  });

  it('removes header-only fields from real fixture data', () => {
    const raw = readFixture('lmgt3_setup_sample.svm');
    const parsed = parseSetup(raw);
    const header = parsed.sections.find((section) => section.name === 'HEADER');

    const labeled = applySettingLabels(header);
    const keys = labeled.entries.map((entry) => entry.key);

    expect(keys).toContain('VehicleClassSetting');
    expect(keys).not.toContain('Note');
    
    const vehicleEntry = labeled.entries.find((entry) => entry.key === 'VehicleClassSetting');
    expect(vehicleEntry.label).toBe('Car Name');
  });
});
