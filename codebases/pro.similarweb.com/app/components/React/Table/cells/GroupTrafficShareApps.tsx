import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { CHART_COLORS } from "constants/ChartColors";
import { Injector } from "common/ioc/Injector";
import { percentageFilter } from "filters/ngFilters";
import { getBrightnessHEX } from "@similarweb/styles";
import * as classNames from "classnames";
import { chosenItems } from "common/services/chosenItems";

export const GroupTrafficShareApps: StatelessComponent<ITableCellProps> = ({
    value,
    tableOptions,
}) => {
    const origColors = CHART_COLORS[tableOptions.colorSource || "compareMainColors"];
    const emptyHTML = (
        <div className="u-alignCenter" style={{ lineHeight: 1 }}>
            -
        </div>
    );
    let appOrigins;

    if (!value) {
        return emptyHTML;
    }

    appOrigins = chosenItems.filter((item) => value[item.Id] > 0.0005);

    let _newTotal = 1,
        _threshold = 0.02;

    if (appOrigins.length > 1) {
        let _firstItem = value[appOrigins[0]["Id"]],
            _lastItem = value[appOrigins[appOrigins.length - 1]["Id"]];

        if (_firstItem < _threshold) {
            _newTotal -= _threshold;
        }
        if (_lastItem < _threshold) {
            _newTotal -= _threshold;
        }
    }

    appOrigins = appOrigins.map((item, index, arr) => {
        let val = value[item.Id];
        let appTitle = item.Title;
        let title =
            value[item.Id] > 0.1 ? appTitle : appTitle + " " + `${percentageFilter()(val, 1)}%`;
        let displayVal = val > 0.1 ? `${percentageFilter()(val, 1)}%` : "";
        if (val > _threshold) {
            val = _newTotal * val;
        }
        if (val < _threshold && (index === 0 || index === arr.length - 1)) {
            val = _threshold;
        }
        let cssWidth = `${val * 100}%`;

        const backgroundColor = origColors[item.Index];
        const classnames = classNames(
            `bar-innerText`,
            `bar-${getBrightnessHEX(backgroundColor)}-background`,
        );
        return (
            <div key={index} className="bar" style={{ width: cssWidth }}>
                <div className={classnames} title={title} style={{ background: backgroundColor }}>
                    {displayVal}
                </div>
            </div>
        );
    });

    return (
        <div className="sw-progress sw-progress-compare">
            {appOrigins.length ? appOrigins : emptyHTML}
        </div>
    );
};
GroupTrafficShareApps.displayName = "GroupTrafficShareApps";
