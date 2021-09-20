import { freeze } from '@trello/objects';
import type { ActionType } from '@atlassian/butler-command-parser';
import { ACTION_METADATA } from './ActionMetadata';
import { CommandElementCategory as Category } from './types';

// FontAweSome
const FAS_ICONS = freeze<Partial<Record<Category, string>>>({
  [Category.Add]: 'fas-plus',
  [Category.Archive]: 'fas-archive',
  [Category.Checklists]: 'fas-check-square',
  [Category.Confetti]: 'fas-magic',
  [Category.Content]: 'fas-comment',
  [Category.Copy]: 'fas-copy',
  [Category.Dates]: 'fas-clock',
  [Category.Fields]: 'fas-align-justify',
  [Category.Labels]: 'fas-tag',
  [Category.Members]: 'fas-user',
  [Category.Move]: 'fas-arrow-right',
  [Category.Remove]: 'fas-minus',
  [Category.Sort]: 'fas-sort-amount-down',
});

/**
 * Use Butler CDN to show icon url. We're currently bound to using Font Awesome
 * icons alongside Butler, and these CDN-backed URLs are usable for mobile too.
 * @param action Action type. Optional for TS ease; shouldn't be undefined.
 * @param raw Denotes that the raw icon should be returned. This is what gets
 * saved to the server.
 */
export const formatFasIcon = (type?: ActionType, raw: boolean = false) => {
  // Niche; gears is the default icon in Butler client; fallback for TS safety.
  const fas =
    (type &&
      ACTION_METADATA[type]?.category &&
      FAS_ICONS[ACTION_METADATA[type]!.category]) ||
    'gears';
  return raw
    ? fas
    : `https://app.butlerfortrello.com/assets/fa-5.1.1/icons/pngs/${fas}.png`;
};
