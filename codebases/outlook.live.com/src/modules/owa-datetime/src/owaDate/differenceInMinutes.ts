import type { OwaDate } from '../schema';
import timeDiff from './timeDiff';
import { MILLISECONDS_IN_MINUTE } from 'owa-date-constants';

export default (left: OwaDate, right: OwaDate) => timeDiff(left, right, MILLISECONDS_IN_MINUTE);
