import TranslationProvider from "components/WithTranslation/src/TranslationProvider";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import {
    fetchSavedProperties,
    transformSavedProperties,
} from "pages/research-homepage/pageResources";
import { string } from "prop-types";
import { FunctionComponent } from "react";
import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { WebsiteAnalysisStartPage } from "../../../../.pro-features/pages/module start page/src/website analysis/WebsiteAnalysisStartPage";
import { ListItemSeparator } from "@similarweb/ui-components/dist/list-item";
import { DefaultFetchService } from "services/fetchService";
import { colorsPalettes } from "@similarweb/styles";
import { $robotoFontFamily } from "@similarweb/styles/src/fonts";
import { HomepageWebsiteItem } from "@similarweb/ui-components/dist/homepages";
import {
    generateRecents,
    getWebsiteResults,
    createWebsiteSearchResultItem,
    getRecentsAnalysis,
} from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import useLocalStorage from "custom-hooks/useLocalStorage";
import {
    ProductTours,
    ProductToursLocalStorageKeys,
    showIntercomTour,
} from "services/IntercomProductTourService";

const translate = i18nFilter();
const fetchService = DefaultFetchService.getInstance();

const DEFAULT_PAGE_STATE = "websites-worldwideOverview";

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
        {translate("marketintelligence.companyresearch.websites.home.searchText")}{" "}
        <BoldPlaceholderText>
            {translate("marketintelligence.companyresearch.websites.home.searchItem")}
        </BoldPlaceholderText>
    </PlaceholderText>
);

const onClickRedirect = (url: string): void => {
    window.location.href = url;
};

const createHomepageItems = (items, removeFunc): JSX.Element[] => {
    return transformSavedProperties(
        { items: items.filter((item) => item.data.type === "website") },
        { defaultStateOverride: DEFAULT_PAGE_STATE },
    ).map((item) => {
        return (
            <HomepageWebsiteItem
                key={item.Id}
                domain={item.Name}
                onItemClick={onClickRedirect.bind(null, item.url)}
                onFavoriteClick={removeFunc.bind(null, item.Id)}
                iconSrc={item.Icon}
                isFavorite={true}
            />
        );
    });
};

interface IWebsiteAnalysisStartPageContainerProps {
    pageState?: string;
}

const WebsiteAnalysisStartPageContainer: FunctionComponent<IWebsiteAnalysisStartPageContainerProps> = (
    props,
) => {
    const [favorites, setFavorites] = React.useState<JSX.Element[]>([]);
    const [recents, setRecents] = React.useState([]);
    const [isAutocompleteLoading, setAutocompleteLoading] = React.useState<boolean>(false);
    const [hasViewedProductTour, setViewedProductTour] = useLocalStorage(
        ProductToursLocalStorageKeys.WebAnalysisFullTour,
    );
    const [hasViewedWorkspacesTour, setViewedWorkspacesTour] = useLocalStorage(
        ProductToursLocalStorageKeys.WorkspaceTour,
    );

    const removeFromFavorites = async (id: string): Promise<void> => {
        const newFavorites: any = await fetchService.post(
            `/api/userdata/favorites/remove/${id}`,
            {},
        );
        setFavorites(createHomepageItems(newFavorites.items, removeFromFavorites));
    };

    const onAutocompleteGetData = async (query: string): Promise<JSX.Element[]> => {
        if (query === "") {
            return generateRecents(
                recents,
                { website: DEFAULT_PAGE_STATE },
                <ListItemSeparator key="top-separator">
                    {translate("marketintelligence.companyresearch.websites.home.recentsTitle")}
                </ListItemSeparator>,
            );
        } else {
            setAutocompleteLoading(true);
            const results = await getWebsiteResults(query);
            setAutocompleteLoading(false);
            return results.map((item) => {
                return createWebsiteSearchResultItem(item, DEFAULT_PAGE_STATE);
            });
        }
    };

    React.useEffect(() => {
        if (!hasViewedProductTour) {
            setViewedProductTour("true");
            setViewedWorkspacesTour("true");
            if (hasViewedWorkspacesTour) {
                showIntercomTour(ProductTours.WebAnalysisSearchOnly);
            } else {
                showIntercomTour(ProductTours.WebAnalysis);
            }
        }
    }, []);

    React.useEffect(() => {
        const getFavorites = async (): Promise<void> => {
            const favoriteSites: any = await fetchSavedProperties();

            const items = createHomepageItems(favoriteSites.payload.items, removeFromFavorites);
            setFavorites(items);
        };

        const getRecents = async (): Promise<void> => {
            const recentItems = await getRecentsAnalysis("website", true);
            setRecents(recentItems);
        };

        getFavorites();
        getRecents();
    }, []);

    const autoCompleteProps = {
        placeholder: <PlaceholderComponent />,
        getListItems: onAutocompleteGetData,
        isLoading: isAutocompleteLoading,
    };

    return (
        <TranslationProvider translate={translate}>
            <WebsiteAnalysisStartPage listItems={favorites} autocompleteProps={autoCompleteProps} />
        </TranslationProvider>
    );
};

WebsiteAnalysisStartPageContainer.propTypes = {
    pageState: string,
};

WebsiteAnalysisStartPageContainer.defaultProps = {
    pageState: DEFAULT_PAGE_STATE,
};

export default SWReactRootComponent(
    connect(null, null)(WebsiteAnalysisStartPageContainer),
    "WebsiteAnalysisStartPageContainer",
);
