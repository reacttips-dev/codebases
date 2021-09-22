import React, { useCallback } from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { BannerContainer, OverLapContainer } from "./StyledComponents";
import { VennDiagramComponent } from "./VennDiagramComponent";
import DurationService from "services/DurationService";
import { Injector } from "common/ioc/Injector";
import CountryService from "services/CountryService";
import { useLoading } from "custom-hooks/loadingHook";
import { DefaultFetchService } from "services/fetchService";
import { Banner } from "@similarweb/ui-components/dist/banner";
import { i18nFilter } from "filters/ngFilters";
import { AssetsService } from "services/AssetsService";
import { CHART_COLORS } from "constants/ChartColors";
import { connect } from "react-redux";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { AudienceLoyalty } from "../audience-loyalty/AudienceLoyalty";
import AudienceOverlapApiService from "pages/website-analysis/audience-overlap/AudienceOverlapApiService";
import { SwNavigator } from "common/services/swNavigator";
import SimilarSitesService from "services/GetSimilarSitesService";

const colors = CHART_COLORS.compareMainColors;
const fetchService = DefaultFetchService.getInstance();

export const AudienceOverlap = ({ params }: any) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const chosenSites = Injector.get<any>("chosenSites");
    const chosenSitesLegends = chosenSites.sitelistForLegend();

    const { audienceOverlapApiService } = React.useMemo(
        () => ({
            audienceOverlapApiService: new AudienceOverlapApiService(),
        }),
        [],
    );

    const isSingleMode = React.useMemo(() => {
        return chosenSitesLegends.length === 1;
    }, [chosenSitesLegends]);

    const [similarSitesData, similarSitesOps] = useLoading();
    React.useEffect(() => {
        if (isSingleMode) {
            const similarSitesService = SimilarSitesService.getInstance();
            similarSitesOps.load(() => similarSitesService.fetchSimilarSites(params.key, 2));
        }
    }, [isSingleMode, params.key]);
    const isSimilarSiteLoading = [useLoading.STATES.INIT, useLoading.STATES.LOADING].includes(
        similarSitesData.state,
    );

    const [OverlapData, OverlapDataOps] = useLoading();
    React.useEffect(() => {
        if (!isSingleMode || !isSimilarSiteLoading) {
            const apiParams: any = swNavigator.getApiParams(params);
            OverlapDataOps.load(() =>
                audienceOverlapApiService.getDomainsAudienceOverlap({
                    ...apiParams,
                    ...(isSingleMode
                        ? {
                              keys: similarSitesData?.data
                                  ?.map((site) => {
                                      return site.Domain;
                                  })
                                  .toString(),
                          }
                        : { keys: params.key }),
                }),
            );
        }
    }, [similarSitesData, isSingleMode, isSimilarSiteLoading]);
    const isOverlapLoading = [useLoading.STATES.INIT, useLoading.STATES.LOADING].includes(
        OverlapData.state,
    );

    const websitesArrayWithColor = React.useMemo(() => {
        if (similarSitesData.data) {
            similarSitesData.data.unshift({ Domain: params.key, isSuggested: false });
            return similarSitesData.data.map((site, idx) => {
                return {
                    isSuggested: true,
                    ...site,
                    color: colors[idx],
                    name: site.Domain,
                    icon: site.Favicon,
                };
            });
        }
        return [];
    }, [isSingleMode, params.key, similarSitesData]);

    const durationObject = React.useMemo(() => DurationService.getDurationData(params.duration), [
        params.duration,
    ]);

    const subtitleFilters = React.useMemo(
        () => [
            {
                filter: "date",
                value: {
                    from: durationObject.raw.from.valueOf(),
                    to: durationObject.raw.to.valueOf(),
                    useRangeDisplay:
                        params.duration !== "28d" ||
                        durationObject.raw.from.format("YYYY-MM") !==
                            durationObject.raw.to.format("YYYY-MM"),
                },
            },
            {
                filter: "country",
                countryCode: params.country,
                value: CountryService.getCountryById(params.country)?.text,
            },
            {
                filter: "webSource",
                value: "Desktop",
            },
        ],
        [params.country, durationObject],
    );

    const excelUrl = React.useMemo(() => {
        const apiParams: any = swNavigator.getApiParams(params);
        return audienceOverlapApiService.getDomainsAudienceOverlapExcelUrl({
            ...apiParams,
            ...(isSingleMode
                ? {
                      keys: similarSitesData?.data
                          ?.map((site) => {
                              return site.Domain;
                          })
                          .toString(),
                  }
                : { keys: params.key }),
        });
    }, [isSingleMode, similarSitesData]);

    const openQueryBarCompare = useCallback(() => {
        TrackWithGuidService.trackWithGuid(
            "analysis.overlap.single.banner.click.to.compare",
            "click",
        );
        const $modal = Injector.get<any>("$modal");
        const $scope = Injector.get<any>("$rootScope").$new();
        $scope.competitorsList = websitesArrayWithColor?.filter(
            (site) => site.Domain !== params.key,
        );
        // competitors.map(item => $scope.competitorsList.push(item.id));
        $modal.open({
            templateUrl: "/partials/websites/modal-compare.html",
            controller: "ModalCompareInstanceCtrl",
            controllerAs: "ctrl",
            scope: $scope,
        });
    }, [websitesArrayWithColor]);

    return (
        <OverLapContainer>
            {isSingleMode && (
                <BannerContainer>
                    <Banner
                        title={i18nFilter()("Audience Overlap Works Best in Compare")}
                        subtitle={i18nFilter()(
                            "Benchmark to your competitors and see how you share visitors",
                        )}
                        buttonType="primary"
                        iconImagePath={AssetsService.assetUrl(
                            "/images/Illustration-Benchmarking.svg",
                        )}
                        onButtonClick={openQueryBarCompare}
                        buttonIconName={"add"}
                        buttonText={i18nFilter()("compare")}
                        iconImageHeight={48}
                        iconImageWidth={48}
                    />
                </BannerContainer>
            )}
            <VennDiagramComponent
                isVennDiagramLoading={isOverlapLoading}
                VennDiagramData={OverlapData}
                websitesArrayWithColor={websitesArrayWithColor}
                isSingleMode={isSingleMode}
                chosenSitesLegends={chosenSitesLegends}
                subtitleFilters={subtitleFilters}
                selectedCountryCode={params.country}
                excelDownloadUrl={excelUrl}
            />
            <AudienceLoyalty
                comparisonData={OverlapData}
                isLoadingComparisonData={isOverlapLoading}
                subtitleFilters={subtitleFilters}
                isSingleMode={isSingleMode}
                chosenSitesLegends={chosenSitesLegends}
                websitesArrayWithColor={websitesArrayWithColor}
                selectedCountryCode={params.country}
            />
        </OverLapContainer>
    );
};

function mapStateToProps(store) {
    const {
        routing: { params },
    } = store;
    return {
        params,
    };
}

const ConnectedAudienceOverlap = connect(mapStateToProps, undefined)(AudienceOverlap);
SWReactRootComponent(ConnectedAudienceOverlap, "AudienceOverlap");
export default ConnectedAudienceOverlap;
