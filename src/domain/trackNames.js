import trackNames from './trackNames.json';

export function getTrackLabel(track) {
  return trackNames[track] || track;
}
