import { getLocalizedString } from '../localization/getLocalizedString';
import { format } from './localizedFormatter';
import formatUserTime from './formatUserTime';
import type { OwaDate } from '../schema';

export default function formatYesterdayAtTime(date: OwaDate): string {
    return format(getLocalizedString('yesterdayTime'), formatUserTime(date));
}
