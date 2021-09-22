import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { $robotoFontFamily } from "@similarweb/styles/src/fonts";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import TranslationProvider from "components/WithTranslation/src/TranslationProvider";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import GoogleKeywordAnalysisStartPage from "pages/module start page/src/google keyword analysis/KeywordAnalysisStartPage";
import * as React from "react";
import styled from "styled-components";
import {
    getKeywordResults,
    getRecentsAnalysis,
    createGoogleKeywordSearchResultItem,
} from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import { GenericAssetItem } from "@similarweb/ui-components/dist/homepages";

const translate = i18nFilter();
const DEFAULT_PAGE_STATE = "keywords-analysis";

const PlaceholderText = styled.span`
    color: ${colorsPalettes.carbon["300"]};
    font-family: ${$robotoFontFamily};
    font-size: 14px;
    margin-left: 32px;
`;

const BoldPlaceholderText = styled.span`
    font-weight: 500;
`;

const GoogleKeywordHomepageItem = styled(GenericAssetItem)`
    height: 64px;
    .SWReactIcons svg {
        height: 24px;
        width: 24px;
        path {
            fill: ${colorsPalettes.carbon["200"]};
        }
    }
`;

const PlaceholderComponent = (): JSX.Element => (
    <PlaceholderText>
        {translate("research.apps.googleplaykw.home.searchText")}{" "}
        <BoldPlaceholderText>
            {translate("research.apps.googleplaykw.home.searchItem")}
        </BoldPlaceholderText>
    </PlaceholderText>
);

// '/analysis/:keyword/:country/:duration/:category',
const createHomepageItems = (items, onItemClick): JSX.Element[] => {
    return items.map((recent) => {
        const { data } = recent;

        const params = {
            country: data.country,
            category: data.category,
            duration: data.duration,
            keyword: data.keyword,
        };

        return (
            <GoogleKeywordHomepageItem
                key={recent.id}
                className={"homepage-item-googleKeywordAnalysis"}
                primaryText={data.keyword}
                onItemClick={onItemClick(params)}
                iconComponent={<SWReactIcons iconName={"playkeyword"} size="sm" />}
            />
        );
    });
};

const GoogleKeywordAnalysisStartPageContainer: React.FC = () => {
    const [recents, setRecents] = React.useState([]);
    const [isAutocompleteLoading, setAutocompleteLoading] = React.useState<boolean>(false);

    const onAutocompleteGetData = async (query: string) => {
        if (query === "") {
            return [];
        } else {
            setAutocompleteLoading(true);
            const results = await getKeywordResults(query);
            setAutocompleteLoading(false);
            return results.map((item) => {
                return createGoogleKeywordSearchResultItem(item, DEFAULT_PAGE_STATE);
            });
        }
    };

    React.useEffect(() => {
        const getRecents = async (): Promise<void> => {
            const navigator = Injector.get<SwNavigator>("swNavigator");
            const onItemClick = (params) => () => {
                navigator.go(DEFAULT_PAGE_STATE, params);
            };
            const recentItems = await getRecentsAnalysis("googlePlayKeyword", true);
            const items = createHomepageItems(recentItems, onItemClick);
            setRecents(items);
        };

        getRecents();
    }, []);

    return (
        <TranslationProvider translate={translate}>
            <GoogleKeywordAnalysisStartPage
                searchComponent={
                    <Autocomplete
                        className="google-play-autocomplete"
                        placeholder={<PlaceholderComponent />}
                        loadingComponent={<DotsLoader />}
                        floating={true}
                        debounce={250}
                        getListItems={onAutocompleteGetData}
                        isLoading={isAutocompleteLoading}
                        maxResults={8}
                    />
                }
                listItems={recents}
            />
        </TranslationProvider>
    );
};

SWReactRootComponent(
    GoogleKeywordAnalysisStartPageContainer,
    "GoogleKeywordAnalysisStartPageContainer",
);
