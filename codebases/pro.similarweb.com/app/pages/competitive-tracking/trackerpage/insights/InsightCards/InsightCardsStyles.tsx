import { CarouselContainerWrapper } from "components/Carousel/src/Carousel.styles";
import styled from "styled-components";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { colorsPalettes } from "@similarweb/styles";

export const InsightsContainer = styled(CarouselContainerWrapper)`
    width: 100%;
    margin-top: 20px;
`;

export const InsightsLoaderContainer = styled.div`
    width: 100%;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`;

export const InsightCardWrapper = styled.div`
    margin-right: 16px;
`;
