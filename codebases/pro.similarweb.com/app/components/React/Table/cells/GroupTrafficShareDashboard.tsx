import { percentageFilter } from "filters/ngFilters";
import * as _ from "lodash";
import * as React from "react";
import { StatelessComponent } from "react";
import { Injector } from "../../../../../scripts/common/ioc/Injector";
import { CHART_COLORS } from "../../../../constants/ChartColors";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { getBrightnessHEX } from "@similarweb/styles";
import * as classNames from "classnames";

export const GroupTrafficShareDashboard: StatelessComponent<ITableCellProps> = ({
    value = [],
    items,
    tableOptions,
}) => {
    const keys = items ? items.split(",") : null;
    const chosenSites = Injector.get("chosenSites") as any;
    const colors = CHART_COLORS[tableOptions.colorSource || "compareMainColors"].slice();
    let siteOrigins = [];

    if (!_.isArray(value) && keys) {
        keys.forEach((key, index) => {
            siteOrigins.push({
                name: key,
                value: value[key],
                index,
            });
        });
    } else {
        if (!_.isArray(value)) {
            chosenSites.forEach((site, siteInfo, index) => {
                if (value[site]) {
                    siteOrigins.push({
                        name: site,
                        value: value[site],
                        color: colors[index],
                        index,
                    });
                }
            });
        } else {
            let counter = 0;
            for (const key in value) {
                const index = keys ? keys.indexOf(key) : undefined;
                siteOrigins.push({
                    value: value[key],
                    index: index > -1 ? index : counter,
                    name: keys[key],
                });
                counter++;
            }
            siteOrigins = _.sortBy(siteOrigins, (o) => o.index);
        }
    }

    let newItems = _.filter(siteOrigins, (item, index) => {
        const result = item.value ? item.value > 0.0005 : item > 0.0005;
        return result;
    });

    //
    let _newTotal = 1,
        _threshold = 0.02;
    if (newItems.length > 1) {
        const _firstItem = newItems[0].value ? newItems[0].value : newItems[0],
            _lastItem = newItems[newItems.length - 1].value
                ? newItems[newItems.length - 1].value
                : newItems[newItems.length - 1];

        if (_firstItem < _threshold) {
            _newTotal -= _threshold;
        }
        if (_lastItem < _threshold) {
            _newTotal -= _threshold;
        }
    }

    newItems = newItems.map((item, index) => {
        let value = item.value ? item.value : item;
        const siteName =
            value > 0.1 ? item.name : item.name + " " + `${percentageFilter()(value, 1)}%`;
        const displayVal = value > 0.1 ? `${percentageFilter()(value, 1)}%` : "";
        if (value > _threshold) {
            value = _newTotal * value;
        }
        if (value < _threshold && (index === 0 || index === newItems.length - 1)) {
            value = _threshold;
        }
        const cssWidth = `${value * 100}%`;

        const backgroundColor = item.color || colors[item.index] || colors[index];
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

    return <div className="sw-progress sw-progress-compare">{newItems}</div>;
};
GroupTrafficShareDashboard.displayName = "GroupTrafficShareDashboard";
