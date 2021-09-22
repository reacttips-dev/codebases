import React, { FunctionComponent, useEffect, useState } from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import DurationService from "services/DurationService";
import CountryService from "services/CountryService";
import { DefaultFetchService } from "services/fetchService";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { bigNumberFilter, minAbbrNumberFilter, i18nFilter } from "filters/ngFilters";
import { NoDataLandscape } from "components/NoData/src/NoData";
import { TotalVisitsWrapper, ContentWrapper, TopPart } from "./StyledComponents";
import { Loader } from "../../../../components/widget-title/Loader";
import { WidgetTitle } from "../../../../components/widget-title/WidgetTitle";
import { TitleContainer, StyledBox } from "../../../../components/widget-title/StyledComponents";

export interface ITotalVisitsProps {
    type: string;
}

const fetchService = DefaultFetchService.getInstance();
const i18n = i18nFilter();
const bigNumber = bigNumberFilter();

const TotalVisits: FunctionComponent<ITotalVisitsProps> = ({ type }) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const { country, isWWW, key, duration, webSource, filter } = swNavigator.getParams();
    const durationObject = DurationService.getDurationData(duration);
    const { from, to, isWindow } = durationObject.forAPI;
    const getDateRange = (durationObject) => [durationObject.raw.from, durationObject.raw.to];
    const [fromDate, toDate] = getDateRange(durationObject);
    const title = i18n(`${type}.totalvisits.title`);
    const tooltip = i18n("analysis.compare.trafficsource.overview.share.tooltip");
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    let addToDashboardModal = { dismiss: () => null };
    const $modal = Injector.get<any>("$modal");
    const $rootScope = Injector.get<any>("$rootScope");
    const widgetModelAdapterService = Injector.get<any>("widgetModelAdapterService");

    const subTitleFilters = [
        {
            filter: "date",
            value: {
                from: fromDate.valueOf(),
                to: toDate.valueOf(),
                useRangeDisplay: fromDate.format("YYYY-MM") !== toDate.format("YYYY-MM"),
            },
        },
        {
            filter: "webSource",
            value: "Desktop",
        },
    ];
    const a2d = () => {
        addToDashboardModal = $modal.open({
            animation: true,
            controller: "widgetAddToDashboardController as ctrl",
            templateUrl: "/app/components/widget/widget-add-to-dashboard-modal.html",
            windowClass: "add-to-dashboard-modal",
            resolve: {
                widget: () => null,
                customModel: () =>
                    getCustomModel(
                        "DashboardTrafficSourcesAds",
                        "SingleMetric",
                        webSource,
                        "Website",
                        null,
                        filter,
                    ),
            },
            scope: $rootScope.$new(true),
        });
    };
    const getCustomModel = (metric, type, webSource, family, selectedSite?, filters?) => {
        return widgetModelAdapterService.fromWebsite(
            metric,
            type,
            webSource,
            selectedSite,
            filters,
        );
    };

    useEffect(() => {
        async function fetchData() {
            const API = `api/websiteanalysis/GetTrafficDisplayPaidOutgoing`;
            const response = await fetchService.get<any>(API, {
                country,
                from,
                isWWW: isWWW === "-",
                isWindow,
                key,
                to,
                params: {
                    page: 1,
                    orderby: "Share desc",
                },
            });
            if (Object.keys(response.dictionary[key]).length) {
                console.log("total visits: ", response);
                setData(response);
            } else {
                setData(null);
            }
            setIsLoading(false);
        }
        fetchData();
    }, []);
    useEffect(() => () => addToDashboardModal.dismiss(), [addToDashboardModal]);

    const getComponent = () => (
        <>
            {data ? (
                <>
                    <ContentWrapper>
                        <TopPart>
                            <TotalVisitsWrapper>
                                {minAbbrNumberFilter()(bigNumber(data.dictionary[key].VolumeTotal))}
                            </TotalVisitsWrapper>
                        </TopPart>
                    </ContentWrapper>
                </>
            ) : (
                <NoDataLandscape title="global.nodata.notavilable" subtitle="" />
            )}
        </>
    );

    return (
        <StyledBox width="100%" height="357" marginRight={24}>
            <TitleContainer>
                <WidgetTitle
                    title={title}
                    tooltip={tooltip}
                    filters={subTitleFilters}
                    addToDashboard={a2d}
                />
            </TitleContainer>
            {isLoading ? <Loader /> : getComponent()}
        </StyledBox>
    );
};

SWReactRootComponent(TotalVisits, "TotalVisits");
