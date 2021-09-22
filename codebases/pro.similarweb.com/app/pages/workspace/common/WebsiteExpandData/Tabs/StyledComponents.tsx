import { colorsPalettes, rgba } from "@similarweb/styles";
import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import styled from "styled-components";

import { BoxContainer } from "../../../../../../.pro-features/pages/app performance/src/page/single/usage section/styledComponents";
import { FullWidthBarButton } from "../../../../../../.pro-features/pages/workspace/common components/RecommendationsSidebar/StyledComponents";
import { SidebarGraphWrapper } from "../../../../../../.pro-features/pages/workspace/common components/SidebarGraph/StyledComponents";
import { FlexRow } from "../../../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";

export const TabWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 72px;
`;

export const LoadingGraphs = styled.div`
    height: 272px;
    width: 392px;
    border: 1px solid ${rgba(colorsPalettes.midnight[600], 0.08)};
    border-radius: 6px;
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const AnalysisTileWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    width: 400px;
    margin: -6px 8px 6px 0;
`;

interface IFeedSettingsWrapper {
    isVisible: boolean;
}

export const FeedSettingsWrapper = styled(FullWidthBarButton)<IFeedSettingsWrapper>`
    position: fixed;
    bottom: 0;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    font-size: 14px;
    color: ${colorsPalettes.carbon[500]};
    box-sizing: border-box;
    box-shadow: 0 -3px 6px 0 ${rgba(colorsPalettes.midnight[600], 0.08)};
    border-radius: initial;
    border: none;
    width: 100%;
    z-index: 10;
    opacity: ${(props) => (props.isVisible ? 1 : 0)};
    transition: opacity 0.5s ease-in-out;
`;

export const FeedEmptyStateImageAndText = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 80px 0;
`;

export const DashboardTileWrapper = styled(FullWidthBarButton)`
    display: flex;
    flex-direction: column;
    width: 392px;
    margin-bottom: 8px;
    cursor: pointer;
    padding: 16px 24px;
    box-sizing: border-box;
    background-color: ${colorsPalettes.carbon[0]};
    &:hover {
        box-shadow: 0 3px 6px 0 ${colorsPalettes.carbon[50]};
    }
    .SWReactIcons {
        align-self: flex-end;
        margin-top: -24px;
        svg path {
            fill: ${colorsPalettes.blue[400]};
        }
    }
`;

export const DashboardTileTitle = styled.div`
    font-size: 14px;
    line-height: 24px;
    color: ${colorsPalettes.carbon[500]};
`;

export const DashboardTileSubtitle = styled.div`
    font-size: 12px;
    line-height: 20px;
    color: ${colorsPalettes.carbon[200]};
    width: calc(100% - 32px);
`;

export const LoadingFeed = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px;
`;

export const circularLoaderOptions = {
    svg: {
        stroke: "#dedede",
        strokeWidth: "4",
        r: 21,
        cx: "50%",
        cy: "50%",
    },
    style: {
        width: 46,
        height: 46,
    },
};

export const RanksWrapper = styled(SidebarGraphWrapper)`
    ${BoxContainer} {
        display: flex;
        flex-direction: row;
        height: 75px;
        padding: 12px;
    }
`;

export const RankItemWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 122px;
`;

export const RankItemHeader = styled(FlexRow)`
    align-items: center;
    margin-bottom: 8px;
    svg {
        width: 16px;
        height: 16px;
    }
`;

export const RankItemTitle = styled.div`
    font-size: 12px;
    color: ${rgba(colorsPalettes.carbon[500], 0.6)};
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-left: 4px;
`;

export const RankItemContent = styled.div`
    font-size: 21px;
    color: ${colorsPalettes.carbon[500]};
    margin-left: 4px;
`;
