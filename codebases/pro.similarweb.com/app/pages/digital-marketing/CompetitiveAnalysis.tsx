import {
    HomepageWebsiteCompareItem,
    HomepageWebsiteItem,
} from "@similarweb/ui-components/dist/homepages";
import UseCaseHomePage from "@similarweb/ui-components/dist/homepages/use-case/src/UseCaseHomepage";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import * as React from "react";
import { fetchSavedProperties, transformSavedProperties } from "../research-homepage/pageResources";
import styled from "styled-components";
import { Tabs, TabList, Tab } from "@similarweb/ui-components/dist/tabs";
import {
    getRecentsAnalysis,
    getTransformedItem,
} from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import { AssetsService } from "services/AssetsService";
import { setFont } from "@similarweb/styles/src/mixins";
import { colorsPalettes } from "@similarweb/styles";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { AutocompleteWebsitesBase } from "components/AutocompleteWebsites/AutocompleteWebsitesBase";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { FavoritesService } from "services/favorites/favoritesService";

const translate = i18nFilter();
const defaultWebsitePageState = "competitiveanalysis_website_overview_websiteperformance";

interface ICompetitiveAnalysisHomepageItem {
    Id?: string;
    Type: string;
    Name: string;
    url: string;
    Icon: string;
    addedTime: string;
}
enum ETabs {
    RECENT,
    FAVORITES,
}

const onClickRedirect = (url: string, name): void => {
    TrackWithGuidService.trackWithGuid("digital.marketing.competitive.search.saved", "click", {
        siteName: name,
    });
    window.location.href = url;
};

/**
 * Returns the item Id, or in case no such exists - create a unique id for the item
 * this is used as the item key, to avoid rendering issues in react.
 */
const resolveUniqueItemId = (item: ICompetitiveAnalysisHomepageItem, prefix: string): string => {
    const { Id, Type, Name, addedTime } = item;
    return Id ? Id : `${prefix}_type_${Type};Name_${Name};AddedTime_${addedTime}`;
};

export const createHomepageItems = (
    items,
    removeFunc,
    onClick: (domain: string, competitiveAnalysisUrl: string) => void,
): JSX.Element[] => {
    return items.map((item: ICompetitiveAnalysisHomepageItem) => {
        return (
            <HomepageWebsiteItem
                key={resolveUniqueItemId(item, "favorites")}
                domain={item.Name}
                onItemClick={() => onClick(item.Name, item.url)}
                onFavoriteClick={removeFunc && removeFunc.bind(null, item.Id)}
                iconSrc={item.Icon}
                isFavorite={true}
            />
        );
    });
};

export const createHomePageRecentItem = (
    items = [],
    onClick: (domain: string, competitiveAnalysisUrl: string) => void,
) => {
    return items.map((item, index) => {
        const { mainWebsite, compareItems, url } = getTransformedItem(
            item,
            defaultWebsitePageState,
        );
        if (Array.isArray(compareItems) && compareItems.length) {
            const key = [mainWebsite.domain]
                .concat(compareItems.map(({ domain }) => domain))
                .join(",");
            return (
                <HomepageWebsiteCompareItem
                    key={resolveUniqueItemId(item, `recent_${index}`)}
                    mainItem={{ domain: mainWebsite.domain, iconSrc: mainWebsite.iconUrl }}
                    competitors={compareItems.map(({ domain, iconUrl }) => {
                        return {
                            domain,
                            iconSrc: iconUrl,
                        };
                    })}
                    isFavorite={false}
                    onFavoriteClick={null}
                    onItemClick={() => onClick(key, url)}
                />
            );
        }
        return (
            <HomepageWebsiteItem
                key={resolveUniqueItemId(item, `recent_${index}`)}
                domain={mainWebsite.domain}
                iconSrc={mainWebsite.iconUrl}
                isFavorite={false}
                onFavoriteClick={null}
                onItemClick={() => onClick(mainWebsite.domain, url)}
            />
        );
    });
};

const TabsContainer = styled.span`
    > div {
        display: inline-block;
    }
`;

const EmptyState = styled.div<{ width?: number }>`
    width: ${({ width }) => (width ? `${width}px` : "auto")};
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 51px;
    img {
        margin-bottom: 66px;
    }
`;
const EmptyStateText = styled.div`
    text-align: center;
    ${setFont({ $size: 16, $color: colorsPalettes.carbon["400"] })};
`;

const StyledLoader = styled(PixelPlaceholderLoader)`
    margin-bottom: 12px;
`;

const CompetitiveAnalysisHomepage: React.FC = () => {
    const [loading, setLoading] = React.useState(true);
    const [favorites, setFavorites] = React.useState([]);
    const [recents, setRecents] = React.useState([]);
    const [selectedTab, setSelectedTab] = React.useState<ETabs>(ETabs.RECENT);

    const removeFromFavorites = async (id: string): Promise<void> => {
        const newFavorites: any = await FavoritesService.removeFavoriteById({ id });

        const items = newFavorites?.items
            ? transformSavedProperties(
                  { items: newFavorites?.items.filter((item) => item.data.type === "website") },
                  { defaultStateOverride: defaultWebsitePageState },
              )
            : [];
        setFavorites(items);
    };

    React.useEffect(() => {
        const getFavoritesAndRecents = async (): Promise<void> => {
            const favoriteSitesPromis: any = fetchSavedProperties();
            const recentItemsPromise = getRecentsAnalysis("website", true);
            try {
                const [recentItems, favoriteSites] = await Promise.all([
                    recentItemsPromise,
                    favoriteSitesPromis,
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
                const recentItemsTransformed = (recentItems || []).slice(0, 10);
                setRecents(recentItemsTransformed);
                // if there are no recents, Set the active tab to be favorites
                if (recentItemsTransformed.length === 0 && favoritesItemsTransformed.length > 0) {
                    setSelectedTab(1);
                }
            } finally {
                setLoading(false);
            }
        };
        getFavoritesAndRecents();
    }, []);

    const renderListItems = () => {
        if (loading) {
            return [
                <StyledLoader key="loader-1" width="100%" height={56} />,
                <StyledLoader key="loader-2" width="100%" height={56} />,
                <StyledLoader key="loader-3" width="100%" height={56} />,
                <StyledLoader key="loader-4" width="100%" height={56} />,
                <StyledLoader key="loader-5" width="100%" height={56} />,
            ];
        }
        switch (selectedTab) {
            case ETabs.RECENT:
                if (recents.length === 0) {
                    return [
                        <EmptyState key="recent-empty-state">
                            <img
                                src={AssetsService.assetUrl("/images/empty-state-recent.svg")}
                                width={75}
                                style={{ minHeight: 70 }}
                            />
                            <EmptyStateText>
                                {i18nFilter()(
                                    "aquisitionintelligence.competitiveanalysis.home.recent.emptystate",
                                )}
                            </EmptyStateText>
                        </EmptyState>,
                    ];
                }
                return createHomePageRecentItem(recents, (domain, url) =>
                    onClickRedirect(url, {
                        type: "recent",
                        key: domain,
                    }),
                );
            case ETabs.FAVORITES:
                if (favorites.length === 0) {
                    return [
                        <EmptyState key="favorites-empty-state" width={320}>
                            <img
                                src={AssetsService.assetUrl("/images/empty-state-favorites.svg")}
                                width={205}
                            />
                            <EmptyStateText>
                                {i18nFilter()(
                                    "aquisitionintelligence.competitiveanalysis.home.favorites.emptystate",
                                )}
                            </EmptyStateText>
                        </EmptyState>,
                    ];
                }
                return createHomepageItems(favorites, removeFromFavorites, (domain, url) =>
                    onClickRedirect(url, {
                        type: "favorites",
                        key: domain,
                    }),
                );
        }
    };

    const onTabSelect = (tab: ETabs) => {
        setSelectedTab(tab);
    };

    return (
        <>
            <UseCaseHomePage
                title={translate("aquisitionintelligence.competitiveanalysis.home.title")}
                titlePosition="left-aligned"
                subtitle={translate("aquisitionintelligence.competitiveanalysis.home.subtitle")}
                headerImageUrl={SecondaryHomePageHeaderImageUrl}
                bodyText={
                    <TabsContainer>
                        <Tabs selectedIndex={selectedTab} onSelect={onTabSelect}>
                            <TabList>
                                <Tab>
                                    {translate(
                                        "aquisitionintelligence.competitiveanalysis.recent.listTitle",
                                    )}
                                </Tab>
                                <Tab>
                                    {translate(
                                        "aquisitionintelligence.competitiveanalysis.listTitle",
                                    )}
                                </Tab>
                            </TabList>
                        </Tabs>
                    </TabsContainer>
                }
                searchComponents={
                    <AutocompleteWebsitesBase defaultWebsitePageState={defaultWebsitePageState} />
                }
                listItems={renderListItems()}
            />
        </>
    );
};

SWReactRootComponent(CompetitiveAnalysisHomepage, "CompetitiveAnalysisHomepage");
