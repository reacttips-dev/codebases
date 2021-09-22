import React, { FunctionComponent, useEffect, useState } from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import DurationService from "services/DurationService";
import CountryService from "services/CountryService";
import { DefaultFetchService } from "services/fetchService";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { minAbbrNumberFilter, i18nFilter, bigNumberFilter } from "filters/ngFilters";
import { NoDataLandscape } from "components/NoData/src/NoData";
import {
    TotalVisitsWrapper,
    ShareNumber,
    ContentWrapper,
    TopPart,
    StyledBox,
    TitleContainer,
    TotalVisitsBottonWrapper,
} from "./StyledComponents";
import { Loader } from "../../../../components/widget-title/Loader";
import { WidgetTitle } from "../../../../components/widget-title/WidgetTitle";

export interface ITotalVisitsProps {
    type: string;
}

const fetchService = DefaultFetchService.getInstance();
const i18n = i18nFilter();
const bigNumber = bigNumberFilter();

const SocialTotalVisits: FunctionComponent<ITotalVisitsProps> = ({ type }) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const { country, isWWW, key, duration } = swNavigator.getParams();
    const durationObject = DurationService.getDurationData(duration);
    const { from, to, isWindow } = durationObject.forAPI;
    const getDateRange = (durationObject) => [durationObject.raw.from, durationObject.raw.to];
    const [fromDate, toDate] = getDateRange(durationObject);
    const title = i18n(`${type}.totalvisits.title`);
    const tooltip = i18n("social.totalvisits.title.tooltip", { param: type });
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [share, setShare] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            const API = `api/websiteanalysis/GetTrafficSocial`;
            const response = await fetchService.get<any>(API, {
                country,
                from,
                isWWW: isWWW === "-",
                isWindow,
                key,
                to,
                page: 1,
                orderby: "Share desc",
            });

            setShare(response.dictionary[key].SearchTotal / response.dictionary[key].VolumeTotal);
            if (
                Object.keys(response.dictionary[key]).length &&
                response.dictionary[key].SearchTotal !== 0
            ) {
                console.log("total visits social: ", response);
                setData(response);
            } else {
                setData(null);
            }
            setIsLoading(false);
        }
        fetchData();
    }, []);

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

    const getComponent = () => (
        <>
            {data ? (
                <>
                    <ContentWrapper>
                        <TopPart>
                            <TotalVisitsWrapper>
                                {minAbbrNumberFilter()(bigNumber(data.dictionary[key].SearchTotal))}
                            </TotalVisitsWrapper>

                            {share < 1 && share > 0 && (
                                <TotalVisitsBottonWrapper>
                                    <ShareNumber>{(share * 100).toFixed(2)}% </ShareNumber>
                                    {i18n("analysis.totalvisits.span")}
                                </TotalVisitsBottonWrapper>
                            )}
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
                <WidgetTitle title={title} tooltip={tooltip} filters={subTitleFilters} />
            </TitleContainer>
            {isLoading ? <Loader /> : getComponent()}
        </StyledBox>
    );
};

SWReactRootComponent(SocialTotalVisits, "SocialTotalVisits");
