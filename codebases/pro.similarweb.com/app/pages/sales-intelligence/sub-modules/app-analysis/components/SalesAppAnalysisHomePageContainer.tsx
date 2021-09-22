import * as React from "react";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import { NoSearchResultsFound } from "@similarweb/ui-components/dist/autocomplete";
import { ListItemSeparator } from "@similarweb/ui-components/dist/list-item/src/items/ListItemSeparator";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { Tab, TabList, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import { findParentByClass } from "@similarweb/ui-components/dist/utils/index";
import { IAutoCompleteAppItem } from "autocomplete";
import TranslationProvider from "components/WithTranslation/src/TranslationProvider";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { UseCaseHomepage } from "@similarweb/ui-components/dist/homepages";
import groupBy from "lodash/groupBy";
import { AppStoreStr, IRecents } from "userdata";
import {
    generateRecents,
    createAppSearchResultItem,
    getAppResults,
    getRecentsAnalysis,
} from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import HomePageContent from "pages/sales-intelligence/sub-modules/app-analysis/components/HomePage/HomePageContent";
import withSecondaryBarSet from "pages/sales-intelligence/hoc/withSecondaryBarSet";
import PlaceholderComponent from "pages/sales-intelligence/sub-modules/app-analysis/components/PlaceholderComponent";
import { useTranslation } from "components/WithTranslation/src/I18n";
import {
    IAppRecent,
    IWebsiteRecent,
} from "services/solutions2Services/HomepageDataFetchers/HomepageDataFetcherTypes";

const DEFAULT_PAGE_STATE = "apps-performance";

const SalesAppAnalysisHomePageContainer: React.FC = () => {
    const translate = useTranslation();
    const [recents, setRecents] = React.useState<IRecents>([]);
    const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);
    const [query, setQuery] = React.useState("");
    const [isAutocompleteLoading, setAutocompleteLoading] = React.useState(false);
    const autocompleteRef = React.useRef(null);

    React.useEffect(() => {
        const getRecents = async (): Promise<void> => {
            const recentItems = await getRecentsAnalysis("app", true);
            setRecents(recentItems);
        };

        getRecents();
    }, []);

    const handleBodyClick = (e: MouseEvent): void => {
        if (!findParentByClass(e.target as HTMLElement, "AutocompleteWithTabs")) {
            autocompleteRef.current.truncateResults(true);
            setQuery("");
        }
    };

    React.useEffect(() => {
        document.body.addEventListener("click", handleBodyClick, { capture: true });
        return () => {
            document.body.removeEventListener("click", handleBodyClick, { capture: true });
        };
    }, []);

    const autocompleteItemRenderer = ({
        listItems,
    }: {
        listItems: Array<IAutoCompleteAppItem | IAppRecent | IWebsiteRecent>;
    }) => {
        if (query === "") {
            if (listItems.length === 0 || !("data" in listItems[0])) {
                return null;
            }

            return generateRecents(
                listItems as Array<IAppRecent | IWebsiteRecent>,
                { app: DEFAULT_PAGE_STATE },
                <ListItemSeparator key="top-separator">
                    {translate("marketintelligence.companyresearch.websites.home.recentsTitle")}
                </ListItemSeparator>,
            );
        } else {
            if (listItems.length === 0) {
                return <NoSearchResultsFound searchTerm={query} />;
            }

            const groupedResults = groupBy(
                listItems,
                (item: IAutoCompleteAppItem): AppStoreStr => item.store,
            );

            if ("undefined" in groupedResults) {
                return null;
            }

            const tabPanels = (
                <>
                    <TabPanel>
                        <ScrollArea>
                            {"google" in groupedResults &&
                                groupedResults.google.map((item) =>
                                    createAppSearchResultItem(
                                        item as IAutoCompleteAppItem,
                                        DEFAULT_PAGE_STATE,
                                    ),
                                )}
                        </ScrollArea>
                    </TabPanel>
                    <TabPanel>
                        <ScrollArea>
                            {"apple" in groupedResults &&
                                groupedResults.apple.map((item) =>
                                    createAppSearchResultItem(
                                        item as IAutoCompleteAppItem,
                                        DEFAULT_PAGE_STATE,
                                    ),
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
            <UseCaseHomepage
                title={translate("si.apps.home.title")}
                titlePosition="centered"
                titleFontSize={"40px"}
                subtitlePosition="left-aligned"
                subtitle={translate("si.apps.home.subtitle")}
                searchComponents={
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
                bodyText={translate("si.apps.home.recents.title")}
                listItems={[<HomePageContent key={1} />]}
                headerImageUrl={SecondaryHomePageHeaderImageUrl}
            />
        </TranslationProvider>
    );
};

SWReactRootComponent(
    withSecondaryBarSet("SalesIntelligenceAppReview")(SalesAppAnalysisHomePageContainer),
    "SalesAppAnalysisHomePageContainer",
);
