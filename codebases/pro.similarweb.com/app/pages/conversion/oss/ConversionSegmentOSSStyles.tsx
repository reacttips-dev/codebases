import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import {
    BoxContainer,
    TitleContainer,
} from "pages/conversion/components/ConversionScatterChart/StyledComponents";

export const ConversionContainer = styled.div`
    padding: 40px;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    align-items: center;
`;

export const StyledLink = styled.a`
    text-decoration: none;
    font-size: 14px;
    margin-left: 4px;
    cursor: pointer;
`;

export const OssEmptyStateContainer = styled.div`
    padding-top: 60px;
    border-top: 1px solid ${colorsPalettes.carbon["100"]};
    justify-content: center;
    display: block;
    align-items: center;
    padding-bottom: 400px;
`;

export const FlexContainer = styled.div`
    display: flex;
`;
export const FlexContainerCentered = styled(FlexContainer)`
    justify-content: center;
    align-items: center;
`;

export const PrimaryText = styled.div`
    font-size: 16px;
    color: ${colorsPalettes.carbon["500"]};
    text-align: center;
    margin-top: 20px;
`;

export const SecondaryText = styled.div`
    font-size: 14px;
    color: ${colorsPalettes.carbon["200"]};
`;

export const StyledTitleContainer: any = styled(TitleContainer)`
    border-bottom: 0px;
    text-transform: capitalize;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

export const StyledTitleTextContainer = styled.div`
    display: flex;
    flex-direction: column;
`;
