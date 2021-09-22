import styled, { css } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Button } from "@similarweb/ui-components/dist/button";
import { PageContentContainer } from "../common/styles/CompetitiveTrackingStyles";

export const TitleWithTooltipContainer = styled.div`
    display: flex;
`;

export const SectionTitle = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: ${colorsPalettes.carbon[400]};
    margin-bottom: 8px;
    padding-left: 2px;
`;

export const InfoIconContainer = styled.div`
    padding: 0px 0px 5px 5px;
`;

export const EditPageContainer = styled(PageContentContainer)`
    display: block;
    width: 656px;
    justify-content: flex-start;
    padding: 40px 0px;
`;

export const TrackerNameContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    box-sizing: border-box;
`;

export const MainPropertyContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    box-sizing: border-box;
    z-index: 3;
`;

export const CompetitorAssetsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    box-sizing: border-box;
    z-index: 2;
`;

export const FiltersContainer = styled.div`
    width: 100%;
    margin-bottom: 40px;
`;

export const CountryFilterContainer = styled.div``;

export const CountryFilterWrapper = styled.div`
    height: 40px;
    border: 1px ${colorsPalettes.carbon[50]} solid;
    border-radius: 3px;
    .CountryFilter-dropdownButton {
        ${setFont({ $size: 14 })};
    }

    .DropdownButton--filtersBarDropdownButton {
        border-left: none;
    }
`;

export const CategoryFilterContainer = styled.div``;

export const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    padding: 0 40px;
    box-sizing: border-box;
`;

export const EditPageButton = styled(Button)<{ marginRight?: number; marginLeft?: number }>`
    ${({ marginRight }) =>
        marginRight &&
        css`
            margin-right: ${marginRight}px;
        `};
    ${({ marginLeft }) =>
        marginLeft &&
        css`
            margin-left: ${marginLeft}px;
        `};
`;

export const EditPageContentContainer = styled.div`
    padding: 0px 96px 20px 96px;
`;

export const LoaderContainer = styled.div`
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const TrackerPropertiesContainer = styled.div`
    display: flex;
    grid-row-gap: 20px;
    flex-direction: column;
`;

export const CompetitorsSectionTitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

export const CounterTextContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    font-size: 12px;
    color: ${colorsPalettes.carbon[300]};
    font-weight: 400;
    justify-content: flex-end;
`;
