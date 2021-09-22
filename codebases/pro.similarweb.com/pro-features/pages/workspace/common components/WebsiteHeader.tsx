import { colorsPalettes, rgba } from "@similarweb/styles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { ItemIcon } from "@similarweb/ui-components/dist/item-icon";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import React from "react";
import styled, { css } from "styled-components";

import I18n from "../../../../app/components/React/Filters/I18n";
import {
    ANALYSIS_TAB,
    DASHBOARDS_TAB,
    FEED_TAB,
    LIST_SETTING_FEED,
} from "../../../../app/pages/workspace/common/consts";
import { AssetsService } from "../../../../app/services/AssetsService";
import { Type } from "../../app performance/src/page/StyledComponents";

export interface IScroll {
    scroll: boolean;
    src?: any;
}

const Container = styled.div<IScroll>`
    background: ${colorsPalettes.blue[500]};
    transition: all 0.3s ease-out;
    height: ${(props) => (props.scroll ? "104px" : "224px")};
    width: 100%;
    position: absolute;
    box-sizing: border-box;
    padding: 24px;
    overflow: hidden;
    top: 0;
    left: 0;
    z-index: 6;
    .ItemIcon.ItemIcon--website {
        width: 24px;
        height: 24px;
    }
`;

const Title = styled.div<IScroll>`
    font-weight: 500;
    color: ${colorsPalettes.carbon[0]};
    font-family: "Roboto";
    position: absolute;
    line-height: 24px;
    top: ${(props) => (props.scroll ? "16px" : "20px")};
    font-size: ${(props) => (props.scroll ? "14px" : "25px")};
    left: 36px;
    z-index: 2;
    transition: all 0.3s ease-out;
    display: flex;
    align-items: center;
`;

interface IDescription extends IScroll {
    hasData: boolean;
}

const Description = styled.div<IDescription>`
    position: absolute;
    top: 52px;
    left: 36px;
    width: 368px;
    color: ${rgba(colorsPalettes.carbon[0], 0.8)};
    transition: all 0.3s ease-out;
    opacity: ${(props) => (props.scroll || !props.hasData ? 0 : 1)};
    height: ${(props) => (props.scroll ? 0 : "40px")};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const WebsiteText = styled.span`
    margin-left: 8px;
`;

const WebsiteLink = styled.a`
    margin-bottom: -4px;
    &,
    &:hover {
        .SWReactIcons svg path {
            fill: ${colorsPalettes.carbon[0]};
        }
    }
`;

const Gradient = styled.div`
    background-image: linear-gradient(180deg, rgba(15, 21, 50, 0) 0%, rgba(15, 21, 50, 0.9) 100%);
    height: 104px;
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    opacity: 1;
    z-index: 1;
    transition: all 0.3s ease-out;
    display: flex;
    align-items: flex-end;
    justify-content: center;
`;

const ImgContainer = styled.div<IScroll>`
    opacity: 0.6;
    border-radius: 6px;
    border: 10px solid #111b42;
    position: absolute;
    background-color: black;
    bottom: ${(props) => (props.scroll ? "-130px" : "-100px")};
    left: 35px;
    transition: all 0.3s ease-out;
    width: 350px;
    height: 200px;
    overflow: hidden;
`;

const Img = styled.img<{ isAdultSite: boolean }>`
    width: 100%;
    ${(props) =>
        props.isAdultSite &&
        css`
            transform: translateY(-25%);
        `}
`;

interface ISelected {
    selected: boolean;
}

export const Tab = styled.div<ISelected>`
    flex-basis: 33%;
    flex-grow: 1;
    margin-bottom: 3px;
    height: 48px;
    box-sizing: border-box;
    padding: 12px 24px;
    color: #ffffff;
    opacity: 0.6;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.5px;
    line-height: 24px;
    text-align: center;
    transition: all 0.2s linear;
    cursor: pointer;
    backface-visibility: hidden;
    transform: translateZ(0) scale(1, 1);
    user-select: none;
    text-transform: uppercase;
    box-shadow: 0 3px ${rgba(colorsPalettes.orange[400], 0)};
    :hover {
        opacity: 0.8;
    }
    ${(props) =>
        props.selected &&
        css`
            && {
                opacity: 1;
                box-shadow: 0 3px ${rgba(colorsPalettes.orange[400], 1)};
            }
        `}
`;

export const WebsiteHeader = ({
    domain,
    favicon,
    largeImage,
    category,
    scroll,
    selectedTab,
    unsupportedFeatures,
    onTabSelect,
    description,
}) => {
    const isAdultSite = category && category.toLowerCase() === "adult";
    const imageSrc = isAdultSite ? AssetsService.assetUrl("/images/adult-large.png") : largeImage;
    return (
        <Container scroll={scroll}>
            <Title scroll={scroll}>
                <ItemIcon iconType={Type.Website} iconName={""} iconSrc={favicon} />
                <WebsiteText>{domain}</WebsiteText>
                <WebsiteLink
                    href={`http://${domain}`}
                    target={"_blank"}
                    data-automation="website-header-link-out"
                >
                    <IconButton type="flat" iconName="link-out" iconSize="xs" />
                </WebsiteLink>
            </Title>
            <Description scroll={scroll} hasData={description}>
                <PopupHoverContainer
                    content={() => <span>{description}</span>}
                    config={{
                        placement: "bottom",
                        width: 360,
                        cssClassContainer:
                            "Popup-element-wrapper-triangle sidebar-website-header-popup-triangle",
                    }}
                >
                    <div>{description}</div>
                </PopupHoverContainer>
            </Description>
            <ImgContainer scroll={scroll} src={imageSrc}>
                <Img src={imageSrc} isAdultSite={isAdultSite} />
            </ImgContainer>
            <Gradient>
                {!unsupportedFeatures.has(LIST_SETTING_FEED) && (
                    <Tab selected={selectedTab === FEED_TAB} onClick={() => onTabSelect(FEED_TAB)}>
                        <I18n>workspace.analysis_sidebar.tab.alerts</I18n>
                    </Tab>
                )}
                <Tab
                    selected={selectedTab === ANALYSIS_TAB}
                    onClick={() => onTabSelect(ANALYSIS_TAB)}
                >
                    <I18n>workspace.analysis_sidebar.tab.analysis</I18n>
                </Tab>
                <Tab
                    selected={selectedTab === DASHBOARDS_TAB}
                    onClick={() => onTabSelect(DASHBOARDS_TAB)}
                >
                    <I18n>workspace.analysis_sidebar.tab.dashboards</I18n>
                </Tab>
            </Gradient>
        </Container>
    );
};
