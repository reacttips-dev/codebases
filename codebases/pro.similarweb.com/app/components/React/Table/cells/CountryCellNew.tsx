import * as React from "react";
import { colorsPalettes } from "@similarweb/styles";
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

const StyledNew = styled.div`
    background: ${colorsPalettes.orange[400]};
    border-radius: 8px;
    font-size: 8px;
    color: ${colorsPalettes.carbon[0]};
    line-height: 10px;
    padding: 4px 7.5px 2px;
    font-weight: 500;
    margin: 2px 0 2px 9px;
    text-transform: uppercase;
`;

interface CountryCellNewProps extends ITableCellProps {
    value: {
        isNew: boolean;
        country: number;
        labelNew: string;
    };
}

export const CountryCellNew: StatelessComponent<CountryCellNewProps> = ({
    value,
    tableOptions,
}) => {
    const { country, isNew, labelNew } = value;
    const text = countryTextByIdFilter()(country);
    return (
        <div className="swTable-countryCell countryCellNew">
            <CountryFlagContainer className="countryIcon-container">
                <SWReactCountryIcons countryCode={country} />
            </CountryFlagContainer>
            {country !== -1 ? (
                <div className="country-text" title={text}>
                    {text}
                    {isNew && <StyledNew>{labelNew}</StyledNew>}
                </div>
            ) : (
                <UpgradeLink />
            )}
        </div>
    );
};
CountryCellNew.displayName = "CountryCellNew";
