import { SET_LAST_SELECTED_SIZE } from 'constants/reduxActions';

export function setLastSelectedSize(gender: string, dimensionId: string, sizeId: string, min: number, max: number) {
  return {
    type : SET_LAST_SELECTED_SIZE,
    gender,
    dimensionId,
    sizeId,
    min,
    max
  } as const;
}

export type LastSelectedSizeAction =
  | ReturnType<typeof setLastSelectedSize>;
