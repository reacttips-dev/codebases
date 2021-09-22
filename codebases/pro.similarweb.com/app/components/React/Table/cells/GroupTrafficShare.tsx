import * as React from "react";
import * as classNames from "classnames";
import * as _ from "lodash";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { CHART_COLORS } from "constants/ChartColors";
import { Injector } from "common/ioc/Injector";
import { percentageFilter } from "filters/ngFilters";
import { getBrightnessHEX } from "@similarweb/styles";
import { TrafficShareTooltip } from "components/tooltips/src/TrafficShareTooltip/TrafficShareTooltip";
import { colorsPalettes } from "@similarweb/styles";
import { i18nFilter } from "filters/ngFilters";

export const GroupTrafficShare: StatelessComponent<ITableCellProps> = ({
    value = {},
    tableOptions,
}) => {
    const chosenSites = Injector.get("chosenSites") as any;
    const origColors = CHART_COLORS[tableOptions?.colorSource || "compareMainColors"];
    let siteOrigins = [];
    let siteOriginsForTooltip = [];
    // copy the colors since we might remove some items from it
    let colors = origColors.slice();
    const removeColorsAt = [];

    // turn the object into an array of chosen sites
    if (!_.isArray(value)) {
        chosenSites.forEach((site, siteInfo, index) => {
            if (value && value[site]) {
                siteOrigins.push({
                    name: site,
                    value: value[site],
                    color: origColors[index],
                });
            }
        });
    } else {
        siteOrigins = value as any[];
    }
    siteOrigins.forEach((site) => {
        siteOriginsForTooltip.push({
            name: site.name,
            text: `${percentageFilter()(site.value, 1)}%`,
            color: colorsPalettes.carbon[0],
            backgroundColor: site.color,
            width: 0.23,
        });
    });

    let items = _.filter(siteOrigins, (item, index) => {
        const result = item.value ? item.value > 0.0005 : item > 0.0005;
        // remove corresponding color if needed
        if (result === false) {
            removeColorsAt.push(index);
        }
        return result;
    });

    if (removeColorsAt.length > 0) {
        _.pullAt(colors, removeColorsAt);
    }
    //
    let _newTotal = 1,
        _threshold = 0.02;
    if (items.length > 1) {
        let _firstItem = items[0].value ? items[0].value : items[0],
            _lastItem = items[items.length - 1].value
                ? items[items.length - 1].value
                : items[items.length - 1];

        if (_firstItem < _threshold) {
            _newTotal -= _threshold;
        }
        if (_lastItem < _threshold) {
            _newTotal -= _threshold;
        }
    }

    items = items.map((item, index) => {
        let value = item.value ? item.value : item;
        let siteName =
            value > 0.1 ? item.name : item.name + " " + `${percentageFilter()(value, 1)}%`;
        let displayVal = value > 0.1 ? `${percentageFilter()(value, 1)}%` : "";
        if (value > _threshold) value = _newTotal * value;
        if (value < _threshold && (index === 0 || index === items.length - 1)) {
            value = _threshold;
        }
        let cssWidth = `${value * 100}%`;

        const backgroundColor =
            item.color ||
            chosenSites.getSiteColor(item.name) ||
            colors[item.index] ||
            colors[index];
        const classnames = classNames(
            `bar-innerText`,
            `bar-${getBrightnessHEX(backgroundColor)}-background`,
        );
        return (
            <div key={index} className="bar" style={{ width: cssWidth }}>
                <div
                    className={classnames}
                    title={siteName}
                    style={{ background: backgroundColor }}
                >
                    {displayVal}
                </div>
            </div>
        );
    });

    return siteOriginsForTooltip.length > 0 ? (
        <TrafficShareTooltip
            trafficShareProps={siteOriginsForTooltip}
            title={i18nFilter()(
                "analysis.source.search.all.table.columns.shareCompare.tooltip.title",
            )}
        >
            <div className="sw-progress sw-progress-compare">{items}</div>
        </TrafficShareTooltip>
    ) : (
        <div className="sw-progress sw-progress-compare">{items}</div>
    );
};
GroupTrafficShare.displayName = "GroupTrafficShare";
