import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { Injector } from "common/ioc/Injector";
import { CHART_COLORS } from "constants/ChartColors";
import { chosenItems } from "common/services/chosenItems";

export const GroupAppPositions: StatelessComponent<ITableCellProps> = ({ value, tableOptions }) => {
    const colors = CHART_COLORS[tableOptions.colorSource || "compareMainColors"];
    let positionItems = [];

    chosenItems.forEach((item, index) => {
        const position = value[item.Id] || "-";
        const title = `${item.Title}: ${position}`;

        positionItems.push(
            <div
                className="position-circle"
                key={index}
                style={{ background: colors[index] }}
                title={title}
            >
                {position}
            </div>,
        );
    });

    return <div className="u-relative">{positionItems}</div>;
};
GroupAppPositions.displayName = "GroupAppPositions";
