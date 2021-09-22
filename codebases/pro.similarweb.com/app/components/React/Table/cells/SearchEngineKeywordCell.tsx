import * as React from "react";
import { LinkButton } from "./Button";
import I18n from "../../Filters/I18n";
import { PlainTooltip } from "../../Tooltip/PlainTooltip/PlainTooltip";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { UpgradeLink } from "./UpgradeLink";

export const SearchEngineKeywordCell: React.StatelessComponent<ITableCellProps> = ({
    tableOptions,
    tableMetadata,
    value,
}) => {
    if (value !== "grid.upgrade") {
        return (
            <div className="app-keyword-cell">
                <I18n className="search-keyword">{value}</I18n>
                <span className="link-buttons-container">
                    <PlainTooltip
                        cssClass="plainTooltip-element search-keyword-cell-tooltip"
                        text="appanalysis.search.engine.table.keyword.link1.tooltip"
                        placement="top"
                    >
                        <span className="link-button-container">
                            <LinkButton
                                to={`https://google.com/search?q=${value}`}
                                iconClass="sw-icon sw-icon-google-search"
                            />
                        </span>
                    </PlainTooltip>
                </span>
            </div>
        );
    } else {
        return <UpgradeLink />;
    }
};
