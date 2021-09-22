import { colorsPalettes } from "@similarweb/styles";
import { $robotoFontFamily } from "@similarweb/styles/src/fonts";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import { NoSearchResultsFound } from "@similarweb/ui-components/dist/autocomplete";
import HomepageAppItem from "@similarweb/ui-components/dist/homepages/common/UseCaseHomepageItems/HomepageAppItem";
import { ListItemSeparator } from "@similarweb/ui-components/dist/list-item/src/items/ListItemSeparator";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { Tab, TabList, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import { findParentByClass } from "@similarweb/ui-components/dist/utils/index";
import { IAutoCompleteAppItem } from "autocomplete";
import { Injector } from "common/ioc/Injector";
import TranslationProvider from "components/WithTranslation/src/TranslationProvider";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import groupBy from "lodash/groupBy";
import AppAnalysisStartPage from "pages/module start page/src/app analysis/AppAnalysisStartPage";
import * as React from "react";
import styled from "styled-components";
import { AppStoreStr } from "userdata";
import {
    fetchSavedProperties,
    transformSavedProperties,
} from "../../research-homepage/pageResources";
import {
    generateRecents,
    createAppSearchResultItem,
    getAppResults,
    getRecentsAnalysis,
} from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import { FavoritesService } from "services/favorites/favoritesService";

const translate = i18nFilter();
const DEFAULT_PAGE_STATE = "apps-performance";

const PlaceholderText = styled.span`
    color: ${colorsPalettes.carbon["300"]};
    font-family: ${$robotoFontFamily};
    font-size: 14px;
    margin-left: 32px;
`;

const BoldPlaceholderText = styled.span`
    font-weight: 500;
`;

const PlaceholderComponent = (): JSX.Element => (
    <PlaceholderText>
        {translate("marketintelligence.companyresearch.apps.home.searchText")}{" "}
        <BoldPlaceholderText>
            {translate("marketintelligence.companyresearch.apps.home.searchItem")}
        </BoldPlaceholderText>
    </PlaceholderText>
);

const onClickRedirect = (url: string): void => {
    window.location.href = url;
};

const createHomepageItems = (items, removeFunc): JSX.Element[] => {
    return transformSavedProperties(
        { items: items.filter((item) => item.data.type === "app") },
        { defaultStateOverride: DEFAULT_PAGE_STATE },
    ).map((item) => {
        return (
            <HomepageAppItem
                key={item.Id}
                appName={item.Tooltip.Title}
                appStore={item.Tooltip.AppStore}
                appPublisher={item.Tooltip.Author}
                onItemClick={onClickRedirect.bind(null, item.url)}
                onFavoriteClick={removeFunc.bind(null, item.Id)}
                iconSrc={item.Tooltip.Icon}
                isFavorite={true}
            />
        );
    });
};

interface IAppAnalysisStartPageContainerProps {
    pageState?: string;
}

const AppAnalysisStartPageContainer: React.FC<IAppAnalysisStartPageContainerProps> = (props) => {
    const [favorites, setFavorites] = React.useState<JSX.Element[]>([]);
    const [recents, setRecents] = React.useState([]);
    const [selectedTabIndex, setSelectedTabIndex] = React.useState<number>(0);
    const [query, setQuery] = React.useState("");
    const [isAutocompleteLoading, setAutocompleteLoading] = React.useState<boolean>(false);
    const autocompleteRef = React.useRef(null);

    React.useEffect(() => {
        const getFavorites = async (): Promise<void> => {
            const favoriteSites: any = await fetchSavedProperties();

            const items = createHomepageItems(favoriteSites.payload.items, removeFromFavorites);
            setFavorites(items);
        };

        const getRecents = async (): Promise<void> => {
            const recentItems = await getRecentsAnalysis("app", true);
            setRecents(recentItems);
        };

        getFavorites();
        getRecents();
    }, []);

    React.useEffect(() => {
        document.body.addEventListener("click", handleBodyClick, { capture: true });
        return () => {
            document.body.removeEventListener("click", handleBodyClick, { capture: true });
        };
    }, []);

    const handleBodyClick = (e): void => {
        if (!findParentByClass(e.target, "AutocompleteWithTabs")) {
            autocompleteRef.current.truncateResults(true);
            setQuery("");
        }
    };

    const removeFromFavorites = async (id: string): Promise<void> => {
        const newFavorites: any = await FavoritesService.removeFavoriteById({ id });
        setFavorites(createHomepageItems(newFavorites.items, removeFromFavorites));
    };

    const appStorePredicate = (item: IAutoCompleteAppItem): AppStoreStr => {
        return item.store;
    };

    const autocompleteItemRenderer = ({ listItems }) => {
        if (query === "") {
            if (listItems.length === 0 || !("data" in listItems[0])) {
                return null;
            }

            return generateRecents(
                listItems,
                { app: DEFAULT_PAGE_STATE },
                <ListItemSeparator key="top-separator">
                    {translate("marketintelligence.companyresearch.websites.home.recentsTitle")}
                </ListItemSeparator>,
            );
        } else {
            if (listItems.length === 0) {
                return <NoSearchResultsFound searchTerm={query} />;
            }

            const groupedResults = groupBy(listItems, appStorePredicate);
            if ("undefined" in groupedResults) {
                return null;
            }

            const tabPanels = (
                <>
                    <TabPanel>
                        <ScrollArea>
                            {"google" in groupedResults &&
                                groupedResults.google.map((item) =>
                                    createAppSearchResultItem(item, DEFAULT_PAGE_STATE),
                                )}
                        </ScrollArea>
                    </TabPanel>
                    <TabPanel>
                        <ScrollArea>
                            {"apple" in groupedResults &&
                                groupedResults.apple.map((item) =>
                                    createAppSearchResultItem(item, DEFAULT_PAGE_STATE),
                                )}
                        </ScrollArea>
                    </TabPanel>
                </>
            );

            return (
                <div className="ListItemsContainer">
                    <Tabs selectedIndex={selectedTabIndex} onSelect={setSelectedTabIndex}>
                        <TabList>
                            <Tab>Google ({groupedResults?.google?.length ?? 0})</Tab>
                            <Tab>AppStore ({groupedResults?.apple?.length ?? 0})</Tab>
                        </TabList>
                        {tabPanels}
                    </Tabs>
                </div>
            );
        }
    };

    const onAutocompleteGetData = async (query: string) => {
        if (query === "") {
            setQuery(query);
            return recents;
        } else {
            setAutocompleteLoading(true);
            const results = await getAppResults(query);
            setAutocompleteLoading(false);
            setQuery(query);

            return results;
        }
    };

    return (
        <TranslationProvider translate={translate}>
            <AppAnalysisStartPage
                searchComponent={
                    <Autocomplete
                        className="AutocompleteWithTabs"
                        placeholder={<PlaceholderComponent />}
                        loadingComponent={<DotsLoader />}
                        floating={true}
                        debounce={250}
                        getListItems={onAutocompleteGetData}
                        renderItems={autocompleteItemRenderer}
                        isLoading={isAutocompleteLoading}
                        maxResults={8}
                        ref={autocompleteRef}
                        preventTruncateUnlessForced={true}
                    />
                }
                listItems={favorites}
            />
        </TranslationProvider>
    );
};

SWReactRootComponent(AppAnalysisStartPageContainer, "AppAnalysisStartPageContainer");
