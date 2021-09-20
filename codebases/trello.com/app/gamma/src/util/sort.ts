/* eslint-disable @trello/disallow-filenames */
import { LabelColor, LabelModel } from 'app/gamma/src/types/models';
import { KeysWithType } from 'app/gamma/src/util/types';

export const byAttribute = <Model>(attr: keyof Model) => (a: Model, b: Model) =>
  a[attr] < b[attr] ? -1 : a[attr] > b[attr] ? 1 : 0;

export const byAttributeCaseInsensitive = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Model extends { [key: string]: any },
  Attr extends KeysWithType<Model, string | undefined>
>(
  attr: Attr,
) => (a: Model, b: Model) => {
  if (!a[attr] || !b[attr]) {
    return 0;
  }
  const aValue = a[attr].toLocaleLowerCase();
  const bValue = b[attr].toLocaleLowerCase();

  return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
};

const ColorOrder = new Map<LabelColor | null, number>([
  [LabelColor.Green, 0],
  [LabelColor.Yellow, 1],
  [LabelColor.Orange, 2],
  [LabelColor.Red, 3],
  [LabelColor.Purple, 4],
  [LabelColor.Blue, 5],
  [LabelColor.Sky, 6],
  [LabelColor.Lime, 7],
  [LabelColor.Pink, 8],
  [LabelColor.Black, 9],
  [null, 999],
]);

export const labelByColor = (
  { color: a }: LabelModel,
  { color: b }: LabelModel,
) => {
  const enumCompare = ColorOrder.get(a)! - ColorOrder.get(b)!;
  const nameCompare = (a || '').toLowerCase().localeCompare(b || '');

  return !ColorOrder.has(a) || !ColorOrder.has(b) ? nameCompare : enumCompare;
};
