import * as React from "react";
import { countryTextByIdFilter } from "filters/ngFilters";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { SWReactCountryIcons } from "@similarweb/icons";
import styled from "styled-components";
import { UpgradeLink } from "./UpgradeLink";

const CountryFlagContainer = styled.div`
    width: 1em;
    height: 1em;
    margin-right: 7px;
    display: flex;
    flex-shrink: 0;
`;

export const CountryCell: StatelessComponent<ITableCellProps> = ({ value, tableOptions }) => {
    const text = countryTextByIdFilter()(value);
    return (
        <div className="swTable-countryCell">
            <CountryFlagContainer className="countryIcon-container">
                <SWReactCountryIcons countryCode={value} />
            </CountryFlagContainer>
            {value !== -1 ? (
                <div className="country-text" title={text}>
                    {text}
                </div>
            ) : (
                <UpgradeLink />
            )}
        </div>
    );
};
CountryCell.displayName = "CountryCell";
