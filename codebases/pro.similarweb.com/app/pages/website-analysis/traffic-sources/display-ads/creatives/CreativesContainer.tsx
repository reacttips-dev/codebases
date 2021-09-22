import SWReactRootComponent from "decorators/SWReactRootComponent";
import React, { FC, useEffect, useMemo, useState } from "react";
import { Injector } from "common/ioc/Injector";
import { DefaultFetchService } from "services/fetchService";
import DurationService from "services/DurationService";
import {
    ContainerWrapper,
    DisplayAdsGalleryWrapper,
    DisplayAdsPageWrapper,
    StyledLoaderWrapper,
} from "pages/website-analysis/traffic-sources/display-ads/common/StyledComponents";
import { CreativesFilters } from "pages/website-analysis/traffic-sources/display-ads/creatives/components/CreativesFilters";
import { CreativesOverview } from "pages/website-analysis/traffic-sources/display-ads/creatives/components/CreativesOverview";
import {
    EmptyState,
    NoDataState,
} from "pages/website-analysis/traffic-sources/display-ads/common/EmptyState";
import { stringify } from "querystring";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { CreativesGallery } from "pages/website-analysis/traffic-sources/display-ads/creatives/components/CreativesGallery";
import ExcelClientDownload from "components/React/ExcelButton/ExcelClientDownload";
import { LAST_SEEN } from "pages/website-analysis/traffic-sources/ads/availableFilters";
import { showErrorToast } from "actions/toast_actions";
import { i18nFilter } from "filters/ngFilters";
import { connect } from "react-redux";
import { Loader } from "pages/website-analysis/traffic-sources/display-ads/common/Loader";

const CreativesContainer: FC<any> = ({ showToast }) => {
    const swNavigator = Injector.get<any>("swNavigator");
    const chosenSites = Injector.get<any>("chosenSites");
    const fetchService = DefaultFetchService.getInstance();
    const { country, webSource, key, duration, isWWW, sort, domain } = swNavigator.getParams();
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const domains = chosenSites.map((item, infoItem) => {
        return { name: item, displayName: infoItem.displayName, icon: infoItem.icon };
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<any>(null);
    const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
    const [selectedDomain, setSelectedDomain] = useState<string>(domain ? domain : domains[0].name);
    const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
    const [selectedAdNetworks, setSelectedAdNetworks] = useState<string[]>([]);
    const is28d = duration === "28d";
    const isCompare = chosenSites.isCompare();
    const [isError, setIsError] = useState<boolean>(false);
    const [excelDownloading, setExcelDownloading] = useState(false);
    const pageSize = 50;
    const getChannelByWebSource = () => {
        switch (webSource) {
            case devicesTypes.TOTAL:
                return -1;
            case devicesTypes.DESKTOP:
                return 1;
            case devicesTypes.MOBILE:
                return 2;
            default:
                return null;
        }
    };
    const params = {
        country,
        from,
        includeSubDomains: isWWW === "*",
        isWindow,
        keys: isCompare ? selectedDomain : key,
        timeGranularity: is28d ? "Daily" : "Monthly",
        to,
        channel: getChannelByWebSource(),
        pageSize, // max size of results for each page
        orderBy: sort ? sort : LAST_SEEN + " desc",
    };

    if (params.isWindow) {
        params["latest"] = "28d";
    }

    const selectedFilters = {
        selectedCampaigns,
        selectedPublishers,
        selectedAdNetworks,
    };
    const endpoint = "widgetApi/WebsiteAdsIntelDisplay/WebsiteAdsDisplay/Table";

    useEffect(() => {
        if (!isCompare && domain) {
            setTimeout(() => {
                swNavigator.applyUpdateParams({
                    domain: null,
                });
            }, 0);
        }
    }, [isCompare]);

    useEffect(() => {
        setIsLoading(true);
        setData(null);
        setIsError(false);

        fetchService
            .post<{ Data: any }>(
                `${endpoint}?${stringify({
                    ...params,
                    page: 1,
                })}`,
                {
                    Publishers: selectedPublishers,
                    AdNetworks: selectedAdNetworks,
                    Campaigns: selectedCampaigns,
                },
            )
            .then((response) => {
                const transformedData = transformData(response);
                setData(transformedData);
                setIsLoading(false);
            })
            .catch(() => {
                setIsError(true);
                setIsLoading(false);
            });
    }, [selectedPublishers, selectedCampaigns, selectedAdNetworks, selectedDomain]);

    const transformData = (response) => {
        return {
            creatives: response.Data
                ? response.Data.map((item) => {
                      return {
                          Size: `${item.Width}x${item.Height}`,
                          ...item,
                      };
                  })
                : [],
            publishers: response.Filters.Publishers
                ? response.Filters.Publishers.map((item) => {
                      return {
                          id: item.id,
                          count: item.count,
                          text: item.text,
                          imageUrl: item.icon,
                      };
                  })
                : [],
            adNetworks: response.Filters.AdNetworks
                ? response.Filters.AdNetworks.map((item) => {
                      return {
                          id: item.id,
                          count: item.count,
                          text: item.text,
                      };
                  })
                : [],
            campaigns: response.Filters.Campaigns
                ? response.Filters.Campaigns.map((item) => {
                      return {
                          id: item.id,
                          count: item.count,
                          text: item.text,
                      };
                  })
                : [],
            totalCampaigns: response.FiltersCounts?.Campaigns,
            totalAdNetworks: response.FiltersCounts?.AdNetworks,
            totalPublishers: response.FiltersCounts?.Publishers,
            totalCreatives: response.TotalCount,
        };
    };

    const getExcelEndpoint = () => {
        const queryStringParams = stringify({ ...params, pageSize: null });
        return `widgetApi/WebsiteAdsIntelDisplay/WebsiteAdsDisplay/Excel?${queryStringParams}`;
    };

    const onCampaignsFilterChange = (value) => {
        const selectedCampaigns = value.map((v) => v.text);
        setSelectedCampaigns(selectedCampaigns);

        TrackWithGuidService.trackWithGuid(
            "websiteanalysis.trafficsources.ads.creatives.campaigns.filter",
            "click",
        );
    };

    const onSortChange = (value) => {
        swNavigator.applyUpdateParams({
            sort: value,
        });
    };

    const onDomainFilterChange = (value) => {
        swNavigator.applyUpdateParams({
            domain: value.text,
        });
        onClearAll();
        setSelectedDomain(value.text);

        TrackWithGuidService.trackWithGuid(
            "websiteanalysis.trafficsources.ads.creatives.domain.filter",
            "click",
        );
    };

    const onPublishersFilterChange = (value) => {
        setSelectedPublishers(value.map((v) => v.text));

        TrackWithGuidService.trackWithGuid(
            "websiteanalysis.trafficsources.ads.creatives.publishers.filter",
            "click",
        );
    };

    const onAdNetworksFilterChange = (value) => {
        setSelectedAdNetworks(value.map((v) => v.text));

        TrackWithGuidService.trackWithGuid(
            "websiteanalysis.trafficsources.ads.creatives.adnetworks.filter",
            "click",
        );
    };

    const onClearAll = () => {
        setSelectedAdNetworks([]);
        setSelectedPublishers([]);
        setSelectedCampaigns([]);
    };

    const onExcelDownload = async () => {
        setExcelDownloading(true);
        try {
            await ExcelClientDownload(getExcelEndpoint(), {
                Publishers: selectedPublishers,
                AdNetworks: selectedAdNetworks,
                Campaigns: selectedCampaigns,
            });
        } catch (e) {
            showToast(i18nFilter()("websiteanalysis.trafficsources.ads.creatives.excel.fail"));
        } finally {
            setExcelDownloading(false);
        }
    };

    const isClearAllDisabled = useMemo(
        () =>
            selectedCampaigns.length === 0 &&
            selectedAdNetworks.length === 0 &&
            selectedPublishers.length === 0,
        [selectedCampaigns, selectedAdNetworks, selectedPublishers],
    );

    return (
        <ContainerWrapper>
            {!isError && (
                <DisplayAdsPageWrapper data-automation="creatives-overview">
                    <CreativesFilters
                        isClearAllDisabled={isClearAllDisabled}
                        onClearAll={onClearAll}
                        selectedCampaigns={selectedCampaigns}
                        campaigns={data?.campaigns}
                        onCampaignsFilterChange={onCampaignsFilterChange}
                        publishers={data?.publishers}
                        onPublishersFilterChange={onPublishersFilterChange}
                        adNetworks={data?.adNetworks}
                        onAdNetworksFilterChange={onAdNetworksFilterChange}
                        selectedAdNetworks={selectedAdNetworks}
                        selectedPublishers={selectedPublishers}
                        isCompare={isCompare}
                        domains={domains}
                        onDomainFilterChange={onDomainFilterChange}
                        selectedDomain={selectedDomain}
                        isLoading={isLoading}
                    />
                    <CreativesOverview
                        isLoading={isLoading}
                        totalCampaigns={data?.totalCampaigns}
                        totalPublishers={data?.totalPublishers}
                        totalAdNetworks={data?.totalAdNetworks}
                        totalCreatives={data?.totalCreatives}
                        onExcelDownload={onExcelDownload}
                        excelDownloading={excelDownloading}
                    />
                    {isLoading ? (
                        <StyledLoaderWrapper height={400}>
                            <Loader />
                        </StyledLoaderWrapper>
                    ) : (
                        <DisplayAdsGalleryWrapper data-automation="creatives-gallery">
                            {data?.creatives && data?.creatives.length > 0 ? (
                                <CreativesGallery
                                    tilesEndpoint={endpoint}
                                    initialTilesList={data?.creatives}
                                    params={params}
                                    onSortChange={onSortChange}
                                    selectedFilters={selectedFilters}
                                    webSource={webSource}
                                    initialSort={sort}
                                />
                            ) : (
                                <NoDataState />
                            )}
                        </DisplayAdsGalleryWrapper>
                    )}
                </DisplayAdsPageWrapper>
            )}
            {isError && <EmptyState />}
        </ContainerWrapper>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        showToast: (text?: string) => dispatch(showErrorToast(text)),
    };
};

export default SWReactRootComponent(
    connect(mapDispatchToProps)(CreativesContainer),
    "CreativesContainer",
);
