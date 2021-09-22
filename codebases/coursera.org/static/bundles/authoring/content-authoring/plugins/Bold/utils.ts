import { MARKS } from '../../constants';
import { SlateValue, SlateChange } from '../../types';

export const hasMark = (value: SlateValue): boolean => value.marks.some((mark) => mark.type === MARKS.BOLD);

export const boldMarkStrategy = (change: SlateChange): SlateChange => change.toggleMark(MARKS.BOLD).focus();

export default { hasMark, boldMarkStrategy };
