import { getStaticFiles } from '@remotion/studio';
import { staticFile } from 'remotion';

let cache: Set<string> | null = null;

const normalize = (p: string) => p.replace(/^\/+/, '');

/** Vrai si le fichier existe dans /public (Studio et rendu). */
export const assetExists = (path: string): boolean => {
  if (!cache) {
    cache = new Set(getStaticFiles().map((f) => normalize(f.name)));
  }
  return cache.has(normalize(path));
};

export const asset = (path: string) => staticFile(normalize(path));
