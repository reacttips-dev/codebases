import { Box } from "@similarweb/ui-components/dist/box";
import { Flex } from "pages/Leading Folders/src/LeadingFoldersInfoPanel";
import styled from "styled-components";

export const TitleContainer = styled.div`
    height: 94px;
    box-sizing: border-box;
    padding: 23px 0 25px 25px;
`;

TitleContainer.displayName = "TitleContainer";

export const ContentContainer = styled.div`
    height: 280px;
    box-sizing: border-box;
    padding: 21px 25px 25px 25px;
    display: flex;
    justify-content: center;
`;

ContentContainer.displayName = "ContentContainer";

export const BoxContainer = styled(Box)`
    font-family: Roboto;
    height: auto;
    margin: 28px 24px 0 0;
    flex-grow: 1;
    width: 0;
    box-sizing: border-box;
    min-width: 280px;
    &:last-child {
        margin-right: 0;
    }
    @media (max-width: 920px) {
        &:nth-child(2) {
            margin-right: 0;
        }
    }
    @media (max-width: 781px) {
        margin: 28px 24px 0 0;
        width: 100%;
    }
`;

export const SmallLoaderContainer = styled.div`
    margin-top: 4px;
`;
SmallLoaderContainer.displayName = "SmallLoaderContainer";

BoxContainer.displayName = "BoxContainer";
