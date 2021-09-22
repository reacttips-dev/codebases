import * as React from "react";
import { LinkButton } from "./Button";
import I18n from "../../Filters/I18n";
import { PlainTooltip } from "../../Tooltip/PlainTooltip/PlainTooltip";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { UpgradeLink } from "./UpgradeLink";

export const InstoreKeywordCell: React.StatelessComponent<ITableCellProps> = ({
    tableMetadata,
    value,
    row,
    tableOptions,
}) => {
    if (value !== "grid.upgrade") {
        return (
            <div className="app-keyword-cell">
                <I18n className="search-keyword">{value}</I18n>
                <span className="link-buttons-container">
                    <PlainTooltip
                        cssClass="plainTooltip-element search-keyword-cell-tooltip"
                        text="appanalysis.instore.table.keyword.link1"
                        placement="top"
                    >
                        <span className="link-button-container">
                            <LinkButton
                                to={row.url}
                                iconClass="sw-icon sw-icon-search-trend analyze-button"
                            />
                        </span>
                    </PlainTooltip>
                    <PlainTooltip
                        cssClass="plainTooltip-element search-keyword-cell-tooltip"
                        text="appanalysis.instore.table.keyword.link2"
                        placement="top"
                    >
                        <span className="link-button-container">
                            <LinkButton
                                to={`https://play.google.com/store/search?q=${value}&c=apps`}
                                iconClass="sw-icon sw-icon-google-search"
                            ></LinkButton>
                        </span>
                    </PlainTooltip>
                </span>
            </div>
        );
    } else {
        return <UpgradeLink />;
    }
};
