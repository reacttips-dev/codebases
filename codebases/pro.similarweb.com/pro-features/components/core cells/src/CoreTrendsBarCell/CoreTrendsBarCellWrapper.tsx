import { abbrNumberFilter, i18nFilter } from "filters/ngFilters";
import { ITrendsBarValue } from "components/TrendsBar/src/TrendsBar";
import CoreTrendsBarCell from "components/core cells/src/CoreTrendsBarCell/CoreTrendsBarCell";
import * as React from "react";
import * as moment from "moment";

const dateFormat = (date) => moment(date).format("MMM, YYYY");

export const CoreTrendsBarCellWrapper = ({ value }) => {
    if (value) {
        const data = Object.keys(value)
            .sort()
            .map((item) => ({
                value: value[item],
                tooltip: (
                    <span>
                        <strong>{`${abbrNumberFilter()(value[item])}`}</strong>
                        {` ${i18nFilter()("common.searches.in")} ${dateFormat(item)}`}
                    </span>
                ),
            })) as ITrendsBarValue[];
        return <CoreTrendsBarCell value={data} />;
    } else {
        return "N/A";
    }
};
