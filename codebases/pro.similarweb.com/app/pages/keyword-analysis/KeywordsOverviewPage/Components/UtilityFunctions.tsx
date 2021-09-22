import { abbrNumberFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";
import {
    SERP_IDS,
    SERP_MAP,
} from "pages/website-analysis/traffic-sources/search/components/serp/SerpTypes";
import React, { ReactElement } from "react";
import {
    SerpFeaturesKeywordItem,
    SerpFeaturesKeywordListItem,
} from "./serp-features/SERPFeaturesComponents";
import { ListItemWebsite } from "@similarweb/ui-components/dist/list-item";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

const serpOrderPreferenceArray: SERP_IDS[] = [
    SERP_IDS.FEATURED_SNIPPET,
    SERP_IDS.PRODUCT_LISTING_ADS,
    SERP_IDS.INSTANT_ANSWERS,
    SERP_IDS.RELATED_QUESTIONS,
    SERP_IDS.KNOWLEDGE_FEED,
    SERP_IDS.SITE_LINKS,
    SERP_IDS.NEWS,
    SERP_IDS.IMAGES,
    SERP_IDS.VIDEO,
    SERP_IDS.RELATED_SEARCHES,
    SERP_IDS.POPULAR_PRODUCTS,
    SERP_IDS.TWITTER_FEED,
    SERP_IDS.APPS,
    SERP_IDS.FLIGHTS,
    SERP_IDS.HOTELS,
    SERP_IDS.JOB_LISTINGS,
    SERP_IDS.LOCAL_PACK,
    SERP_IDS.RECIPES,
    SERP_IDS.SHOWCASE_SHOPPING_ADS,
];

const MAX_KEYWORDS = 5;
const MaxNumberWithoutFormatting = 10000;

export const getSeeMoreCount = (amount) => {
    const basicFilteredAmount = abbrNumberFilter()(amount);
    return amount < MaxNumberWithoutFormatting ? amount : basicFilteredAmount;
};

export const groupFilter = (groupId) => {
    const id = groupId?.substr(1);
    return keywordsGroupsService.findGroupById(id).Name;
};

const serpWithoutSitesSort = (serpObjA, serpObjB) => {
    return (
        serpOrderPreferenceArray.indexOf(serpObjA.id) -
        serpOrderPreferenceArray.indexOf(serpObjB.id)
    );
};
// sort by # of linked domains. If equal, then according to specified serp feature order.
const serpWithSitesSort = (serpObjA, serpObjB) => {
    if (serpObjA.sites.length > serpObjB.sites.length) return -1;
    if (serpObjA.sites.length < serpObjB.sites.length) return 1;
    return serpWithoutSitesSort(serpObjA.serpProps, serpObjB.serpProps);
};

const buildSerpWithoutSitesComponents = (itemsToBuild): ReactElement[] => {
    return itemsToBuild.map((item) => (
        <SerpFeaturesKeywordItem key={item.id} name={item.name} iconName={item.icon} />
    ));
};

const buildSerpWithSitesComponents = (itemsToBuild): ReactElement[] => {
    return itemsToBuild.map(({ serpProps, sites }) => (
        <SerpFeaturesKeywordItem
            key={serpProps.id}
            name={serpProps.name}
            iconName={serpProps.icon}
            linkedDomainsToRender={buildLinkedDomainsComponents(sites.slice(0, 5))}
            linkedDomainsLength={sites.length}
        />
    ));
};

const buildLinkedDomainsComponents = (domains): ReactElement[] => {
    return domains.map((domain) => (
        <ListItemWebsite key={domain.Site} text={domain.Site} img={domain.Favicon} />
    ));
};

export const buildSingleKeywordItems = (serpFeaturesData): ReactElement[] => {
    const innerData = serpFeaturesData.Data;
    const serpWithoutSitesRawItems = [];
    const serpWithSitesRawItems = [];

    Object.keys(innerData).forEach((serpType) => {
        const serpProps = SERP_MAP[serpType];
        // check that the current serp feature has linked domains (additionally we
        // check that the first domain has a value because the BE sometimes returns
        // a domain entry but with an empty domain name)
        if (
            innerData[serpType][0].Sites?.length !== 0 &&
            !(
                innerData[serpType][0].Sites?.length === 1 &&
                innerData[serpType][0].Sites[0].Site === ""
            )
        ) {
            const innerDataWithoutEmptySiteData = innerData[serpType][0].Sites.filter(
                (site) => site.Site !== "",
            );
            serpWithSitesRawItems.push({ serpProps, sites: innerDataWithoutEmptySiteData });
        } else {
            serpWithoutSitesRawItems.push(serpProps);
        }
    });
    serpWithSitesRawItems.sort(serpWithSitesSort);
    serpWithoutSitesRawItems.sort(serpWithoutSitesSort);

    return [
        ...buildSerpWithSitesComponents(serpWithSitesRawItems),
        ...buildSerpWithoutSitesComponents(serpWithoutSitesRawItems),
    ];
};

export const buildKeywordListItems = (serpFeaturesData, trafficShareData): ReactElement[] => {
    const innerData = serpFeaturesData.Data;
    const innerTrafficShareData = trafficShareData.Data;
    // sorting order is by # of associated keywords from the keyword list, and in event of equality,
    // according to the serpOrderPreferenceArray order
    const orderedSerpTypes = Object.keys(innerData).sort((serpA, serpB) => {
        if (innerData[serpA].length > innerData[serpB].length) return -1;
        if (innerData[serpA].length < innerData[serpB].length) return 1;
        return (
            serpOrderPreferenceArray.indexOf(serpA as SERP_IDS) -
            serpOrderPreferenceArray.indexOf(serpB as SERP_IDS)
        );
    });

    // for each serp feature, extract the top five associated keywords based on traffic share
    return orderedSerpTypes.map((serpType) => {
        const serpProps = SERP_MAP[serpType];
        const linkedKeywords = innerData[serpType].map(
            (serpTypeArrayElement) => serpTypeArrayElement.Keyword,
        );
        let topFiveKeywords = [];
        if (!innerTrafficShareData.length) {
            topFiveKeywords = linkedKeywords.slice(0, 5);
        } else {
            for (let i = 0; i < innerTrafficShareData.length; i++) {
                if (linkedKeywords.includes(innerTrafficShareData[i].Keyword)) {
                    topFiveKeywords.push(innerTrafficShareData[i].Keyword);
                }
                if (topFiveKeywords.length === MAX_KEYWORDS) break;
            }
        }
        return (
            <SerpFeaturesKeywordListItem
                key={serpProps.id}
                name={serpProps.name}
                iconName={serpProps.icon}
                topLinkedKeywords={topFiveKeywords}
                linkedKeywordsLength={linkedKeywords.length}
            />
        );
    });
};
