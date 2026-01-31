import { applySettingLabels } from './settingLabels';

export function buildGroupedSections(parsed, sectionGroups) {
  const labeledBySection = parsed.sections.map(applySettingLabels);
  
  return sectionGroups
    .map((group) => {
      const entries = [];
      const allowedSections = group.sourceSections
        ? new Set(group.sourceSections.map((name) => name.toUpperCase()))
        : null;

      group.keys.forEach((key) => {
        labeledBySection.forEach((section) => {
          if (allowedSections && !allowedSections.has(section.name.toUpperCase())) {
            return;
          }

          section.entries.forEach((entry) => {
            if (entry.key === key) {
              entries.push(entry);
            }
          });
        });
      });

      return { name: group.name, entries, lines: [] };
    })
    .filter((section) => section.entries.length > 0);
}
