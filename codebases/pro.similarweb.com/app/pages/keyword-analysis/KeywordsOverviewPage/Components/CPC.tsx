import {
    KeywordMetricsSubTitle,
    MetricTitle,
    NoData,
} from "pages/keyword-analysis/KeywordsOverviewPage/Components/UtilityComponents";
import {
    CpcText,
    LoadingSpinner,
} from "pages/keyword-analysis/KeywordsOverviewPage/StyledComponents";
import { CPCFilter, CPCGroupFilter, i18nFilter } from "filters/ngFilters";
import React, { useState } from "react";
import { DefaultFetchService } from "services/fetchService";

const EndPoint = "widgetApi/KeywordAnalysisOP/KeywordAnalysisCPC/SingleMetric";
const SubTitleKey = "KeywordAnalysis.organic.cpc.subtitle";
const HeadLineKey = "KeywordAnalysis.organic.widgets.cpc";
const KeywordTooltipKey = "KeywordAnalysis.paid.widgets.cpc.tooltip";
const KeywordsGroupTooltipKey = "KeywordAnalysis.paid.widgets.cpc.keywordgroup.tooltip";

const CPCInner = (props) => {
    const { isKeywordsGroup, queryParams } = props;
    const [cpcValue, setCpcValue] = useState({ undefined });
    const [isLoading, setIsLoading] = useState(true);
    const setData = async () => {
        const fetchService = DefaultFetchService.getInstance();
        try {
            const data = await fetchService.get<{ Data: { CPC: any } }>(EndPoint, queryParams);
            setCpcValue(Object.values(data.Data)[0]?.CPC);
        } finally {
            setIsLoading(false);
        }
    };
    React.useEffect(() => {
        setData();
    }, [queryParams]);
    const i18n = i18nFilter();
    const headLineTooltipKey = isKeywordsGroup ? KeywordsGroupTooltipKey : KeywordTooltipKey;
    return (
        <>
            <MetricTitle headline={i18n(HeadLineKey)} tooltip={i18n(headLineTooltipKey)} />
            {isLoading ? (
                <LoadingSpinner />
            ) : !cpcValue ||
              Object.values(cpcValue).length === 0 ||
              // if every value is zero or zero-like
              Object.values(cpcValue).every((v) => !Number(v)) ? (
                <NoData />
            ) : (
                <>
                    <KeywordMetricsSubTitle subtitle={i18n(SubTitleKey)} />
                    <CpcText fontSize={38} fontWeight={300}>
                        {isKeywordsGroup ? CPCGroupFilter()(cpcValue) : CPCFilter()(cpcValue)}
                    </CpcText>
                </>
            )}
        </>
    );
};

const propsAreEqual = (prevProps, nextProps) =>
    prevProps.queryParams?.keyword === nextProps.queryParams?.keyword;
export const CPC = React.memo(CPCInner, propsAreEqual);
