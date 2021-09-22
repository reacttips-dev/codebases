import React, { StatelessComponent } from "react";
import { DefaultItem } from "components/BoxSubtitle/src/BoxSubtitle";
import { availableGrowthFilters } from "../../availableGrowthFilters";
import { IGrowthFilterProps } from "./types";
import VisitsFilter, { FilterDescription } from "./VisitsFilter";

const mockFilters = [
    {
        name: "monthly_visits",
        trend: "increase",
        value: 90,
        period: "yoy",
    },
    {
        name: "referrals_visits",
        trend: "decrease",
        value: 30,
        period: "mom",
    },
    {
        name: "total_page_views",
        trend: "increase",
        value: 220,
        period: "mom",
    },
];

export function getGrowthSubtitle(filters) {
    return () =>
        getClientValueGrowth(filters).map(({ name, trend, value, period }) => (
            <DefaultItem key={name}>
                <FilterDescription
                    title={availableGrowthFilters[name].title}
                    trend={trend}
                    value={value}
                    period={period}
                    isActive={false}
                />
            </DefaultItem>
        ));
}

export const setServerValueGrowth = (filter, value) => {
    filter.setValue({
        [filter.stateName]: value.map(({ value, ...rest }) => ({
            ...rest,
            value: parseFloat((value / 100).toFixed(2)),
        })),
    });
};

export const getClientValueGrowth = (crrValue) => {
    return crrValue.map(({ value, ...rest }) => {
        return {
            value: parseFloat((value * 100).toFixed(2)),
            ...rest,
        };
    });
};

export const GrowthBoxFilter: StatelessComponent<IGrowthFilterProps> = ({
    filter,
    editFilter,
    removeFilter,
    isActive,
}) => {
    const selectedGrowthFilters = getClientValueGrowth(filter.getValue());
    const filterRows = selectedGrowthFilters.map((crr) => {
        const { [crr.name]: metric } = filter.availableMetrics;
        return {
            ...metric,
            ...crr,
        };
    });

    return (
        <div>
            {filterRows.map((row) => (
                <VisitsFilter
                    {...row}
                    isActive={isActive}
                    key={row.name}
                    onEdit={() => editFilter(row)}
                    onRemove={() => removeFilter(row)}
                />
            ))}
        </div>
    );
};
