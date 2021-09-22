import { MARKS } from '../../constants';
import { SlateValue, SlateChange } from '../../types';

export const hasMark = (value: SlateValue): boolean => value.marks.some((mark) => mark.type === MARKS.UNDERLINE);

export const underlineMarkStrategy = (change: SlateChange): SlateChange => change.toggleMark(MARKS.UNDERLINE).focus();

export default { hasMark, underlineMarkStrategy };
