import styled from "styled-components";
import { Box } from "@similarweb/ui-components/dist/box";

export const BoxContainer: any = styled(Box)`
    border-radius: 6px;
    box-sizing: border-box;
    /* padding: 20px 24px; */
    height: 345px;
    width: 100%;
`;

export const GenderContainer = styled.div`
    flex-basis: 41.66667%;
    max-width: 41.66667%;
    box-sizing: border-box;
    padding-right: 0.7rem;
    padding-left: 0.7rem;

    @media (max-width: 1200px) {
        max-width: 100%;
        width: 100%;
        margin-bottom: 22px;
    }
`;

export const AgeContainer = styled.div`
    flex-basis: 58.33333%;
    max-width: 58.33333%;
    box-sizing: border-box;
    padding-left: 0.7rem;
    padding-right: 0.7rem;

    @media (max-width: 1200px) {
        max-width: 100%;
        width: 100%;
    }
`;

export const GenderContainerCompare = styled(Box)`
    display: flex;
    height: 351px;
    width: 100%;
    margin-bottom: 20px;
    border-radius: 6px;
`;

export const AgeContainerCompare = styled(Box)`
    display: flex;
    height: 351px;
    width: 100%;
    border-radius: 6px;
`;

export const DemographicsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;

    @media (max-width: 1200px) {
        flex-direction: column;
    }
`;

export const StyledLegendWrapper = styled.span``;

export const StyledLegendsWrapper = styled.div`
    min-width: 200px;
    margin-top: 10px;
    flex: none;
`;
