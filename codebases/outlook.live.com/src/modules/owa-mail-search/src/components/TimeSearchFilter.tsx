import { DefaultButton } from '@fluentui/react/lib/Button';
import * as React from 'react';
import { getFilterButtonStyles } from './SearchFilterStyles';
import { observer } from 'mobx-react-lite';
import getTimeFilterDropdownValue, {
    TimeDropdownValue,
} from '../selectors/getTimeFilterDropdownValue';
import { logFilterPaneClicked } from '../utils/filterInstrumentationUtils';
import onTimeRangeSelected from '../utils/onTimeRangeSelected';
import {
    customTime,
    dateDropdownPlaceholder,
    todayDropdownOption,
    olderThanAWeek,
    olderThanAMonth,
    olderThanThreeMonths,
    olderThanAYear,
} from './TimeSearchFilter.locstring.json';
import loc from 'owa-localize';
import type { IContextualMenuItem } from '@fluentui/react/lib/ContextualMenu';

export const timeDropdownOptions: IContextualMenuItem[] = [
    {
        key: TimeDropdownValue.anyDate,
        text: loc(dateDropdownPlaceholder),
        onClick: () => onDropdownSelect(TimeDropdownValue.anyDate),
    },
    {
        key: TimeDropdownValue.today,
        text: loc(todayDropdownOption),
        onClick: () => onDropdownSelect(TimeDropdownValue.today),
    },
    {
        key: TimeDropdownValue.olderThanAWeek,
        text: loc(olderThanAWeek),
        onClick: () => onDropdownSelect(TimeDropdownValue.olderThanAWeek),
    },
    {
        key: TimeDropdownValue.olderThanAMonth,
        text: loc(olderThanAMonth),
        onClick: () => onDropdownSelect(TimeDropdownValue.olderThanAMonth),
    },
    {
        key: TimeDropdownValue.olderThanThreeMonths,
        text: loc(olderThanThreeMonths),
        onClick: () => onDropdownSelect(TimeDropdownValue.olderThanThreeMonths),
    },
    {
        key: TimeDropdownValue.olderThanAYear,
        text: loc(olderThanAYear),
        onClick: () => onDropdownSelect(TimeDropdownValue.olderThanAYear),
    },
];

export default observer(function TimeSearchFilter() {
    const dropdownValue = getTimeFilterDropdownValue();
    const buttonRef = React.useRef<HTMLDivElement>();
    let buttonDisplayText;
    if (dropdownValue === TimeDropdownValue.custom) {
        // If user has selected a time range that doesn't map to one of the dropdown ranges, show 'Custom'
        buttonDisplayText = loc(customTime);
    } else if (dropdownValue !== TimeDropdownValue.anyDate) {
        // If the user has selected a date range that maps to one of the options in the dropdown, use the dropdown option as the display text
        buttonDisplayText = timeDropdownOptions.filter(option => option.key === dropdownValue)[0]
            .text;
    } else {
        // Otherwise show 'Any Date' placeholder value
        buttonDisplayText = loc(dateDropdownPlaceholder);
    }

    return (
        <div ref={buttonRef}>
            <DefaultButton
                toggle={true}
                checked={dropdownValue !== TimeDropdownValue.anyDate}
                text={buttonDisplayText}
                onMenuClick={onMenuClick}
                styles={getFilterButtonStyles()}
                menuProps={{
                    items: timeDropdownOptions,
                }}></DefaultButton>
        </div>
    );
});

function onDropdownSelect(value: TimeDropdownValue) {
    const currentValue = getTimeFilterDropdownValue();
    if (value !== currentValue) {
        onTimeRangeSelected(value);
    }
}

function onMenuClick(ev?: React.SyntheticEvent<any>) {
    logFilterPaneClicked();
}
