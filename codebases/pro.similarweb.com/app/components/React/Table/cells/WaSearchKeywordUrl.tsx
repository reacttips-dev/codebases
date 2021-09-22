import * as _ from "lodash";
import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";

export const WaSearchKeywordUrl: StatelessComponent<ITableCellProps> = ({ row, field }) => {
    const value = row[field][0].Value;
    return (
        <div className="cell-innerText">
            <span
                style={{
                    display: "inline-block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    verticalAlign: "bottom",
                }}
                title={value}
            >
                {value == "N/A" ? "-" : value}
            </span>
            {value !== "N/A" ? (
                <a
                    className="swTable-linkOut sw-link-out"
                    href={_.startsWith(value, "http") ? value : `http://${value}`}
                    target="_blank"
                />
            ) : null}
        </div>
    );
};
WaSearchKeywordUrl.displayName = "WaSearchKeywordUrl";
