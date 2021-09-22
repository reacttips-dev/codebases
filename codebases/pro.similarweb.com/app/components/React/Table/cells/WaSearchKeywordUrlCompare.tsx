import * as React from "react";
import { WaSearchUrlTooltip } from "../../Tooltip/WaSearchUrlTooltip/WaSearchUrlTooltip";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";

export const WaSearchKeywordUrlCompare: StatelessComponent<ITableCellProps> = ({ row, field }) => {
    const items: { Key: string; Value: string }[] = row[field],
        firstItem = items[0],
        hasValue = firstItem.Value.toLowerCase() !== "n/a";

    if (!hasValue) {
        return <span className="cell-innerText"> - </span>;
    }
    return (
        <div className="cell-innerText" style={{ display: "flex", alignItems: "center" }}>
            <span
                className=""
                style={{
                    display: "inline-block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginRight: 5,
                }}
            >
                {firstItem.Value}
            </span>
            <WaSearchUrlTooltip data={items}>
                <span className="sw-icon-show-more" style={{ verticalAlign: "middle" }} />
            </WaSearchUrlTooltip>
        </div>
    );
};
WaSearchKeywordUrlCompare.displayName = "WaSearchKeywordUrlCompare";
