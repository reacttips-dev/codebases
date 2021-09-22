import SWReactRootComponent from "decorators/SWReactRootComponent";
import React, { FC, useEffect, useState } from "react";
import { Injector } from "common/ioc/Injector";
import { DefaultFetchService } from "services/fetchService";
import DurationService from "services/DurationService";
import {
    ContainerWrapper,
    DisplayAdsGalleryWrapper,
    DisplayAdsPageWrapper,
    StyledLoaderWrapper,
} from "pages/website-analysis/traffic-sources/display-ads/common/StyledComponents";
import { Loader } from "pages/website-analysis/traffic-sources/display-ads/common/Loader";
import {
    EmptyState,
    NoDataState,
} from "pages/website-analysis/traffic-sources/display-ads/common/EmptyState";
import { stringify } from "querystring";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import ExcelClientDownload from "components/React/ExcelButton/ExcelClientDownload";
import { LAST_SEEN } from "pages/website-analysis/traffic-sources/ads/availableFilters";
import { showErrorToast } from "actions/toast_actions";
import { i18nFilter } from "filters/ngFilters";
import { connect } from "react-redux";
import { VideosOverview } from "pages/website-analysis/traffic-sources/display-ads/videos/components/VideosOverview";
import { VideosFilters } from "pages/website-analysis/traffic-sources/display-ads/videos/components/VideosFilters";
import { VideosGallery } from "pages/website-analysis/traffic-sources/display-ads/videos/components/VideosGallery";

const VideosContainer: FC<any> = ({ showToast }) => {
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
    const is28d = duration === "28d";
    const isCompare = chosenSites.isCompare();
    const [isError, setIsError] = useState<boolean>(false);
    const [excelDownloading, setExcelDownloading] = useState(false);
    const pageSize = 50;
    const getChannelByWebSource = () => {
        switch (webSource) {
            case devicesTypes.TOTAL:
                return -2;
            case devicesTypes.DESKTOP:
                return 4;
            case devicesTypes.MOBILE:
                return 5;
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
    };
    const endpoint = "widgetApi/WebsiteAdsIntelVideo/WebsiteAdsVideo/Table";

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
    }, [selectedCampaigns, selectedDomain]);

    const transformData = (response) => {
        return {
            videos: response.Data
                ? response.Data.map((item) => {
                      return {
                          Size: `${item.Width}x${item.Height}`,
                          ...item,
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
            totalVideos: response.TotalCount,
        };
    };

    const getExcelEndpoint = () => {
        const queryStringParams = stringify({ ...params, pageSize: null });
        return `widgetApi/WebsiteAdsIntelVideo/WebsiteAdsVideo/Excel?${queryStringParams}`;
    };

    const onCampaignsFilterChange = (value) => {
        const selectedCampaigns = value.map((v) => v.text);
        setSelectedCampaigns(selectedCampaigns);

        TrackWithGuidService.trackWithGuid(
            "websiteanalysis.trafficsources.ads.videos.campaigns.filter",
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
        setSelectedCampaigns([]);
        setSelectedDomain(value.text);

        TrackWithGuidService.trackWithGuid(
            "websiteanalysis.trafficsources.ads.videos.domain.filter",
            "click",
        );
    };

    const onExcelDownload = async () => {
        setExcelDownloading(true);
        try {
            await ExcelClientDownload(getExcelEndpoint(), {
                Campaigns: selectedCampaigns,
            });
        } catch (e) {
            showToast(i18nFilter()("websiteanalysis.trafficsources.ads.videos.excel.fail"));
        } finally {
            setExcelDownloading(false);
        }
    };

    return (
        <ContainerWrapper>
            {!isError && (
                <DisplayAdsPageWrapper data-automation="videos-overview">
                    <VideosFilters
                        selectedCampaigns={selectedCampaigns}
                        campaigns={data?.campaigns}
                        onCampaignsFilterChange={onCampaignsFilterChange}
                        isCompare={isCompare}
                        domains={domains}
                        onDomainFilterChange={onDomainFilterChange}
                        selectedDomain={selectedDomain}
                        isLoading={isLoading}
                    />
                    <VideosOverview
                        isLoading={isLoading}
                        totalCampaigns={data?.totalCampaigns}
                        totalVideos={data?.totalVideos}
                        onExcelDownload={onExcelDownload}
                        excelDownloading={excelDownloading}
                    />
                    {isLoading ? (
                        <StyledLoaderWrapper height={400}>
                            <Loader />
                        </StyledLoaderWrapper>
                    ) : (
                        <DisplayAdsGalleryWrapper data-automation="videos-gallery">
                            {data?.videos && data?.videos.length > 0 ? (
                                <VideosGallery
                                    tilesEndpoint={endpoint}
                                    initialTilesList={data?.videos}
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
    connect(mapDispatchToProps)(VideosContainer),
    "VideosContainer",
);
