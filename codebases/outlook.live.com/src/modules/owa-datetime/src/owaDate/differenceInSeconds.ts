import { MILLISECONDS_IN_SECOND } from 'owa-date-constants';
import type { OwaDate } from '../schema';
import timeDiff from './timeDiff';

export default (left: OwaDate, right: OwaDate) => timeDiff(left, right, MILLISECONDS_IN_SECOND);
