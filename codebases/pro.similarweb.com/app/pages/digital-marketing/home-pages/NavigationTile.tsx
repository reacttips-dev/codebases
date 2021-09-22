import styled from "styled-components";
import ABService from "services/ABService";
import { Box } from "@similarweb/ui-components/dist/box";
import { Text } from "./styledComponents";
import { homepageVariationToEventSubName } from "./constants";
import { colorsPalettes, rgba, fonts } from "@similarweb/styles";
import { OrangeStyledPill as OrangePill } from "pages/conversion/ConversionSegment/ConversionSegmentStyles";
import { StyledPill } from "styled components/StyledPill/src/StyledPill";
import { SWReactIcons } from "@similarweb/icons";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { i18nFilter } from "filters/ngFilters";
import { setFont } from "@similarweb/styles/src/mixins";

const BoxStyled = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    width: 100%;
    height: 168px;
    padding: 24px;
    box-sizing: border-box;
    cursor: pointer;
    border: 1px solid transparent;

    &:hover {
        border: 1px solid ${colorsPalettes.carbon[100]};
        box-shadow: 0 3px 5px ${rgba(colorsPalettes.carbon[400], 0.12)};
    }
`;

const TitleContainer = styled.div`
    display: flex;
`;

const Title = styled(Text).attrs(() => ({
    color: colorsPalettes.carbon[500],
}))`
    ${(props) =>
        setFont({
            $size: 20,
            $color: props.color,
            $weight: "500",
            $family: fonts.$dmSansFontFamily,
        })};
    text-transform: capitalize;
    margin-bottom: 12px;
`;

const SubTitle = styled(Text).attrs(() => ({
    color: colorsPalettes.carbon[300],
}))`
    font-size: 14px;
`;

const Category = styled(StyledPill).attrs((props) => ({
    color: props.color ?? colorsPalettes.sky[100],
}))`
    display: flex;
    align-items: center;
    height: 28px;
    padding: 0 8px;
    margin-bottom: 16px;
    border-radius: 14px;
    background-color: ${(props) => props.color};

    > .SWReactIcons > svg > path {
        fill: ${colorsPalettes.carbon[400]};
    }
    > ${Text} {
        color: ${colorsPalettes.carbon[400]};
        font-weight: 500;
        font-size: 12px;
        text-transform: capitalize;
        margin-left: 4px;
    }
`;

const GreenPill = styled(StyledPill)`
    background-color: #4fc3a0;
    margin-left: 5px;
    letter-spacing: 0;
`;

const OrangeStyledPill = styled(OrangePill)`
    letter-spacing: 0;
`;

export interface INavigationTileCategory {
    name: string;
    icon: string;
    color: string;
}

export interface INavigationTileProps {
    category: INavigationTileCategory;
    title: string;
    subTitle: string;
    navigationState: string;
    id: string;
    isNew?: boolean;
    isBeta?: boolean;
    useRedirect?: boolean;
}

const NavigationTileCategory = ({ name, icon, color }: INavigationTileCategory) => (
    <Category color={color}>
        <SWReactIcons iconName={icon} size="xs" />
        <Text>{name}</Text>
    </Category>
);

export const NavigationTile: React.FC<INavigationTileProps> = ({
    category,
    title,
    subTitle,
    isNew,
    isBeta,
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

    const { name: categoryName, ...categoryProps } = category;
    return (
        <BoxStyled onClick={handleNavigation}>
            <NavigationTileCategory {...categoryProps} name={i18n(categoryName)} />
            <TitleContainer>
                <Title>{i18n(title)}</Title>
                {isNew ? (
                    <OrangeStyledPill>NEW</OrangeStyledPill>
                ) : isBeta ? (
                    <GreenPill>BETA</GreenPill>
                ) : null}
            </TitleContainer>
            <SubTitle>{i18n(subTitle)}</SubTitle>
        </BoxStyled>
    );
};
