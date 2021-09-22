import { CoreWebsiteCell } from "components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import {
    InnerLink,
    InnerLinkContainer,
    Link,
} from "components/core cells/src/CoreWebsiteCell/StyledComponents";
import {
    SearchContainer,
    TableWrapper,
} from "pages/conversion/conversionTableContainer/StyledComponents";
import { TitleContainer } from "pages/segments/components/benchmarkOvertime/StyledComponents";
import { BoxContainer } from "pages/website-analysis/audience-loyalty/StyledComponents";
import * as React from "react";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const Circle = styled.div`
    display: inline-block;
    background: ${({ color }: any) => (color ? color : "#000")};
    border-radius: 20px;
    height: 10px;
    width: 10px;
    margin-right: 4px;
`;

export const LegendItemTitle = styled.span`
    text-transform: capitalize;
    margin-right: 16px;
    font-size: 14px;
    color: ${colorsPalettes.carbon["400"]};
`;

export const LegendContainer: any = styled.div`
    display: flex;
    align-items: center;
    margin-left: 8px;
    justify-content: space-between;
    width: 80%;
`;

export const MinLabel = styled.div`
    font-size: 14px;
    text-transform: capitalize;
    color: ${colorsPalettes.carbon["200"]};
    margin-right: 10px;
    white-space: nowrap;
`;

export const MaxLabel = styled(MinLabel)`
    margin-right: 0px;
    margin-left: 10px;
`;

export const GraphWapper = styled(FlexRow)`
    margin: 15px 0px 20px 0px;
    width: 100%;
    align-items: center;
`;

export const LoyaltyTitleContainer = styled(TitleContainer)`
    padding-bottom: 20px;
    border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
`;

export const TableBoxContainer = styled(BoxContainer)`
    margin-top: 30px;
`;

export const StyledTableWrapper = styled(TableWrapper)`
    max-width: none;
    border-radius: 6px;
    ${SearchContainer} {
        border-top: none;
    }
`;

export const LegnedItem = ({ color, title }) => {
    return (
        <FlexRow alignItems={"center"}>
            <Circle color={color} />
            <LegendItemTitle>{title}</LegendItemTitle>
        </FlexRow>
    );
};

export const StyledCoreWebsiteCell = styled(CoreWebsiteCell)`
    ${Link} {
        color: ${colorsPalettes.blue["400"]};
    }
    ${InnerLinkContainer} {
        width: auto;
    }
    ${InnerLink} {
        width: auto;
        &:hover {
            width: auto;
        }
    }
`;

export const StyledSearchContainer = styled(SearchContainer)`
    border: none;
    width: 100%;
    .SearchInput-container div {
        top: 14px;
    }
    .SearchInput {
        height: 48px;
    }
`;
