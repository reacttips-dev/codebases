import React, { useCallback, useEffect, useMemo, useState } from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { SwNavigator } from "common/services/swNavigator";
import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import DemographicsApiService from "./WebAnalysisDemographicsApiService";
import { useLoading } from "custom-hooks/loadingHook";
import {
    DemographicsContainer,
    GenderContainer,
    AgeContainer,
    BoxContainer,
    GenderContainerCompare,
    AgeContainerCompare,
} from "./StyledComponents";
import { GenderDistributionPieChart } from "./GenderDistributionPieChart/GenderDistributionPieChart";
import { AgeDistributionBarChart } from "./AgeDistributionBarChart/AgeDistributionBarChart";
import { GenderDistributionBarChartCompared } from "./GenderDistributionBarChartCompared/GenderDistributionBarChartCompared";
import { AgeDistributionBarChartCompared } from "./AgeDistributionBarChartCompared/AgeDistributionBarChartCompared";

const WebAnalysisDemographics = () => {
    const services = useMemo(
        () => ({
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
            i18n: i18nFilter(),
        }),
        [],
    );

    const params = services.swNavigator.getParams() as any;
    const apiParams = services.swNavigator.getApiParams(params);
    const { demographicsApiService } = React.useMemo(
        () => ({
            demographicsApiService: new DemographicsApiService(),
        }),
        [],
    );

    const [genderData, genderDataOps] = useLoading();
    const [ageData, ageDataOps] = useLoading();
    const [ageChartData, setAgeChartData] = useState(null);
    const isCompare = params?.key.split(",").length > 1;
    const keysArray = params?.key.split(",");

    const isGenderDataLoading = [useLoading.STATES.INIT, useLoading.STATES.LOADING].includes(
        genderData.state,
    );

    const isAgeDataLoading = [useLoading.STATES.INIT, useLoading.STATES.LOADING].includes(
        ageData.state,
    );

    useEffect(() => {
        const newAgeChartData = ageData.data?.Data;
        if (newAgeChartData) setAgeChartData(newAgeChartData);
    }, [ageData]);

    React.useEffect(() => {
        genderDataOps.load(() => {
            const {
                from,
                to,
                timeGranularity = "Monthly",
                webSource = "Desktop",
                includeSubDomains = params.isWWW === "*",
                isWindow,
                orderBy,
                country,
                key,
            } = apiParams;
            return demographicsApiService.getDemographicsGenderData({
                from,
                to,
                timeGranularity,
                webSource,
                includeSubDomains,
                isWindow,
                orderBy,
                country,
                key: key,
            } as any);
        });
    }, []);

    React.useEffect(() => {
        ageDataOps.load(() => {
            const {
                from,
                to,
                timeGranularity = "Monthly",
                webSource = "Desktop",
                includeSubDomains = params.isWWW === "*",
                isWindow,
                orderBy,
                country,
                key,
            } = apiParams;
            return demographicsApiService.getDemographicsAgeData({
                from,
                to,
                timeGranularity,
                webSource,
                includeSubDomains,
                isWindow,
                orderBy,
                country,
                key: key,
            } as any);
        });
    }, []);

    // case 1: male, case 0: female
    const getGenderPercent = useCallback(
        (gender) => {
            return gender
                ? genderData?.data?.Data[params.key]?.Male
                : genderData?.data?.Data[params.key]?.Female;
        },
        [genderData, params],
    );

    const GenderDistribution = () => {
        return (
            <GenderContainer>
                <BoxContainer>
                    <GenderDistributionPieChart
                        malePercent={getGenderPercent(1)}
                        femalePercent={getGenderPercent(0)}
                        isLoading={isAgeDataLoading}
                    />
                </BoxContainer>
            </GenderContainer>
        );
    };

    const AgeDistribution = () => {
        return (
            <AgeContainer>
                <BoxContainer>
                    <AgeDistributionBarChart
                        ageProps={ageChartData && ageChartData[params.key]}
                        isLoading={isAgeDataLoading}
                    />
                </BoxContainer>
            </AgeContainer>
        );
    };

    const GenderDistributionCompare = () => {
        return (
            <GenderContainerCompare>
                <GenderDistributionBarChartCompared
                    data={genderData?.data?.Data}
                    keys={keysArray}
                    isLoading={isGenderDataLoading}
                />
            </GenderContainerCompare>
        );
    };

    const AgeDistributionCompare = () => {
        return (
            <AgeContainerCompare>
                <AgeDistributionBarChartCompared
                    data={ageChartData}
                    keys={keysArray}
                    isLoading={isAgeDataLoading}
                />
            </AgeContainerCompare>
        );
    };

    return (
        <DemographicsContainer>
            {isCompare ? (
                <>
                    <GenderDistributionCompare />
                    <AgeDistributionCompare />
                </>
            ) : (
                <>
                    <GenderDistribution />
                    <AgeDistribution />
                </>
            )}
        </DemographicsContainer>
    );
};

SWReactRootComponent(WebAnalysisDemographics, "WebAnalysisDemographics");
