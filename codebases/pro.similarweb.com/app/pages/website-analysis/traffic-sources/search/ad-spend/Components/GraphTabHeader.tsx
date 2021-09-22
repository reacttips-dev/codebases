import React, { useMemo } from "react";
import BoxTitle, { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import I18n from "components/React/Filters/I18n";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { i18nFilter } from "filters/ngFilters";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { HeaderFlexColumn, HeaderFlexRow, Title } from "./StyledComponents";
import CountryService from "services/CountryService";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import { StyledHeaderTitle } from "pages/conversion/components/benchmarkOvertime/StyledComponents";
import { ExcelDownload } from "./ExcelDownload";

const SubTitle = ({ fromDate, toDate, country, webSource, duration }) => {
    const subtitleFilters = useMemo(
        () => [
            {
                filter: "date",
                value: {
                    // fix SIM-33187
                    from:
                        fromDate.format("YYYY-MM") !== toDate.format("YYYY-MM")
                            ? fromDate.valueOf()
                            : null,
                    to: toDate.valueOf(),
                    useRangeDisplay: fromDate.format("YYYY-MM") !== toDate.format("YYYY-MM"),
                },
            },
            {
                filter: "country",
                countryCode: country,
                value: CountryService.getCountryById(country)?.text,
            },
            {
                filter: "webSource",
                value: webSource,
            },
        ],
        [fromDate, toDate, country, webSource, duration],
    );
    return <BoxSubtitle filters={subtitleFilters} />;
};
const getDateRange = (durationObject) => {
    return [durationObject.raw.from, durationObject.raw.to];
};
export const GraphTabHeader = (props) => {
    const { webSource, country, duration, durationObject, metricName, queryParams } = props;
    const [fromDate, toDate] = getDateRange(durationObject);
    const tooltip = "analysis.search.adspend.metrics.tooltip";
    return (
        <Title>
            <HeaderFlexColumn>
                <HeaderFlexRow>
                    <StyledHeaderTitle>
                        <BoxTitle>
                            <I18n>analysis.search.adspend.metrics.title</I18n>
                            <PlainTooltip placement="top" text={i18nFilter()(tooltip)}>
                                <span>
                                    <InfoIcon iconName="info" />
                                </span>
                            </PlainTooltip>
                        </BoxTitle>
                    </StyledHeaderTitle>
                    <ExcelDownload metricName={metricName} queryParams={queryParams} />
                </HeaderFlexRow>
                <StyledBoxSubtitle>
                    <SubTitle
                        fromDate={fromDate}
                        toDate={toDate}
                        duration={duration}
                        country={country}
                        webSource={webSource}
                    />
                </StyledBoxSubtitle>
            </HeaderFlexColumn>
        </Title>
    );
};
