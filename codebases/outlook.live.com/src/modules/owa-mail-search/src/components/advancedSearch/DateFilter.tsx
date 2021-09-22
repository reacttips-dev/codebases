import { datePlaceholder } from 'owa-locstrings/lib/strings/dateplaceholder.locstring.json';
import loc from 'owa-localize';
import { DropdownDatePicker } from 'owa-datepicker';
import type { OwaDate } from 'owa-datetime';

import * as React from 'react';

import styles from './AdvancedSearch.scss';

interface DateFilterProps {
    onSelectDate: (selectedDate: OwaDate) => void;
    value: OwaDate;
    ariaLabel: string;
}

const DateFilter = (props: DateFilterProps) => {
    const { onSelectDate, value, ariaLabel } = props;

    return (
        <DropdownDatePicker
            className={styles.dateFiltersDatePicker}
            onSelectDate={onSelectDate}
            placeholder={loc(datePlaceholder)}
            value={value}
            underlined={true}
            allowTextInput={false}
            ariaLabel={ariaLabel}
        />
    );
};

export default DateFilter;
