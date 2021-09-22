import {
    getLocalizedString,
    OwaTimeformatLocalizedStringResourceId,
} from '../../localization/getLocalizedString';

import type DayOfWeekIndexType from 'owa-service/lib/contract/DayOfWeekIndexType';

export default function getLocalizedDayOfWeekIndex(dayOfWeekIndex: DayOfWeekIndexType): string {
    return getLocalizedString(
        ('calendarDayOfWeekIndex_' + dayOfWeekIndex) as OwaTimeformatLocalizedStringResourceId
    );
}
