import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import * as numeral from "numeral";
import * as React from "react";
import { minVisitsAbbrFilter } from "../../../../../app/filters/ngFilters";
import PointValueAndChange from "../../../../components/Chart/src/components/PointValueAndChange";
import { PrimaryBoxTitle } from "../../../../styled components/StyledBoxTitle/src/StyledBoxTitle";
import Usage from "../../../app performance/src/page/single/usage section/Usage";
import { SidebarGraphWrapper } from "./StyledComponents";

const gradientProps = {
    stop1Color: "rgba(79,141,249,0.20)",
    stop2Color: "rgba(79,141,249,0.05",
    fillColor: "#4f8df9",
};

export const SidebarGraph = ({ tab, title, tooltip, data }) => {
    const TitleComponent = () => <PrimaryBoxTitle tooltip={tooltip}>{title}</PrimaryBoxTitle>;
    const formatNumber = ({ value }) => minVisitsAbbrFilter()(value);
    const formatPercent = ({ value }) => numeral(value).format("0%");
    const formatValue = tab === "BounceRate" ? formatPercent : formatNumber;

    // TODO: Use `WebAllowedDuration`
    const isTrial = swSettings.components.Home.resources.IsTrial;
    const valueSubtitle = isTrial ? "Monthly AVG (6 Months)" : "Monthly AVG (2 Years)";

    const SidebarGraphFallback = (
        <PointValueAndChange
            value={formatValue({ value: data?.Average })}
            valueSubtitle={valueSubtitle}
        />
    );

    return (
        <SidebarGraphWrapper data-automation="sidebar-graph">
            <Usage
                title={title}
                TitleComponent={TitleComponent}
                formatValue={formatValue}
                data={data?.Total.map((item) => ({
                    key: new Date(item.Key).getTime(),
                    value: item.Value,
                    date: item.Key,
                }))}
                gradientProps={gradientProps}
                initialSelectedPoint={null}
                FallbackChildren={SidebarGraphFallback}
                xAxisTickLabelFormat="MMM YY"
            />
        </SidebarGraphWrapper>
    );
};
