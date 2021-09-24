import {ASH} from '../../shared/style/colors';

export const border = (borderRadius, boxShadow) => {
  return {borderRadius, boxShadow, border: `1px solid ${ASH}`};
};

export const flexBox = (justifyContent, flexDirection = 'row', alignItems) => {
  return {display: 'flex', justifyContent, flexDirection, alignItems};
};

export const INITIAL = 'initial';
export const COLUMN = 'column';
export const ROW = 'row';
export const CENTER = 'center';
export const SPACE_BTWN = 'space-between';
export const FLEX_START = 'flex-start';
