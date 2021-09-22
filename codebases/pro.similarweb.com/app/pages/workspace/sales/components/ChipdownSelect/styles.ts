import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders/src/PlaceholderLoaders";
import styled from "styled-components";

export const StyledRow = styled.div`
    display: flex;
    align-items: center;
`;
export const StyledCol = styled.div`
    display: flex;
    flex-direction: column;
`;
export const StyledItemWrapper = styled.div`
    & > div {
        height: auto;
    }

    & div {
        max-width: 340px;
    }
    .benchmarkModeItem {
        padding: 15px;
    }
`;
export const StyledIconWrapper = styled.div`
    display: flex;
    height: 100%;
    align-self: flex-start;
    padding-right: 8px;
    padding-top: 8px;
`;
export const StyledTextWrapper = styled.div`
    font-size: 14px
    padding-top: 8px;
    padding-bottom: 8px;
`;

export const StyledOptionDescription = styled.div`
    opacity: 0.6;
    width: inherit;
    word-break: break-word;
    white-space: normal;
    font-size: 12px;
    padding-bottom: 8px;
`;
export const PlaceholderLoaderStyle = styled(PixelPlaceholderLoader)`
    margin-left: 10px;
`;

export const StyledChipDownWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
`;
