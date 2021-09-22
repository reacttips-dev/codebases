import {
    getLocalizedString,
    OwaTimeformatLocalizedStringResourceId,
} from '../../localization/getLocalizedString';

import type MonthNamesType from '../../store/schema/MonthNamesType';

export default function getLocalizedMonth(month: MonthNamesType): string {
    return getLocalizedString(('calendarMonth_' + month) as OwaTimeformatLocalizedStringResourceId);
}
