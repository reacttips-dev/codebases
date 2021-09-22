import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { UseCaseHomepage } from "@similarweb/ui-components/dist/homepages";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { AutocompleteWebsitesBase } from "components/AutocompleteWebsites/AutocompleteWebsitesBase";
import { getRecentsAnalysis } from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import { Tabs, TabList, Tab } from "@similarweb/ui-components/dist/tabs";
import { AssetsService } from "services/AssetsService";
import { majorNavigationTiles, navigationTiles } from "./constants";
import {
    createHomepageItems,
    createHomePageRecentItem,
} from "pages/digital-marketing/CompetitiveAnalysis";
import {
    RedirectTabsContainer,
    RedirectEmptyState,
    RedirectEmptyStateText,
    RedirectStyledLoader,
} from "./styledComponents";
import {
    fetchSavedProperties,
    transformSavedProperties,
} from "pages/research-homepage/pageResources";
import { FavoritesService } from "services/favorites/favoritesService";

enum ETabs {
    RECENT,
    FAVORITES,
}

const defaultWebsitePageState = "competitiveanalysis_website_overview_websiteperformance";

interface IDigitalMarketingRedirectPageProps {
    title: string;
    subTitle: string;
    navigationState: string;
}

const DigitalMarketingRedirectPage: React.FC<IDigitalMarketingRedirectPageProps> = ({
    title,
    subTitle: subtitle,
    navigationState,
}) => {
    const [favorites, setFavorites] = useState([]);
    const [recents, setRecents] = useState([]);
    const [selectedTab, setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const i18n = i18nFilter();
    const swNavigator = Injector.get<SwNavigator>("swNavigator");

    useEffect(() => {
        (async () => {
            try {
                const [recentItems, favoriteSites] = await Promise.all([
                    getRecentsAnalysis("website", true),
                    fetchSavedProperties(),
                ]);
                const favoritesItemsTransformed = transformSavedProperties(
                    {
                        items: favoriteSites.payload.items.filter(
                            (item) => item.data.type === "website",
                        ),
                    },
                    { defaultStateOverride: defaultWebsitePageState },
                );
                setFavorites(favoritesItemsTransformed);
                setRecents((recentItems || []).slice(0, 10));
                // if there are no recents, Set the active tab to be favorites
                if (recentItems.length === 0 && favoritesItemsTransformed.length > 0) {
                    setSelectedTab(1);
                }
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const redirect = (params: Record<string, string>) => {
        swNavigator.go(navigationState, params);
    };

    const removeFromFavorites = async (id: string): Promise<void> => {
        const newFavorites = await FavoritesService.removeFavoriteById({ id });

        const items = newFavorites?.items
            ? transformSavedProperties(
                  { items: newFavorites?.items.filter((item) => item.data.type === "website") },
                  { defaultStateOverride: defaultWebsitePageState },
              )
            : [];
        setFavorites(items);
    };

    const renderListItems = () => {
        if (loading) {
            return [
                <RedirectStyledLoader key="loader-1" width="100%" height={56} />,
                <RedirectStyledLoader key="loader-2" width="100%" height={56} />,
                <RedirectStyledLoader key="loader-3" width="100%" height={56} />,
                <RedirectStyledLoader key="loader-4" width="100%" height={56} />,
                <RedirectStyledLoader key="loader-5" width="100%" height={56} />,
            ];
        }
        switch (selectedTab) {
            case ETabs.RECENT:
                if (recents.length === 0) {
                    return [
                        <RedirectEmptyState key="recent-empty-state">
                            <img
                                src={AssetsService.assetUrl("/images/empty-state-recent.svg")}
                                width={75}
                                style={{ minHeight: 70 }}
                            />
                            <RedirectEmptyStateText>
                                {i18nFilter()(
                                    "aquisitionintelligence.competitiveanalysis.home.recent.emptystate",
                                )}
                            </RedirectEmptyStateText>
                        </RedirectEmptyState>,
                    ];
                }
                return createHomePageRecentItem(recents, (key) => redirect({ key }));
            case ETabs.FAVORITES:
                if (favorites.length === 0) {
                    return [
                        <RedirectEmptyState key="favorites-empty-state" width={320}>
                            <img
                                src={AssetsService.assetUrl("/images/empty-state-favorites.svg")}
                                width={205}
                            />
                            <RedirectEmptyStateText>
                                {i18nFilter()(
                                    "aquisitionintelligence.competitiveanalysis.home.favorites.emptystate",
                                )}
                            </RedirectEmptyStateText>
                        </RedirectEmptyState>,
                    ];
                }
                return createHomepageItems(favorites, removeFromFavorites, (key) =>
                    redirect({ key }),
                );
        }
    };

    const onTabSelect = (tab: ETabs) => {
        setSelectedTab(tab);
    };

    return (
        <UseCaseHomepage
            title={i18n(title)}
            subtitle={i18n(subtitle)}
            titlePosition="left-aligned"
            listItems={renderListItems()}
            headerImageUrl={SecondaryHomePageHeaderImageUrl}
            bodyText={
                <RedirectTabsContainer>
                    <Tabs selectedIndex={selectedTab} onSelect={onTabSelect}>
                        <TabList>
                            <Tab>
                                {i18n(
                                    "aquisitionintelligence.competitiveanalysis.recent.listTitle",
                                )}
                            </Tab>
                            <Tab>
                                {i18n("aquisitionintelligence.competitiveanalysis.listTitle")}
                            </Tab>
                        </TabList>
                    </Tabs>
                </RedirectTabsContainer>
            }
            searchComponents={
                <AutocompleteWebsitesBase defaultWebsitePageState={navigationState} />
            }
        />
    );
};

const mapStateToProps = ({ routing: { params } }) => {
    const { id } = params;
    const selectedTile: any = navigationTiles
        .concat(majorNavigationTiles as any[])
        .find((tile) => tile.id === id);

    return { ...selectedTile, subtitle: selectedTile.redirectPageText ?? selectedTile.subTitle };
};

const connected = connect(mapStateToProps)(DigitalMarketingRedirectPage);
SWReactRootComponent(connected, "DigitalMarketingRedirect");
