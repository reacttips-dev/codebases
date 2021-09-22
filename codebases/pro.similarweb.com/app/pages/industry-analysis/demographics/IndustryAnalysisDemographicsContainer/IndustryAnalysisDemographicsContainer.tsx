import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import {
    IAgeChartDistributionData,
    IDemographicsTableRecordData,
    IGenderChartDistributionData,
} from "pages/industry-analysis/demographics/industryAnalysisDemographics/IndustryAnalysisDemographicsTypes";
import {
    adaptAgeDistributionChartData,
    adaptDemographicsTableData,
    adaptGenderDistributionChartData,
} from "pages/industry-analysis/demographics/IndustryAnalysisDemographicsContainer/DemographicsDataHandler";
import React, { useEffect, useMemo, useState } from "react";

import { getApiService } from "../Api/DemographicsApiServiceFactory";
import { IDemographicsApiParams } from "../Api/DemographicsApiServiceTypes";
import { IndustryAnalysisDemographics } from "../industryAnalysisDemographics/IndustryAnalysisDemographics";

const IndustryAnalysisDemographicsContainer = () => {
    const [genderChartLoading, setGenderChartLoading] = useState(true);
    const [genderChartData, setGenderChartData] = useState<IGenderChartDistributionData>(null);

    const [ageChartLoading, setAgeChartLoading] = useState(true);
    const [ageChartData, setAgeChartData] = useState<IAgeChartDistributionData>(null);

    const [tableLoading, setTableLoading] = useState(true);
    const [tableData, setTableData] = useState<IDemographicsTableRecordData[]>(null);

    const { services } = useMemo(() => {
        return {
            services: {
                swNavigator: Injector.get<SwNavigator>("swNavigator"),
                apiService: getApiService(),
                swSettings,
            },
        };
    }, []);

    const pageFilters = useMemo<IDemographicsApiParams>(() => {
        const routeParams = services.swNavigator.getParams();
        const apiParams: IDemographicsApiParams = services.swNavigator.getApiParams(routeParams);
        return apiParams;
    }, []);

    useEffect(() => {
        /**
         * Fetch gender distribution data for the gender distribution pie chart
         */
        const loadGenderData = async () => {
            try {
                setGenderChartLoading(true);
                const genderApiData = await services.apiService.getDemographicsGenderDistribution(
                    pageFilters,
                );
                const genderChartData = adaptGenderDistributionChartData(
                    genderApiData,
                    pageFilters,
                );
                setGenderChartData(genderChartData);
            } catch (e) {
                setGenderChartData(null);
            } finally {
                setGenderChartLoading(false);
            }
        };

        /**
         * Fetch age distribution data for the age distribution bar chart
         */
        const loadAgeData = async () => {
            try {
                const ageApiData = await services.apiService.getDemographicsAgeDistribution(
                    pageFilters,
                );
                const ageChartData = adaptAgeDistributionChartData(ageApiData, pageFilters);
                setAgeChartData(ageChartData);
            } catch (e) {
                setAgeChartData(null);
            } finally {
                setAgeChartLoading(false);
            }
        };

        /**
         * Fetch data for the demographics data table
         */
        const loadTableData = async () => {
            try {
                setTableLoading(true);
                const tableApiData = await services.apiService.getDemographicsTable(pageFilters);
                const tableData = adaptDemographicsTableData(tableApiData, services.swNavigator);
                setTableData(tableData);
            } catch (e) {
                setTableData(null);
            } finally {
                setTableLoading(false);
            }
        };

        loadGenderData();
        loadAgeData();
        loadTableData();
    }, []);

    return (
        <IndustryAnalysisDemographics
            isGenderChartLoading={genderChartLoading}
            isAgeChartLoading={ageChartLoading}
            isTableLoading={tableLoading}
            genderChartData={genderChartData}
            ageChartData={ageChartData}
            tableData={tableData}
            queryParams={pageFilters}
        />
    );
};

export default SWReactRootComponent(
    IndustryAnalysisDemographicsContainer,
    "IndustryAnalysisDemographicsContainer",
);
