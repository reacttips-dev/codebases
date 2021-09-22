import { Spinner } from "components/Loaders/src/Spinner";
import { NoData } from "components/NoData/src/NoData";
import { i18nFilter } from "filters/ngFilters";
import { AgeDistributionBarChart } from "pages/industry-analysis/demographics/charts/AgeDistributionBarChart/AgeDistributionBarChart";
import React, { FunctionComponent, useMemo } from "react";

import DemographicsTable from "../charts/DemographicsTable/DemographicsTable";
import { GenderDistributionPieChart } from "../charts/GenderDistributionPieChart/GenderDistributionPieChart";
import {
    ContentBox,
    ContentRow,
    IndustryDemographicsContentContainer,
    LeftChartContainer,
    LoaderContainer,
    RightChartContainer,
} from "./IndustryAnalysisDemographicsStyles";
import { IndustryAnalysisDemographicsProps } from "./IndustryAnalysisDemographicsTypes";

const Loader = () => {
    return (
        <LoaderContainer>
            <Spinner />
        </LoaderContainer>
    );
};

const NoDataMessage = ({ title, subtitle }: { title: string; subtitle: string }) => {
    return <NoData title={title} subtitle={subtitle} />;
};

export const IndustryAnalysisDemographics: FunctionComponent<IndustryAnalysisDemographicsProps> = (
    props,
) => {
    const {
        isGenderChartLoading,
        isAgeChartLoading,
        isTableLoading,
        genderChartData,
        ageChartData,
        tableData,
        queryParams,
    } = props;

    const genderChart = useMemo(() => {
        if (isGenderChartLoading) {
            return <Loader />;
        }

        return genderChartData ? (
            <GenderDistributionPieChart {...genderChartData} />
        ) : (
            <NoDataMessage
                title={i18nFilter()("category.demographics.chart.no.data.title")}
                subtitle={i18nFilter()("category.demographics.gender.chart.no.data")}
            />
        );
    }, [isGenderChartLoading, genderChartData]);

    const ageChart = useMemo(() => {
        if (isAgeChartLoading) {
            return <Loader />;
        }

        return ageChartData ? (
            <AgeDistributionBarChart {...ageChartData} />
        ) : (
            <NoDataMessage
                title={i18nFilter()("category.demographics.chart.no.data.title")}
                subtitle={i18nFilter()("category.demographics.age.chart.no.data")}
            />
        );
    }, [isAgeChartLoading, ageChartData]);

    const demographicsTable = useMemo(() => {
        return (
            <DemographicsTable
                tableRecords={tableData}
                isLoading={isTableLoading}
                queryParams={queryParams}
            />
        );
    }, [isTableLoading, tableData]);

    return (
        <IndustryDemographicsContentContainer>
            <ContentBox>
                <ContentRow>
                    <LeftChartContainer>{genderChart}</LeftChartContainer>
                    <RightChartContainer>{ageChart}</RightChartContainer>
                </ContentRow>
                <ContentRow>{demographicsTable}</ContentRow>
            </ContentBox>
        </IndustryDemographicsContentContainer>
    );
};
