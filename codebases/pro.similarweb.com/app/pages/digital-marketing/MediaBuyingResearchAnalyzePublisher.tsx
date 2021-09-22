import { colorsPalettes } from "@similarweb/styles";
import { $robotoFontFamily } from "@similarweb/styles/src/fonts";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import UseCaseHomePage from "@similarweb/ui-components/dist/homepages/use-case/src/UseCaseHomepage";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import * as React from "react";
import { IWebsiteRecent } from "services/solutions2Services/HomepageDataFetchers/HomepageDataFetcherTypes";
import styled from "styled-components";
import {
    getRecentsAnalysis,
    getWebsiteResults,
} from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import { Type, ItemIcon } from "@similarweb/ui-components/dist/item-icon";
import { GenericAssetItem } from "@similarweb/ui-components/dist/homepages";
import {
    createWebsiteSearchResultItem,
    getTransformedItem,
} from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";

const translate = i18nFilter();
const defaultAffiliatePageState = "analyzepublishers_performanceoverview";

const PlaceholderText = styled.span`
    color: ${colorsPalettes.carbon["300"]};
    font-family: ${$robotoFontFamily};
    font-size: 14px;
    margin-left: 32px;
`;

const BoldPlaceholderText = styled.span`
    font-weight: 500;
`;

const PlaceholderComponent = () => (
    <PlaceholderText>
        {translate("aquisitionintelligence.mediabuyingresearch.analyze.home.searchText")}{" "}
        <BoldPlaceholderText>
            {translate("aquisitionintelligence.mediabuyingresearch.analyze.home.searchItem")}
        </BoldPlaceholderText>
    </PlaceholderText>
);

const onClickRedirect = (url: string): void => {
    window.location.href = url;
};

const createHomepageItems = (items): JSX.Element[] => {
    const itemsDeduped = _.uniqBy<IWebsiteRecent>(items, "data.mainItem");
    const transformedItems = itemsDeduped.map((item) =>
        getTransformedItem(item, defaultAffiliatePageState),
    );
    return transformedItems.map(({ mainWebsite, url }) => (
        <GenericAssetItem
            key={mainWebsite.domain}
            className={"homepage-item-affiliates"}
            primaryText={mainWebsite.domain}
            onItemClick={onClickRedirect.bind(null, url)}
            iconComponent={
                <ItemIcon
                    iconType={Type.Website}
                    iconName={mainWebsite.domain}
                    iconSrc={mainWebsite.iconUrl}
                />
            }
        />
    ));
};

export const MediaBuyingResearchAnalyzePublisherHomepage: React.SFC = () => {
    const [recents, setRecents] = React.useState([]);
    const [isAutocompleteLoading, setAutocompleteLoading] = React.useState<boolean>(false);

    const onAutocompleteGetData = async (query: string) => {
        if (query === "") {
            return [];
        } else {
            setAutocompleteLoading(true);
            const results = await getWebsiteResults(query);
            setAutocompleteLoading(false);
            return results.map((item) => {
                return createWebsiteSearchResultItem(item, defaultAffiliatePageState);
            });
        }
    };

    React.useEffect(() => {
        const getRecents = async (): Promise<void> => {
            const recentItems = await getRecentsAnalysis("website");
            const items = createHomepageItems(recentItems);
            setRecents(items);
        };

        getRecents();
    }, []);

    return (
        <UseCaseHomePage
            title={translate("aquisitionintelligence.mediabuyingresearch.analyze.home.title")}
            titlePosition="left-aligned"
            subtitle={translate("aquisitionintelligence.mediabuyingresearch.analyze.home.subtitle")}
            bodyText={translate(
                "aquisitionintelligence.mediabuyingresearch.analyze.home.listTitle",
            )}
            headerImageUrl={SecondaryHomePageHeaderImageUrl}
            searchComponents={
                <Autocomplete
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
    );
};

SWReactRootComponent(
    MediaBuyingResearchAnalyzePublisherHomepage,
    "MediaBuyingResearchAnalyzePublisherHomepage",
);
