import { freeze } from '@trello/objects';
import type { LabelType } from './Label';

export const LABEL_COLORS = freeze([
  'green',
  'yellow',
  'orange',
  'red',
  'purple',
  'blue',
  'sky',
  'lime',
  'pink',
  'black',
  null,
] as const);

const indexOfLabelColor = (color: string | null) =>
  LABEL_COLORS.indexOf(color as typeof LABEL_COLORS[number]);

export const sortLabels = <T extends Pick<LabelType, 'name' | 'color'>>(
  labels: T[],
): T[] =>
  labels.sort(
    (a, b) =>
      indexOfLabelColor(a.color ?? null) - indexOfLabelColor(b.color ?? null) ||
      a.name.localeCompare(b.name),
  );
