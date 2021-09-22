import { SWReactIcons } from "@similarweb/icons";
import { Box } from "@similarweb/ui-components/dist/box";
import { ItemIcon } from "@similarweb/ui-components/dist/item-icon";
import { Title } from "@similarweb/ui-components/dist/title";
import { Flex } from "pages/Leading Folders/src/LeadingFoldersInfoPanel";
import * as React from "react";
import styled from "styled-components";
import StyledDarkBoxSubtitle from "../../../../../../styled components/StyledBoxSubtitle/src/StyledDarkBoxSubtitle";
import { FlexColumn, FlexRow } from "../../../../../../styled components/StyledFlex/src/StyledFlex";
import { StyledMetric } from "./Metric";

const br0 = "500px";
const br1 = "740px";
const br2 = "840px";
const br3 = "1000px";
const br4 = "1280px";

export const HeaderContainer: any = styled(Box)`
    width: 100%;
    height: auto;
    font-family: Roboto;
    .lod-100 {
        width: 100%;
    }
    .li-lod {
        height: 89px;
    }
    .px-lod {
        margin-bottom: 8px;
    }
    .px-lod:last-child {
        margin-bottom: 101px;
    }
`;
HeaderContainer.displayName = "HeaderContainer";

export const AppDescription: any = styled(FlexColumn)`
    width: 60%;
    padding-top: 24px;
    padding-left: 24px;
    .Button-track {
        margin-top: -2px;
        margin-left: 8px;
        &.Button-track--tracking {
          div {color: #2a3d53;}
          width: 102px !important;
          border: 1px solid rgba(42, 62, 82, 0.4);
          :hover {
            border: 1px solid #4f8df9;
            width: 102px !important;
            div { display: none; }
            :after {
              content: "${(props: any) => props.untrackText}";
              font-size: 14px;
              font-weight: 500;
              font-family: Roboto;
            }
          }
        }
    }
    .Button-track-mobile {
      margin-top: 2px;
      font-size: 12px;
    }
    @media (max-width: ${br1}) {
      width: 100%;
      padding-right: 24px;
    }
`;
AppDescription.displayName = "AppDescription";

export const LoadersBody: any = styled(FlexColumn)`
    padding: 24px 24px 0 24px;
`;
LoadersBody.displayName = "LoadersBody";

export const AppTitle: any = styled(Title)`
    margin-left: 8px;
    line-height: 1.4;
    :hover {
        color: #4e8cf9;
    }
`;
AppTitle.displayName = "AppTitle";

export const MobileAppTitle: any = styled(AppTitle)`
    font-size: 16px;
    line-height: 2.1;
`;
MobileAppTitle.displayName = "MobileAppTitle";

export const TitleLink: any = styled.a`
    display: flex;
    flex-direction: row;
    text-decoration: none;
`;
TitleLink.displayName = "TitleLink";

export const StyledSubtitle: any = styled(StyledDarkBoxSubtitle)`
    margin-top: 16px;
    margin-bottom: 32px;
`;
StyledSubtitle.displayName = "StyledSubtitle";

export const Desc: any = styled.div`
    color: rgba(42, 62, 82, 0.8);
    margin-bottom: 32px;
    font-size: 14px;
`;
Desc.displayName = "Desc";

export const RelatedWebsitesContainer: any = styled.div`
    height: 83px;
`;
RelatedWebsitesContainer.displayName = "RelatedWebsitesContainer";

export const RelatedWebsitesTitle: any = styled.div`
    color: #2a3e52;
    font-size: 16px;
`;
RelatedWebsitesTitle.displayName = "RelatedWebsitesTitle";

export const RelatedWebsitesRow: any = styled(FlexRow)`
    max-width: 230px;
    overflow: hidden;
`;
RelatedWebsitesRow.displayName = "RelatedWebsitesRow";

export const WebsiteIcon: any = styled(ItemIcon)`
    margin: 16px 16px 16px 0px;
`;
WebsiteIcon.displayName = "WebsiteIcon";

export const RatingNum: any = styled.span`
    margin-right: 8px;
    line-height: 1.3;
    @media (max-width: ${br0}) {
        line-height: 1.8;
    }
`;
RatingNum.displayName = "RatingNum";

export const AppScreenshots: any = styled(FlexRow)`
    width: 40%;
    justify-content: center;
    @media (max-width: ${br1}) {
        display: none;
    }
`;
AppScreenshots.displayName = "AppScreenshots";

export const Metrices: any = styled(FlexRow)`
    width: 100%;
    border-top: 1px solid #e5e7ea;
    @media (max-width: ${br2}) {
        flex-wrap: wrap;
    }
    @media (max-width: ${br0}) {
        border-top: 2px solid #efefef;
    }
`;
Metrices.displayName = "Metrices";

export const AppInfoBtn: any = styled(FlexRow)`
    justify-content: space-between;
    height: 24px;
    color: #4e8cf9;
    font-size: 14px;
    font-weight: 400;
    padding: 13px 16px;
    border-top: 2px solid #efefef;
    cursor: pointer;
    user-select: none;
    line-height: 1.9;
    svg {
        width: 22px;
        path {
            fill: #4f8df9;
            fill-opacity: 1;
        }
    }
`;
AppInfoBtn.displayName = "AppInfoBtn";

export const LoadingMetric: any = styled(StyledMetric)`
    border-right: none;
    svg {
        height: 44px;
    }
`;
LoadingMetric.displayName = "LoadingMetric";

export const Frames: any = styled(FlexRow)`
    opacity: ${({ appear }) => (appear ? 1 : 0)};
    position: relative;
    width: 213px;
    padding-top: 24px;
    transition: opacity 0.3s ease-in;
    @media (max-width: ${br3}) {
        transform: ${({ isLandscape }) => (isLandscape ? "scale3d(0.8, 0.8, 1)" : "none")};
    }
    @media (max-width: ${br4}) {
        margin-left: ${({ isLandscape }) => (isLandscape ? "-20px" : "0px")};
    }
`;
Frames.displayName = "Frames";

export const PortraitFrame: any = styled.div`
    position: relative;
    left: ${(props: any) => (props.index === 0 ? "0px" : props.index * 50 * -1 + "%")};
    transform: ${(props: any) => (props.index === 0 ? "scale3d(1.02, 1.02, 1.02)" : "none")};
    width: 120px;
    height: 212px;
    flex-shrink: 0;
    border-radius: 11.4px;
    background-color: #ffffff;
    padding: 15px 10px 27px 12px;
    box-shadow: ${(props: any) =>
        props.index === 0 ? "0 2px 6px 0 rgba(0, 0, 0, 0.2)" : "0 2px 6px 0 rgba(0, 0, 0, 0.16)"};
    z-index: ${(props: any) => props.zIndex};
    img {
        height: 100%;
    }
`;
PortraitFrame.displayName = "PortraitFrame";

export const LandscapeFrame: any = styled(PortraitFrame)`
    transform: rotate(90deg);
    border: 2px solid #e2e2e2;
    box-shadow: ${({ index }) =>
        index === 0 ? "5px 5px 7px 0 rgba(0,0,0,0.09)" : "5px -4px 7px 0 rgba(0,0,0,0.05)"};
    img {
        transform: rotate(-90deg) translate3d(-47px, -47px, 0px);
        height: auto;
        max-width: 212px;
    }
`;
LandscapeFrame.displayName = "LandscapeFrame";

export const Screenshot: any = styled.div`
    width: auto;
    height: 100%;
    border: 0.92px solid #e2e2e2;
`;
Screenshot.displayName = "Screenshot";

export const EmptyScreenshot: any = styled(Screenshot)`
    display: flex;
    align-items: center;
    justify-content: center;
    background: #d3dbe3;
`;
EmptyScreenshot.displayName = "EmptyScreenshot";

export const Unknown: any = styled(SWReactIcons).attrs({
    iconName: "unknown",
})`
    width: 50%;
`;
Unknown.displayName = "Unknown";

export const HiddenImages: any = styled.div`
    display: none;
`;
