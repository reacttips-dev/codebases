import React, { FunctionComponent } from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import PaidSearchGraphConnected from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/PaidSearchGraph";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { RawParams } from "@uirouter/angularjs";
import styled from "styled-components";
import { TotalPaidSearchTrafficCompare } from "pages/website-analysis/traffic-sources/paid-search/components/total-paid-search-traffic/TotalPaidSearchTrafficCompare";
import { TopPaidKeywords } from "pages/website-analysis/traffic-sources/paid-search/components/top-paid-keywords /TopPaidKeywords";
import { TotalPaidSearchTrafficSingle } from "pages/website-analysis/traffic-sources/paid-search/components/total-paid-search-traffic/TotalPaidSearchTrafficSingle";
import { CompareBanner } from "pages/website-analysis/traffic-sources/paid-search/components/compare-banner/CompareBanner";
import { TopSearchAdsSingle } from "pages/website-analysis/traffic-sources/paid-search/components/top-search-ads/TopSearchAdsSingle";
import { TopProductAdsSingle } from "pages/website-analysis/traffic-sources/paid-search/components/top-product-ads/TopProductAdsSingle";
import { DefaultFetchService } from "services/fetchService";
import { i18nFilter } from "filters/ngFilters";

export interface IPaidSearchOverviewProps {
    navigationParams: RawParams;
    isCompare?: boolean;
    href?: any;
    fetchService: DefaultFetchService;
    applyUpdateParams?: any;
    i18n: (key: string, obj?: any, defaultValue?: string) => string;
}

export const TopPart = styled(FlexRow)`
    margin-bottom: 24px;
`;

export const BottomPartSingle = styled(FlexRow)`
    justify-content: space-between;
`;

const PaidSearchOverview: FunctionComponent<any> = () => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const chosenSitesService = Injector.get("chosenSites") as any;
    const fetchService = DefaultFetchService.getInstance();
    const params = swNavigator.getParams();
    const isCompare = params.key.split(",").length > 1;
    const i18n = i18nFilter();

    return (
        <>
            <TopPart justifyContent="space-between">
                {isCompare ? (
                    <TotalPaidSearchTrafficCompare
                        navigationParams={params}
                        href={swNavigator.href.bind(swNavigator)}
                        fetchService={fetchService}
                        i18n={i18n}
                    />
                ) : (
                    <TotalPaidSearchTrafficSingle
                        navigationParams={params}
                        fetchService={fetchService}
                        i18n={i18n}
                    />
                )}
                <TopPaidKeywords
                    navigationParams={params}
                    isCompare={isCompare}
                    href={swNavigator.href.bind(swNavigator)}
                    fetchService={fetchService}
                    i18n={i18n}
                />
            </TopPart>
            <PaidSearchGraphConnected
                chosenSitesService={chosenSitesService}
                fetchService={fetchService}
            />
            {!isCompare && (
                <CompareBanner
                    domain={params.key}
                    applyUpdateParams={swNavigator.applyUpdateParams.bind(swNavigator)}
                    i18n={i18n}
                />
            )}
            {isCompare ? null : (
                <BottomPartSingle>
                    <TopSearchAdsSingle
                        navigationParams={params}
                        href={swNavigator.href.bind(swNavigator)}
                        fetchService={fetchService}
                        i18n={i18n}
                    />
                    <TopProductAdsSingle
                        navigationParams={params}
                        href={swNavigator.href.bind(swNavigator)}
                        fetchService={fetchService}
                        i18n={i18n}
                    />
                </BottomPartSingle>
            )}
        </>
    );
};

export default SWReactRootComponent(PaidSearchOverview, "PaidSearchOverview");
