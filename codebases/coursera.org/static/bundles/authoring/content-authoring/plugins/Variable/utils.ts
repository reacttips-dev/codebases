import { MARKS } from '../../constants';
import { SlateValue, SlateChange } from '../../types';

export const hasMark = (value: SlateValue) => value.marks.some((mark) => mark.type === MARKS.VARIABLE);

export const variableMarkStrategy = (change: SlateChange) => change.toggleMark(MARKS.VARIABLE).focus();

export default { hasMark, variableMarkStrategy };
