import styled from "styled-components";
import { Box } from "@similarweb/ui-components/dist/box";
import { SWReactIcons } from "@similarweb/icons";
import { Text } from "./styledComponents";
import { homepageVariationToEventSubName } from "./constants";
import { colorsPalettes, rgba, fonts } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { i18nFilter } from "filters/ngFilters";
import ABService from "services/ABService";
import React from "react";

const BoxStyled = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 158px;
    text-align: center;
    padding: 16px;
    box-sizing: border-box;
    cursor: pointer;
    border: 1px solid transparent;

    &:hover {
        border: 1px solid ${colorsPalettes.carbon[100]};
        box-shadow: 0 3px 5px ${rgba(colorsPalettes.carbon[400], 0.12)};
    }
`;

const SWReactIconsStyled = styled(SWReactIcons)`
    margin-bottom: 16px;
`;

const Title = styled(Text).attrs(() => ({
    color: colorsPalettes.carbon[500],
}))`
    ${(props) =>
        setFont({
            $size: 16,
            $weight: "500",
            $color: props.color,
            $family: fonts.$dmSansFontFamily,
        })};
    display: flex;
    text-transform: capitalize;
    margin-bottom: 4px;
`;

const SubTitle = styled(Text).attrs(() => ({
    color: colorsPalettes.carbon[300],
}))`
    font-size: 14px;
`;

export interface IMajorNavigationTileProps {
    iconName: string;
    title: string;
    subTitle: string;
    navigationState: string;
    id: string;
    useRedirect?: boolean;
    redirectPageText?: string;
}

export const MajorNavigationTile: React.FC<IMajorNavigationTileProps> = ({
    iconName,
    title,
    subTitle,
    navigationState,
    id,
    useRedirect = false,
}) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const i18n = i18nFilter();

    const handleNavigation = () => {
        const vwoDMIHomepageVariation = ABService.getFlag("vwoDMIHomepageVariation");
        TrackWithGuidService.trackWithGuid("dmi-homepage.tile.click", "click", {
            // eslint-disable-next-line @typescript-eslint/camelcase
            item_name: i18n(title),
            // eslint-disable-next-line @typescript-eslint/camelcase
            layout_version: homepageVariationToEventSubName[vwoDMIHomepageVariation],
        });
        if (useRedirect) {
            swNavigator.go("digitalMarketingRedirect", { id });
        } else {
            swNavigator.go(navigationState);
        }
    };

    return (
        <BoxStyled onClick={handleNavigation}>
            <SWReactIconsStyled iconName={iconName} size="xl" />
            <Title>{i18n(title)}</Title>
            <SubTitle>{i18n(subTitle)}</SubTitle>
        </BoxStyled>
    );
};
