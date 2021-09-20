export { LabelColorMap } from './src/labelColorMap';
export { labelColorRotations } from './src/labelColorRotations';
export { DueDateColorMap } from './src/dueDateColorMap';
export { GraphType, DataType } from './src/tiles';
export type { Graph, Tile } from './src/tiles';
export { itemRotation } from './src/itemRotation';
export type { AdvancedDate } from './src/advanced-date';
export {
  getStringFromAdvancedDate,
  getDateFromAdvancedDate,
} from './src/advanced-date';

export interface DataPoint {
  value: number;
}

export function sortDataPointsByValue<T extends DataPoint>(
  dataPoints: readonly T[],
) {
  return [...dataPoints].sort((dp1, dp2) => dp2.value - dp1.value);
}

export function sortDataPointsByAZ<T extends { name: string }>(
  dataPoints: readonly T[],
) {
  return [...dataPoints].sort((dp1, dp2) => dp1.name.localeCompare(dp2.name));
}
