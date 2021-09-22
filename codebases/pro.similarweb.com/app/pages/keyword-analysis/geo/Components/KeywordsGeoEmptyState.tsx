import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { i18nFilter } from "filters/ngFilters";
import {
    FlexContainerCentered,
    PrimaryText,
    SecondaryText,
} from "pages/conversion/oss/ConversionSegmentOSSStyles";
import { default as React } from "react";
import styled from "styled-components";

const EmptyStateStyle = styled.div<{ width: string }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 393px;
    align-items: center;
    margin: 0 auto;
    text-align: center;
    width: ${(p) => p.width};
    ${SecondaryText} {
        opacity: 0.6;
        color: ${colorsPalettes.carbon["500"]};
        font-weight: 400;
        margin-top: 8px;
    }
    ${PrimaryText} {
        opacity: 0.6;
        color: ${colorsPalettes.carbon["500"]};
        font-weight: 500;
    }
`;
export const NoDataLabIcon = styled(SWReactIcons).attrs({
    iconName: "no-data-lab",
})`
    svg {
        height: 90px;
        width: 190px;
    }
`;
export const KeywordsGeoEmptyState: any = ({ titleText, bodyText, width }) => {
    return (
        <EmptyStateStyle width={width} data-automation="keywords-geo-page-empty-state">
            <FlexContainerCentered>
                <NoDataLabIcon />
            </FlexContainerCentered>
            <PrimaryText>{i18nFilter()(titleText)}</PrimaryText>
            {bodyText && <SecondaryText>{i18nFilter()(bodyText)}</SecondaryText>}
        </EmptyStateStyle>
    );
};
