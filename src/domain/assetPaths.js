const publicUrl = (process.env.PUBLIC_URL || '').replace(/\/$/, '');

export function getAssetPath(relativePath) {
  if (!relativePath) return '';
  const trimmed = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  if (!publicUrl) {
    return `/${trimmed}`;
  }
  return `${publicUrl}/${trimmed}`;
}
