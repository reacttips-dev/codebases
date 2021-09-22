import { getLocalizedString } from '../localization/getLocalizedString';
import { format } from './localizedFormatter';
export default function formatDayAtTime(day: string, time: string): string {
    return format(getLocalizedString('weekdayAtTime'), day, time);
}
