import { noDataFilter } from "filters/ngFilters";
import * as React from "react";
import { FunctionComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { trackEvent } from "../SWReactTableUtils";
import { UpgradeLink } from "./UpgradeLink";

export const SimpleLinkCell: FunctionComponent<ITableCellProps> = ({
    value,
    tableOptions,
    tableMetadata,
    track = trackEvent,
    row,
}) => {
    const { Domain } = row;

    if (Domain === "grid.upgrade") {
        return <UpgradeLink />;
    } else {
        const newValue = noDataFilter()(value, "^\\s*n\\/a\\s*$", "-");

        return (
            <div className="link-cell cell-padding cell-innerText">
                <a
                    className="ad-target-url"
                    href={newValue}
                    onClick={() => {
                        track(tableOptions, "External Link", newValue, "click");
                    }}
                    target="_blank"
                >
                    {newValue.replace(/^https?:\/\//, "")}
                </a>
            </div>
        );
    }
};
