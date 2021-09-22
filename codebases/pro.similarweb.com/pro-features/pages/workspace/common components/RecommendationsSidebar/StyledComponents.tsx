import { colorsPalettes, rgba } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import {
    SimpleLegendItemIconContainer,
    SimpleLegendItemText,
} from "@similarweb/ui-components/dist/simple-legend";
import { TRIAL_BANNER_HEIGHT } from "components/React/TrialBanner/TrialBanner";
import styled, { css, keyframes } from "styled-components";

import { FlexColumn, FlexRow } from "../../../../styled components/StyledFlex/src/StyledFlex";
import { HoverIcon } from "components/core cells/src/CoreAppCell/StyledComponents";

export const RecommendationsSidebarHeader = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
`;
RecommendationsSidebarHeader.displayName = "RecommendationsSidebarHeader";

export const RecommendationsSidebarTitleWrapper = styled(FlexRow)`
    align-items: center;
`;
RecommendationsSidebarTitleWrapper.displayName = "RecommendationsSidebarTitleWrapper";

export const RecommendationsSidebarTitle = styled.div`
    font-size: 20px;
    font-weight: 500;
    color: ${colorsPalettes.carbon[500]};
`;
RecommendationsSidebarTitle.displayName = "RecommendationsSidebarTitle";

export const RecommendationsSidebarSubtitle = styled.div`
    font-size: 14px;
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
    margin-bottom: 4px;
    padding-top: 3px;
    line-height: 24px;
`;
RecommendationsSidebarSubtitle.displayName = "RecommendationsSidebarSubtitle";

export const RecommendationsSidebarSection = styled.div`
    padding: 24px;
`;
RecommendationsSidebarSection.displayName = "RecommendationsSidebarSection";

export const RecommendationsSidebarTopSection = styled.div`
    padding: 23px 24px 10px;
    background-color: ${colorsPalettes.carbon[0]};
`;
RecommendationsSidebarTopSection.displayName = "RecommendationsSidebarTopSection";

export const RecommendationsSidebarTile = styled.div`
    border: 1px solid ${rgba(colorsPalettes.midnight[600], 0.08)};
    border-radius: 6px;
    margin-top: 8px;
`;
RecommendationsSidebarTile.displayName = "RecommendationsSidebarTile";

export const FullWidthBarButton = styled(RecommendationsSidebarTile)`
    display: flex;
    justify-content: center;
    background-color: ${colorsPalettes.carbon[0]};
`;
FullWidthBarButton.displayName = "FullWidthBarButton";

export const RecommendationsSidebarActionsWrapper = styled(FlexRow)`
    display: none;
    > div {
        width: auto !important;
    }
`;
RecommendationsSidebarActionsWrapper.displayName = "RecommendationsSidebarActionsWrapper";

export const RecommendationsSidebarDotsWrapper = styled.div`
    margin: 0 8px 0 auto;
    opacity: 0;
    transition: opacity 0.2s ease-out;
`;
RecommendationsSidebarDotsWrapper.displayName = "RecommendationsSidebarDotsWrapper";

export const LinkIcon = styled.a`
    transition: opacity 0.2s ease-out;
    margin-left: 4px;
    opacity: 0;
    margin-top: 1px;
    .SWReactIcons svg {
        width: 16px;
        height: 16px;
    }
`;
LinkIcon.displayName = "LinkIcon";

export const RecommendationsSidebarTileWebsite = styled(Box).attrs<{ isRemoved: boolean }>({
    width: "auto",
})<{ isRemoved: boolean }>`
  height:170px;
  padding:16px;
  opacity :${({ isRemoved }) => (isRemoved ? 0 : 1)};
  box-sizing:border-box;
  transition: opacity .2s;
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  overflow:hidden;
  :hover  {
    ${RecommendationsSidebarDotsWrapper},${LinkIcon}{
        opacity: 1;
      }
  }
`;
RecommendationsSidebarTileWebsite.displayName = "RecommendationsSidebarTileWebsite";

export const RecommendationsSidebarTileWebsiteContainer = styled.div<{
    isRemoved: boolean;
}>`
    background-color: #fff;
    max-height: ${(props) => (props.isRemoved ? "0" : "170px")};
    margin-top: ${(props) => (props.isRemoved ? "0" : "12px")};
    overflow: hidden;
    transition: all 0.2s 0.2s;
`;

RecommendationsSidebarTileWebsiteContainer.displayName =
    "RecommendationsSidebarTileWebsiteContainer";

export const RecommendationsSidebarTileTopFragment = styled.div`
    box-sizing: border-box;
    display: flex;
`;

export const Subtitle = styled.span`
    color: ${colorsPalettes.carbon[500]};
    opacity: 0.4;
    font-size: 12px;
    font-weight: normal;
    line-height: normal;
`;

export const RecommendedWebsiteWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 228px;
    box-sizing: border-box;
    line-height: normal;
    position: relative;
    ${SimpleLegendItemIconContainer} {
        width: 24px;
        height: 24px;
    }
    ${SimpleLegendItemText} {
        font-size: 16px;
        font-weight: 500;
        color: #${colorsPalettes.carbon[500]};
        margin-right: 0;
        max-width: 149px;
        transition: max-width 0.2s ease-out;
        text-align: left;
        line-height: normal;
        margin-left: 7px;
    }
    ${Subtitle} {
        margin-left: 31px;
    }
`;

RecommendationsSidebarTileTopFragment.displayName = "RecommendationsSidebarTileTopFragment";

export const BottomTitle = styled.div`
    font-size: 16px;
    font-weight: 500;
    display: flex;
    color: ${(props) => props.color || colorsPalettes.carbon[500]};
    min-height: 17px;
    align-items: center;
    line-height: normal;
`;

export const RecommendationsSidebarTileBottomFragment = styled(
    RecommendationsSidebarTileTopFragment,
)`
    padding-left: 31px;
`;

RecommendationsSidebarTileBottomFragment.displayName = "RecommendationsSidebarTileBottomFragment";

export const RecommendationsSidebarEmptyStateWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
    height: 100%;
    position: relative;
    justify-content: center;
`;

export const RecommendationsSidebarEmptyStateButtonReloadContainer = styled.div`
    position: absolute;
    top: 0;
    right: 0;
`;

export const RecommendationsEmptyStateImageAndText = styled.div`
    text-align: center;
`;

RecommendationsSidebarEmptyStateWrapper.displayName = "RecommendationsSidebarEmptyStateWrapper";

export const RecommendationsSidebarEmptyStateBoldTitle = styled.div`
    font-size: 16px;
    color: ${colorsPalettes.carbon[500]};
    font-weight: bold;
    text-align: center;
    max-width: 100%;
    margin-top: 24px;
    margin-bottom: 8px;
`;
RecommendationsSidebarEmptyStateBoldTitle.displayName = "RecommendationsSidebarEmptyStateBoldTitle";

export const RecommendationsSidebarEmptyStateTitle = styled.div`
    font-size: 14px;
    color: ${colorsPalettes.midnight[200]};
    text-align: center;
    max-width: 100%;
`;
RecommendationsSidebarEmptyStateTitle.displayName = "RecommendationsSidebarEmptyStateTitle";

export const RecommendationsSidebarScrollArea = styled(ScrollArea)`
    max-height: calc(100vh - 200px);
`;
RecommendationsSidebarScrollArea.displayName = "RecommendationsSidebarScrollArea";

export const RecommendationsIndicatorWrapper = styled.div<{ isOpen: boolean }>`
    display: inline-flex;
    padding: 8px 12px;
    cursor: pointer;
    border: 1px solid ${rgba(colorsPalettes.midnight[600], 0.08)};
    border-radius: 4px;
    background-color: ${colorsPalettes.carbon[0]};
    align-items: center;
`;
RecommendationsIndicatorWrapper.displayName = "RecommendationIndicatorWrapper";

const calcRecommendationsSidebarContentHeight = (isTrial: boolean = false) =>
    `calc(100vh ${isTrial ? "- " + TRIAL_BANNER_HEIGHT + "px" : ""} - 96px)`;

export const RecommendationsSidebarContentWrapper = styled(RecommendationsSidebarSection)`
    box-sizing: border-box;
    position: relative;
    height: ${calcRecommendationsSidebarContentHeight()};
    overflow: auto;
    .FixedBar--trial & {
        height: ${calcRecommendationsSidebarContentHeight(true)};
    }
`;
export const RecommendationsSidebarContentWrapperKeywords = styled(
    RecommendationsSidebarContentWrapper,
)`
    padding: 8px 12px;
`;

RecommendationsSidebarContentWrapper.displayName = "RecommendationsSidebarContentWrapper";

export const RecommendationsIndicatorNumber = styled.div.attrs({})`
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${colorsPalettes.orange[400]};
    color: ${colorsPalettes.carbon[0]};
    font-size: 10px;
    font-weight: 700;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
`;
RecommendationsIndicatorNumber.displayName = "RecommendationsIndicatorNumber";

export const RecommendationsIndicatorText = styled.div`
    color: ${rgba(colorsPalettes.carbon[500], 0.6)};
    font-size: 14px;
    font-weight: 500;
`;
RecommendationsIndicatorText.displayName = "RecommendationsIndicatorText";

const loaderAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const RecommendationsIndicatorLdsRing = styled.div`
    div {
        box-sizing: border-box;
        position: absolute;
        width: 10px;
        height: 10px;
        margin: 3px 0 0 3px;
        border: 1px solid ${colorsPalettes.carbon[0]};
        border-radius: 50%;
        animation: ${loaderAnimation} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: ${colorsPalettes.carbon[0]} transparent transparent transparent;
    }
    div:nth-child(1) {
        animation-delay: -0.45s;
    }
    div:nth-child(2) {
        animation-delay: -0.3s;
    }
    div:nth-child(3) {
        animation-delay: -0.15s;
    }
`;

export const RecommendationIndicatorContentStyle = styled.div`
    position: relative;
    margin-right: 8px;
`;

export const Separator = styled.hr`
    margin: 0;
    border-bottom: 0;
`;

RecommendationsIndicatorLdsRing.displayName = "RecommendationsIndicatorLdsRing";

export const RecommendationsSidebarInfo = styled.div`
    margin: 2px 4px;
`;
RecommendationsSidebarInfo.displayName = "RecommendationsSidebarInfo";

export const ButtonsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 -15px -4px -15px;
    user-select: none;
`;
ButtonsWrapper.displayName = "ButtonsWrapper";

export const RecommendationKeywordTilesContainer = styled.div`
    margin-top: 8px;
`;
export const RecommendationKeywordTileStyled = styled.div`
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    padding: 13px;
    margin: 0 11px 8px 13px;
    box-shadow: 0px 3px 6px 0px rgba(14, 30, 62, 0.08);
    color: ${colorsPalettes.carbon[500]};
    ${HoverIcon} {
        display: none;
    }
    :hover {
        ${HoverIcon} {
            display: initial;
            opacity: 1;
        }
    }
`;

export const RecommendationKeywordStyled = styled.div`
    width: 150px;
    display: flex;
    align-items: center;
    span {
        line-height: 13px;
    }
`;

export const RecommendationKeywordDataStyled = styled.div`
    border-left: 1px solid #e5e7ea;
    padding: 0 8px;
    width: 40px;
`;

export const RecommendationKeywordDataValueStyled = styled.div`
    font-size: 14px;
`;
export const RecommendationKeywordDataTitleStyled = styled.div`
    font-size: 10px;
`;

export const RecommendationsSidebarEmptyStateWrapperKeywords = styled(
    RecommendationsSidebarEmptyStateWrapper,
)``;
