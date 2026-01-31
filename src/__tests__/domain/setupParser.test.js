import fs from 'fs';
import path from 'path';
import { parseSetup } from '../../domain/setupParser';

const fixturesDir = path.resolve(__dirname, '../../test-assets/svm');

function readFixture(name) {
  return fs.readFileSync(path.join(fixturesDir, name), 'utf-8');
}

describe('parseSetup', () => {
  it('returns null for non-string input', () => {
    expect(parseSetup(null)).toBeNull();
    expect(parseSetup(undefined)).toBeNull();
    expect(parseSetup(123)).toBeNull();
  });

  it('extracts VehicleClassSetting into metadata', () => {
    const raw = readFixture('hy_setup_sample.svm');
    const parsed = parseSetup(raw);
    
    expect(parsed).toBeTruthy();
    expect(parsed.metadata.vehicleClass).toBe('AstonMartin_Valkyrie Hypercar WEC2025');
  });
  
  it('parses entries and comments', () => {
    const raw = readFixture('hy_setup_sample.svm');
    const parsed = parseSetup(raw);
    const header = parsed.sections.find((section) => section.name === 'HEADER');
    expect(header).toBeTruthy();
    
    const noteLine = header.lines.find((line) =>
      line.includes('Note: settings commented out if using the default')
    );
    expect(noteLine).toBeTruthy();

    // Parse entries from various sections.
    const generalSection = parsed.sections.find((section) => section.name === 'GENERAL');
    const fuelCapacity = generalSection.entries.find((entry) => entry.key === 'FuelCapacitySetting');
    expect(fuelCapacity).toBeTruthy();
    expect(fuelCapacity.value).toBe('0');
    expect(fuelCapacity.comment).toBe('16.0L (4.5 laps)');

    const virtualEnergySetting = generalSection.entries.find((entry) => entry.key === 'VirtualEnergySetting');
    expect(virtualEnergySetting).toBeTruthy();
    expect(virtualEnergySetting.value).toBe('100');
    expect(virtualEnergySetting.comment).toBe('100% (28.7 laps)');

    const engineSection = parsed.sections.find((section) => section.name === 'ENGINE');
    const engineMixtureSetting = engineSection.entries.find((entry) => entry.key === 'EngineMixtureSetting');
    expect(engineMixtureSetting).toBeTruthy();
    expect(engineMixtureSetting.value).toBe('1');
    expect(engineMixtureSetting.comment).toBe('Race');

    const frontRightSection = parsed.sections.find((section) => section.name === 'FRONTRIGHT');
    const slowBumpSetting = frontRightSection.entries.find((entry) => entry.key === 'SlowBumpSetting');
    expect(slowBumpSetting).toBeTruthy();
    expect(slowBumpSetting.value).toBe('7');
    expect(slowBumpSetting.comment).toBe('7');

    // Non-existent entries should be falsy.
    const nonExistentEntry = frontRightSection.entries.find((entry) => entry.key === 'NonExistentSetting');
    expect(nonExistentEntry).toBeFalsy();
  });
});
