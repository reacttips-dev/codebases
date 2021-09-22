import { SWReactCountryIcons, SWReactIcons } from "@similarweb/icons";
import { ITableCellProps } from "components/React/Table/interfaces/ITableCellProps";
import { ITableOptions } from "components/React/Table/interfaces/ITableOptions";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { countryTextByIdFilter } from "filters/ngFilters";
import * as React from "react";
import { FunctionComponent, useEffect, useRef } from "react";
import styled from "styled-components";

const CountryFlagContainer = styled.div`
    width: 1em;
    height: 1em;
    margin-right: 7px;
    display: inline-block;
`;

const Container = styled.div``;
const Link = styled.a`
    display: flex;
    align-items: center;
    line-height: initial;
    color: inherit;
`;
const SearchIcon = styled(SWReactIcons)`
    opacity: 0;
    margin-left: 4px;
    transition: opacity 200ms;
    ${Link}:hover & {
        opacity: 1;
    }
    path {
        fill: #5a93f9;
    }
`;

interface IKWGeotableOptions extends ITableOptions {
    getCountryCellLink({ country: number }): string;
    onCountryCellClick(event: MouseEvent, country: number): void;
}

interface IKWGeoCountryCellProps extends ITableCellProps {
    tableOptions: IKWGeotableOptions;
}

export const KeywordsGeoCountryCell: FunctionComponent<IKWGeoCountryCellProps> = ({
    value,
    tableOptions,
}) => {
    const linkRef = useRef<HTMLAnchorElement>();
    const countryText = countryTextByIdFilter()(value);
    useEffect(() => {
        if (linkRef.current) {
            // sorry guys, must be violent here: preventDefault() on react synthetic onClick didn't stop the browser
            // from performing the navigation.
            // also event.nativeEvent.preventDefault() didn't work.
            // so we are attaching a new DOM event to determine if transition should be stopped (fro users)
            linkRef.current.addEventListener(
                "click",
                (e) => tableOptions.onCountryCellClick(e, value),
                { capture: true },
            );
        }
    }, [linkRef?.current]);
    return (
        <PlainTooltip text={`Explore this keyword in ${countryText}`}>
            <Container className="swTable-countryCell">
                <Link ref={linkRef} href={tableOptions.getCountryCellLink(value)}>
                    <CountryFlagContainer className="countryIcon-container">
                        <SWReactCountryIcons countryCode={value} />
                    </CountryFlagContainer>
                    <div className="country-text">{countryText}</div>
                    <SearchIcon iconName="search-keywords" size="16px" />
                </Link>
            </Container>
        </PlainTooltip>
    );
};
