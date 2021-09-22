import { i18nFilter } from "filters/ngFilters";
import React from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { ShortenedMonthsKeys } from "UtilitiesAndConstants/Constants/Months";

const i18n = i18nFilter();

const SeasonalityHeaderCellContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
`;

const Text = styled.span``;

const Hyphen = styled.div`
    height: 1px;
    background-color: ${colorsPalettes.carbon[100]};
    width: 100%;
    margin: 0px 10px;
`;

export const SeasonalityHeaderCell = () => {
    const from = i18n(ShortenedMonthsKeys.jan);
    const to = i18n(ShortenedMonthsKeys.dec);
    return (
        <SeasonalityHeaderCellContainer>
            <Text>{from}</Text>
            <Hyphen />
            <Text>{to}</Text>
        </SeasonalityHeaderCellContainer>
    );
};
