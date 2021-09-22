import React from "react";
import ItemContainer from "../Item/ItemContainer";
import { BenchmarkResultType } from "../../types/benchmarks";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { SIDEBAR_TAB_ABOUT_LINK_TO_ALL_OPPORTUNITIES } from "pages/workspace/sales/sub-modules/feed/constants";
import { IconButton } from "@similarweb/ui-components/dist/button/src/IconButton";
import {
    StyledLink,
    StyledTitleBenchmarkAbout,
    StyledHeaderBenchmarkAbout,
    StyledBenchmarkAbout,
    StyledBenchmarkAboutLoader,
} from "./styles";
import { circularLoaderOptions } from "pages/workspace/common/WebsiteExpandData/Tabs/StyledComponents";
import { CircularLoader } from "components/React/CircularLoader";

type TopOpportunityProps = {
    isLoading: boolean;
    topBenchmarkResult: BenchmarkResultType;
    onViewAllClick(metricName: string): void;
};

const TopOpportunity = (props: TopOpportunityProps) => {
    const { topBenchmarkResult, onViewAllClick, isLoading } = props;
    const translate = useTranslation();
    const metricName = translate(
        `workspace.sales.benchmarks.metrics.${topBenchmarkResult?.benchmark.metric ?? ""}.title`,
    );

    const renderCard = () => {
        if (isLoading || !topBenchmarkResult) {
            return (
                <StyledBenchmarkAboutLoader>
                    <CircularLoader options={circularLoaderOptions} />
                </StyledBenchmarkAboutLoader>
            );
        }

        return <ItemContainer benchmarkResult={topBenchmarkResult} />;
    };

    return (
        <StyledBenchmarkAbout>
            <StyledHeaderBenchmarkAbout>
                <StyledTitleBenchmarkAbout>
                    {translate("Top Opportunity")}
                </StyledTitleBenchmarkAbout>
                <StyledLink>
                    <IconButton
                        type="flat"
                        iconName="arrow-right"
                        placement="right"
                        onClick={() => onViewAllClick(metricName)}
                    >
                        {translate(`${SIDEBAR_TAB_ABOUT_LINK_TO_ALL_OPPORTUNITIES}`)}
                    </IconButton>
                </StyledLink>
            </StyledHeaderBenchmarkAbout>
            {renderCard()}
        </StyledBenchmarkAbout>
    );
};

export default TopOpportunity;
