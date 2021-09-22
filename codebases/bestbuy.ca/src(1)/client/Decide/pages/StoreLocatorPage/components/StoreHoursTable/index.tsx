import * as React from "react";
import {FormattedMessage} from "react-intl";
import {StyledTable} from "@bbyca/bbyca-components";

import {classname} from "utils/classname";

import {StoreHoursConfig} from "../../../StoreLocatorPage/models";
import {WeekStoreHoursMap} from "../../models";
import {hasValidStoreHours} from "../../utils/calculateCurbsideHours";
import formatHoursForUI from "../../utils/formatHoursForUI";
import * as styles from "./styles.css";
import messages from "./translations/messages";

export const isStoreClosed = (storeHours: StoreHoursConfig) => {
    return !storeHours || !hasValidStoreHours(storeHours);
};

interface StoreHourCellProps {
    storeHours: StoreHoursConfig;
}

export const StoreHourCell: React.FC<StoreHourCellProps> = ({storeHours}) => {
    const timeStr = formatHoursForUI(storeHours);

    return <td>{isStoreClosed(storeHours) ? <FormattedMessage {...messages.closed} /> : timeStr}</td>;
};

export interface StoreHoursTableProps {
    hours: WeekStoreHoursMap;
    className?: string;
    header: string | React.ReactNode;
}

const NUMBER_OF_DAYS_IN_A_WEEK = 7;

// TODO: This should be refactored with UB-60680
const StoreHoursTable: React.FC<StoreHoursTableProps> = ({className, hours, header}): React.ReactElement => {
    const todayIndex = new Date().getDay();
    const tomorrowIndex = (todayIndex + 1) % NUMBER_OF_DAYS_IN_A_WEEK;

    const hoursForToday = hours[todayIndex];
    const hoursForTomorrow = hours[tomorrowIndex];

    return (
        <div data-automation="store-hours-table" className={classname([styles.storeHoursTable, className])}>
            <StyledTable stripesStyle="odd">
                <thead>
                    <tr>
                        <th className={classname([styles.tableHeader])} colSpan={2}>
                            {header}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <FormattedMessage {...messages.today} />
                        </td>
                        <StoreHourCell storeHours={hoursForToday} />
                    </tr>
                    <tr>
                        <td>
                            <FormattedMessage {...messages.tomorrow} />
                        </td>
                        <StoreHourCell storeHours={hoursForTomorrow} />
                    </tr>
                </tbody>
            </StyledTable>
        </div>
    );
};

export default StoreHoursTable;
