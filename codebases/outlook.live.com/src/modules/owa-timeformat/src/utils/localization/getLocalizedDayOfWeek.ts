import {
    getLocalizedString,
    OwaTimeformatLocalizedStringResourceId,
} from '../../localization/getLocalizedString';
import type DayOfWeekType from '../../store/schema/DayOfWeekType';

export default function getLocalizedDayOfWeek(dayOfWeek: DayOfWeekType): string {
    return getLocalizedString(
        ('calendarDayOfWeek_' + dayOfWeek) as OwaTimeformatLocalizedStringResourceId
    );
}
