import React, { FunctionComponent, useState } from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { DefaultFetchService, NoCacheHeaders } from "services/fetchService";
import { SwLog } from "@similarweb/sw-log";
import DurationService from "services/DurationService";
import useLocalStorage from "custom-hooks/useLocalStorage";
import { KWOPPORTUNITIES } from "pages/digital-marketing/find-affiliate/by-keywords/localStorageKey";
import * as _ from "lodash";
import { i18nFilter } from "filters/ngFilters";
import { getStoredGroupName } from "pages/digital-marketing/find-affiliate/by-keywords/findAffiliateByKeywordUtils";
import { TITLE_MAX_LENGTH } from "pages/keyword-analysis/KeywordGroupEditorHelpers";
import { FindAffiliateByKeywordsHomePage } from "pages/digital-marketing/find-affiliate/home-pages/FindAffiliateByKeywordsHomePage";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

const fetchService = DefaultFetchService.getInstance();

const FindAffiliateByKeywordsHomePageContainer: FunctionComponent = () => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const [kwgLoading, setKwgLoading] = useState<boolean>(false);
    const [, setOpportunitiesKeywords] = useLocalStorage(KWOPPORTUNITIES);

    const visitAffiliateOpportunities = async ({
        keyword,
        country,
    }: {
        keyword: string;
        country: number;
    }): Promise<void> => {
        if (kwgLoading) {
            return null;
        }
        const endpoint = `/widgetApi/FindAffiliates/KeywordAffiliate/create`;
        const duration = "3m";
        const webSource = "Desktop";
        const { from, to } = DurationService.getDurationData(
            duration,
            null,
            "KeywordsGenerator",
        ).forAPI;
        if (keyword.startsWith("*")) {
            swNavigator.go("findaffiliates_bykeywords", {
                country,
                webSource,
                duration,
                keyword,
            });
        } else {
            const params = {
                //hardcoded params due to BE requirements
                keyword,
                country,
                from,
                to,
                webSource,
            };
            setKwgLoading(true);
            try {
                const response: object = await fetchService.get(endpoint, params, {
                    headers: NoCacheHeaders,
                });
                const kwGroup = _.mapKeys<any>(response, (v, k) => _.capitalize(k));
                const Name = getStoredGroupName(
                    keyword,
                    i18nFilter(),
                    keywordsGroupsService.userGroups,
                    TITLE_MAX_LENGTH,
                );
                if (!kwGroup.Id) {
                    kwGroup.Id = `${Date.now()}`;
                }
                setOpportunitiesKeywords(JSON.stringify({ ...kwGroup, Name }));
                swNavigator.go("findaffiliates_bykeywords", {
                    country,
                    webSource,
                    duration,
                    keyword: `*${kwGroup.Id}`,
                });
            } catch (e) {
                SwLog.log(`Failed to get keyword opportunities list for ${keyword}:`, e);
            } finally {
                setKwgLoading(false);
            }
        }
    };
    return (
        <FindAffiliateByKeywordsHomePage
            visitAffiliateOpportunities={visitAffiliateOpportunities}
            kwgLoading={kwgLoading}
        />
    );
};

SWReactRootComponent(
    FindAffiliateByKeywordsHomePageContainer,
    "FindAffiliateByKeywordsHomePageContainer",
);
