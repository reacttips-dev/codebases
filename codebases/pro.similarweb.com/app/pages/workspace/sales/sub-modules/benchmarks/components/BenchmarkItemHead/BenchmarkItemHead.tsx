import React from "react";
import { SWReactCountryIcons, SWReactIcons } from "@similarweb/icons";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import CountryService from "services/CountryService";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import * as s from "./styles";
import { METRICS_TRANSLATION_KEY } from "../../constants";
import { makeDisplayDate } from "../../helpers";

type BenchmarkItemHeadProps = {
    date: string;
    prevDate?: string;
    metric: string;
    countryCode: number;
};

const BenchmarkItemHead: React.FC<BenchmarkItemHeadProps> = ({
    countryCode,
    metric,
    date,
    prevDate,
}) => {
    const t = useTranslation();

    return (
        <s.StyledBenchmarkHead>
            <s.StyledBenchmarkInfo>
                <s.StyledBenchmarkName>
                    <span>{t(`${METRICS_TRANSLATION_KEY}.${metric}.title`)}</span>
                    <PlainTooltip
                        maxWidth={200}
                        tooltipContent={t(`${METRICS_TRANSLATION_KEY}.${metric}.tooltip`)}
                    >
                        <s.StyledBenchmarkNameTooltip>
                            <SWReactIcons iconName="info" size="xs" />
                        </s.StyledBenchmarkNameTooltip>
                    </PlainTooltip>
                </s.StyledBenchmarkName>
                <FlexRow alignItems="center">
                    <s.StyledBenchmarkDate>
                        <SWReactIcons size="xs" iconName="daily-ranking" />
                        <span>{makeDisplayDate(date, metric, prevDate)}</span>
                    </s.StyledBenchmarkDate>
                    <s.StyledBenchmarkCountry>
                        <SWReactCountryIcons countryCode={countryCode} />
                        <span>{CountryService.getCountryById(countryCode)?.text}</span>
                    </s.StyledBenchmarkCountry>
                </FlexRow>
            </s.StyledBenchmarkInfo>
        </s.StyledBenchmarkHead>
    );
};

export default React.memo(BenchmarkItemHead);
