import { AutocompleteWebsitesRecent } from "components/AutocompleteWebsites/AutocompleteWebsitesRecent.tsx";
import HomepageWebsiteItem from "@similarweb/ui-components/dist/homepages/common/UseCaseHomepageItems/HomepageWebsiteItem";
import UseCaseHomePage from "@similarweb/ui-components/dist/homepages/use-case/src/UseCaseHomepage";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { SecondaryHomePageHeaderImageUrl } from "pages/digital-marketing/KeywordResearchKeywordGap";
import * as React from "react";
import { DefaultFetchService } from "services/fetchService";
import { fetchSavedProperties, transformSavedProperties } from "../research-homepage/pageResources";

const translate = i18nFilter();
const fetchService = DefaultFetchService.getInstance();
const defaultWebsitePageState = "companyresearch_website_websiteperformance";

const onClickRedirect = (url: string): void => {
    window.location.href = url;
};

const createHomepageItems = (items, removeFunc): JSX.Element[] => {
    return transformSavedProperties(
        { items: items.filter((item) => item.data.type === "website") },
        { defaultStateOverride: defaultWebsitePageState },
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

export const CompanyResearchAnalyzeWebsiteHomepage: React.SFC = () => {
    const [favorites, setFavorites] = React.useState<JSX.Element[]>([]);

    const removeFromFavorites = async (id: string): Promise<void> => {
        const newFavorites: any = await fetchService.post(
            `/api/userdata/favorites/remove/${id}`,
            {},
        );
        setFavorites(createHomepageItems(newFavorites.items, removeFromFavorites));
    };

    React.useEffect(() => {
        const getFavorites = async (): Promise<void> => {
            const favoriteSites: any = await fetchSavedProperties();

            const items = createHomepageItems(favoriteSites.payload.items, removeFromFavorites);
            setFavorites(items);
        };

        getFavorites();
    }, []);

    return (
        <UseCaseHomePage
            title={translate("marketintelligence.companyresearch.websites.home.title")}
            titlePosition="left-aligned"
            subtitle={translate("marketintelligence.companyresearch.websites.home.subtitle")}
            bodyText={translate("marketintelligence.companyresearch.websites.home.listTitle")}
            headerImageUrl={SecondaryHomePageHeaderImageUrl}
            searchComponents={
                <AutocompleteWebsitesRecent defaultWebsitePageState={defaultWebsitePageState} />
            }
            listItems={favorites}
        />
    );
};

SWReactRootComponent(
    CompanyResearchAnalyzeWebsiteHomepage,
    "CompanyResearchAnalyzeWebsiteHomepage",
);
