import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { CarouselContainerWrapper } from "components/Carousel/src/Carousel.styles";

export const InsightsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    margin-top: 20px;
`;

export const InsightsTitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;

    .SWReactIcons {
        svg {
            path {
                fill: ${colorsPalettes.carbon["400"]} !important;
                fill-opacity: 1;
            }
        }
    }
`;

export const InsightsTitle = styled.span`
    font-size: 20px;
    font-weight: 500;
    color: ${colorsPalettes.carbon[400]};
    margin-left: 4px;
`;
