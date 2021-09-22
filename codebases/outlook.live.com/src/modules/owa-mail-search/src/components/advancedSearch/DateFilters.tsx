import { observer } from 'mobx-react-lite';
import {
    advancedSearchDateLabel,
    advancedSearchToLabel,
    fromDatePickerAriaLabel,
    toDatePickerAriaLabel,
} from './DateFilters.locstring.json';
import loc, { formatToArray } from 'owa-localize';
import DateFilter from './DateFilter';
import { onFromDateChanged, onToDateChanged } from '../../actions/internalActions';
import { getStore } from '../../store/store';
import type { OwaDate } from 'owa-datetime';

import * as React from 'react';
import { Label } from '@fluentui/react/lib/Label';

import styles from './AdvancedSearch.scss';

export interface DateFiltersProps {
    useLeftLabel: boolean;
}

export default observer(function DateFilters(props: DateFiltersProps) {
    const { useLeftLabel } = props;
    const { fromDate, toDate } = getStore().advancedSearchViewState;
    const fieldContainerLabel = useLeftLabel
        ? styles.dateFiltersContainerLeft
        : styles.dateFiltersContainerAbove;
    return (
        <div className={fieldContainerLabel}>
            <Label styles={{ root: styles.formFieldLabel }} title={loc(advancedSearchDateLabel)}>
                {loc(advancedSearchDateLabel)}
            </Label>
            <div className={styles.dateFiltersInnerContainer}>
                {formatToArray(
                    '{0}{1}{2}',
                    <DateFilter
                        onSelectDate={onSelectDate(true /* isFrom */)}
                        value={fromDate}
                        ariaLabel={loc(fromDatePickerAriaLabel)}
                    />,
                    <span style={{ margin: '0px 12px' }}>{loc(advancedSearchToLabel)}</span>,
                    <DateFilter
                        onSelectDate={onSelectDate(false /* isFrom */)}
                        value={toDate}
                        ariaLabel={loc(toDatePickerAriaLabel)}
                    />
                )}
            </div>
        </div>
    );
});

function onSelectDate(isFrom: boolean) {
    return (selectedDate: OwaDate) => {
        if (isFrom) {
            onFromDateChanged(selectedDate);
        } else {
            onToDateChanged(selectedDate);
        }
    };
}
