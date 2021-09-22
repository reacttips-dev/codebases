import swLog from "@similarweb/sw-log";
import { InfoCardApps } from "@similarweb/ui-components/dist/info-card";
import { abbrNumberFilter, i18nFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import * as PropTypes from "prop-types";
import { FunctionComponent, useEffect, useState } from "react";
import * as React from "react";
import { AssetsService } from "services/AssetsService";
import { DefaultFetchService } from "services/fetchService";

interface IAppTooltipContentProps {
    app?: any;
    appId: string;
    store: string;
}

const getImageSrc = (imgSrc, category) => {
    if (category === "Adult") {
        return AssetsService.assetUrl("/images/new-adult-tall-app.png");
    } else {
        return imgSrc || AssetsService.assetUrl("/images/new-no-image-app.png");
    }
};

const fetchService = DefaultFetchService.getInstance();

const getRatingNumber = (rating) => {
    return rating === 0 ? null : +rating.toFixed(1);
};

export const AppTooltipContent: FunctionComponent<IAppTooltipContentProps> = (props) => {
    const { appId, store } = props;
    const validStore = store === "0" ? "Google" : store === "1" ? "Apple" : store || "";

    const [data, setData] = useState(null);
    useEffect(() => {
        const abortController = new AbortController();
        const fetchData = async () => {
            try {
                const response = await fetchService.get(
                    `/api/MobileApps/GetHeader?appId=${appId}&store=${validStore}&country=840`,
                    null,
                    {
                        preventAutoCancellation: false,
                        cancellation: abortController.signal,
                    },
                );
                setData(response);
            } catch (e) {
                if (e.name === "AbortError") {
                    swLog.info("Fetch aborted on cleanup");
                } else {
                    swLog.warn("AppInfoCard fetch data:" + e);
                }
            }
        };
        fetchData();

        return function cleanup() {
            abortController.abort();
        };
    }, [appId, store]);

    if (data) {
        return (
            <InfoCardApps
                isLoadingData={false}
                appName={data.Name}
                icon={data.Icon ? data.Icon : "/images/autocomplete-default.png"}
                description={
                    data.Description
                        ? data.Description
                        : i18nFilter()("infotip.description.undefined")
                }
                store={
                    data.AppStore === "Google"
                        ? "Google Play"
                        : data.AppStore === "Apple"
                        ? "App Store"
                        : data.AppStore
                }
                price={data.Price}
                category={data.Category}
                rating={getRatingNumber(data.Rating)}
                imgSrc1={getImageSrc(data.Screenshots[0], data.Category)}
                imgSrc2={getImageSrc(data.Screenshots[1], data.Category)}
                countryId={data.Country ? data.Country : 999}
                categoryRankingLabel={i18nFilter()("infotip.app.categoryRank")}
                categoryRanking={
                    data.BestMonthlyCategoryRank
                        ? abbrNumberFilter()(data.BestMonthlyCategoryRank)
                        : "-"
                }
                monthlyDownloadsLabel={i18nFilter()("infotip.app.monthlyDownloads")}
                monthlyDownloads={
                    data.MonthlyDownloads ? abbrNumberFilter()(data.MonthlyDownloads) : "-"
                }
                lastVersionLabel={i18nFilter()("infotip.app.lastVersion")}
                lastVersion={data.LastVersion ? dayjs(data.LastVersion).format("MMM YYYY") : "-"}
            />
        );
    }
    return <InfoCardApps isLoadingData={true} />;
};

AppTooltipContent.propTypes = {
    app: PropTypes.object,
    appId: PropTypes.string,
    store: PropTypes.string,
};
AppTooltipContent.displayName = "AppTooltipContent";
