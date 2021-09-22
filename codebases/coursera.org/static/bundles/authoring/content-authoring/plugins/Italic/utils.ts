import { MARKS } from '../../constants';
import { SlateValue, SlateChange } from '../../types';

export const hasMark = (value: SlateValue): boolean => value.marks.some((mark) => mark.type === MARKS.ITALIC);

export const italicMarkStrategy = (change: SlateChange): SlateChange => change.toggleMark(MARKS.ITALIC).focus();

export default { hasMark, italicMarkStrategy };
