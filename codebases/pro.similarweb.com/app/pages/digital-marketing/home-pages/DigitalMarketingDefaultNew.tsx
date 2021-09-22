import React, { useState } from "react";
import * as _ from "lodash";
import { AssetsService } from "services/AssetsService";
import { AutocompleteDigitalMarketing } from "components/AutocompleteDigitalMarketing/AutocompleteDigitalMarketing";
import { swSettings } from "common/services/swSettings";
import {
    PageContainer,
    TilesGroup,
    HeaderContentContainer,
    AutocompleteWrapper,
    PrimaryHomepageHeaderStyled,
    HeaderTitle,
    HeaderSubtitle,
    HomepageBodyTextStyled,
    TilesContainer,
} from "./styledComponents";
import { MajorNavigationTile } from "./MajorNavigationTile";
import { NavigationTile } from "./NavigationTile";
import { i18nFilter } from "filters/ngFilters";
import ABService, { EVwoDMIHomepageVariation } from "services/ABService";
import {
    majorNavigationTiles as majorNavigationTilesConfig,
    navigationTiles as navigationTilesConfig,
} from "./constants";

const headerImageUrl = AssetsService.assetUrl("/images/primary-home-page-header.png");

export const DigitalMarketingDefault: React.FC = () => {
    const [autocompleteOpen, setAutocompleteOpen] = useState<boolean>(false);
    const i18n = i18nFilter();
    const userFirstName = _.capitalize(swSettings.user.firstname);
    const vwoDMIHomepageVariation = ABService.getFlag("vwoDMIHomepageVariation");
    const userProductKey = swSettings.components.Home.resources.ProductKey;

    const majorNavigationTiles =
        vwoDMIHomepageVariation === EVwoDMIHomepageVariation.Variation2
            ? majorNavigationTilesConfig
                  .concat(navigationTilesConfig as any[])
                  // if tile doesn't have an iconName prop than it should be rendered as a MajorNavigationTile
                  .filter((tile) => !!tile.iconName)
            : majorNavigationTilesConfig;

    const tileFilter = (row) =>
        // if no userTypes were set
        row.userTypes == undefined ||
        // if user is not no touch
        userProductKey == null ||
        // if user is no touch and can view tile
        row.userTypes?.includes(userProductKey);

    return (
        <PageContainer>
            <PrimaryHomepageHeaderStyled imageUrl={headerImageUrl}>
                <HeaderContentContainer>
                    <div>
                        <HeaderTitle>
                            {i18n("digitalmarketing.homepage.header.title", {
                                name: userFirstName,
                            })}
                        </HeaderTitle>
                        <HeaderSubtitle>
                            {i18n("digitalmarketing.homepage.header.subtitle")}
                        </HeaderSubtitle>
                    </div>
                    <AutocompleteWrapper
                        isCollapsed={!autocompleteOpen}
                        isFocused={autocompleteOpen}
                    >
                        <AutocompleteDigitalMarketing
                            includeKeywordsData
                            maxCompareItemsToDisplay={1}
                            onAutocompleteOpen={() => setAutocompleteOpen(true)}
                            onAutocompleteClose={() => setAutocompleteOpen(false)}
                        />
                    </AutocompleteWrapper>
                </HeaderContentContainer>
            </PrimaryHomepageHeaderStyled>
            <TilesGroup>
                <HomepageBodyTextStyled>
                    {i18n("digitalmarketing.homepage.featured.tiles.title")}
                </HomepageBodyTextStyled>
                <TilesContainer tilesPerRow={4}>
                    {majorNavigationTiles.filter(tileFilter).map((tile) => (
                        <MajorNavigationTile key={tile.title} {...tile} />
                    ))}
                </TilesContainer>
            </TilesGroup>
            {vwoDMIHomepageVariation === EVwoDMIHomepageVariation.Variation1 && (
                <TilesGroup>
                    <HomepageBodyTextStyled>
                        {i18n("digitalmarketing.homepage.tiles.title")}
                    </HomepageBodyTextStyled>
                    <TilesContainer tilesPerRow={3}>
                        {navigationTilesConfig.filter(tileFilter).map((tile) => (
                            <NavigationTile key={tile.title} {...tile} />
                        ))}
                    </TilesContainer>
                </TilesGroup>
            )}
        </PageContainer>
    );
};
