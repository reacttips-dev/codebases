import { ArchRating, SizeRating, WidthRating } from 'types/cloudCatalog';

export const sizeMap = new Map<SizeRating, string>([
  ['Felt a full size larger than marked', 'Full size too large'],
  ['Felt a half size larger than marked', 'Half size too large'],
  ['Felt true to size', 'True to size'],
  ['Felt a half size smaller than marked', 'Half size too small'],
  ['Felt a full size smaller than marked', 'Full size too small']
]);
export const widthMap = new Map<WidthRating, string>([
  ['Felt true to width', 'Felt true to width'],
  ['Felt narrower than marked', 'Felt narrower than marked'],
  ['Felt wider than marked', 'Felt wider than marked']
]);
export const archMap = new Map<ArchRating, string>([
  ['Excellent arch support', 'Excellent arch support'],
  ['Moderate arch support', 'Moderate arch support'],
  ['No arch support', 'No arch support']
]);
