import * as classNames from "classnames";
import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { SWReactIcons } from "@similarweb/icons";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

const CheckedIcon = styled(SWReactIcons).attrs({
    iconName: "checked",
    size: "sm",
})`
    display: inline-block;

    path {
        color: ${colorsPalettes.green["s100"]};

        margin-left: 4px;
    }
`;

export const LinkDuplicateDashboard: StatelessComponent<ITableCellProps> = ({
    row,
    value,
    onItemClick,
}) => {
    const onClick = () => onItemClick(row, row.Id, value);
    const hasTriedCopying = row.loading || row.copied || row.error;
    return (
        <div className="cell-innerText">
            <div className="u-flex-row u-link u-truncate" onClick={onClick}>
                <span
                    className={classNames({ "link-duplicate-dashboard-trim": hasTriedCopying })}
                    title={value}
                >
                    {value}
                </span>
                {row.loading ? <DotsLoader className="duplicate-dashboard-dots" /> : null}
                {row.copied ? <CheckedIcon /> : null}
                {row.error ? (
                    <span
                        className="sw-icons sw-icon-error_triangle"
                        style={{ color: "red", marginLeft: 4 }}
                    ></span>
                ) : null}
            </div>
        </div>
    );
};
LinkDuplicateDashboard.displayName = "LinkDuplicateDashboard";
