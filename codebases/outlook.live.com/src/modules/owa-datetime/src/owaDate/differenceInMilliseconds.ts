import type { OwaDate } from '../schema';
import timeDiff from './timeDiff';

export default (left: OwaDate, right: OwaDate) => timeDiff(left, right, 1);
