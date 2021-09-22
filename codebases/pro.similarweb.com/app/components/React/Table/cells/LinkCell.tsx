import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { noDataFilter } from "filters/ngFilters";
import { trackEvent } from "../SWReactTableUtils";
import { UpgradeLink } from "./UpgradeLink";

export const LinkCell: StatelessComponent<ITableCellProps> = ({
    value,
    tableMetadata,
    tableOptions,
}) => {
    const newValue = noDataFilter()(value, "^\\s*n\\/a\\s*$", "-");
    if (newValue !== "grid.upgrade") {
        return (
            <div className="link-cell cell-padding cell-innerText">
                <div className="swTable-content-large text">{newValue}</div>
                <a
                    className="swTable-linkOut sw-icon-bounce-rate"
                    href={`http://${newValue}`}
                    onClick={() => {
                        trackEvent(tableOptions, "External Link", newValue, "click");
                    }}
                    target="_blank"
                />
            </div>
        );
    } else {
        return <UpgradeLink />;
    }
};
LinkCell.displayName = "LinkCell";
