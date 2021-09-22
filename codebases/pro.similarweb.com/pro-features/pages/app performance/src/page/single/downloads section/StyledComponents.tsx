import { colorsPalettes } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import { Flex } from "pages/Leading Folders/src/LeadingFoldersInfoPanel";
import * as React from "react";
import styled from "styled-components";
import { FlexRow } from "../../../../../../styled components/StyledFlex/src/StyledFlex";

const br0 = "500px";
const br1 = "800px";

export const DownloadsContainer: any = styled(Box)`
    width: 100%;
    height: 527px;
    margin-top: 24px;
    font-family: Roboto;
`;
DownloadsContainer.displayName = "DownloadsContainer";

export const DownloadsLoadersContainer: any = styled(Box)`
    position: relative;
    width: 100%;
    height: 530px;
    margin-top: 24px;
    .px-lod1 {
        margin-top: 28px;
        margin-bottom: 8px;
        padding-left: 30px;
    }
    .px-lod2 {
        padding-left: 30px;
    }
    .px-lod3 {
        margin-top: 24px;
    }
    .px-lod6 {
        margin-right: 60px;
    }
    .px-lod8 {
        position: absolute;
        width: 100px;
        height: 18px;
        right: 16px;
        bottom: 14px;
    }
`;
DownloadsLoadersContainer.displayName = "DownloadsLoadersContainer";

export const GraphInfoLoaders: any = styled(FlexRow)`
    .px-lod4 {
        flex-grow: 1;
        margin: 40px 60px 64px 60px;
    }
    .px-lod5 {
        margin-top: 140px;
        margin-bottom: 18px;
    }
    @media (max-width: ${br1}) {
        flex-direction: column;
        .px-lod4 {
            width: calc(100% - 120px);
            height: 200px;
            margin-bottom: 30px;
        }
        .px-lod5 {
            margin-top: 0px;
            margin-left: 60px;
        }
        .px-lod6 {
            margin-bottom: 20px;
            margin-left: 60px;
        }
    }
    @media (max-width: ${br0}) {
        .px-lod6 {
            width: calc(100% - 120px);
        }
        .px-lod5 {
            margin-right: 60px;
            width: calc(100% - 120px);
        }
    }
`;
GraphInfoLoaders.displayName = "GraphInfoLoaders";

export const EmptyDownloadsContainer: any = styled(Box)`
    width: 100%;
    height: 530px;
    margin-top: 24px;
    box-sizing: border-box;
`;
EmptyDownloadsContainer.displayName = "EmptyDownloadsContainer";

export const NoDataContainer: any = styled.div`
    height: 435px;
`;
NoDataContainer.displayName = "NoDataContainer";
