import React from "react";
import { StyledSiteTrendsItem } from "./styles";
import SiteTrendsItemHeader from "./SiteTrendsItemHeader";
import SiteTrendsGraph from "pages/workspace/sales/sub-modules/site-trends/SiteTrendsGraph/SiteTrendsGraph";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { METRICS_TRANSLATION_KEY } from "pages/workspace/sales/sub-modules/benchmarks/constants";
import { SiteTrends } from "pages/workspace/sales/sub-modules/site-trends/types";
import { ICountryObject } from "services/CountryService";

type SiteTrendsItemProps = SiteTrends & {
    country: ICountryObject;
};

const SiteTrendsItem: React.FC<SiteTrendsItemProps> = (props) => {
    const { metric, trend, country, webSource, units } = props;
    const translate = useTranslation();

    return (
        <StyledSiteTrendsItem>
            <SiteTrendsItemHeader
                title={translate(`${METRICS_TRANSLATION_KEY}.${metric}.title`)}
                countryCode={country.id}
                countryName={country.text}
                webSource={webSource}
            />
            <SiteTrendsGraph data={trend} unites={units} />
        </StyledSiteTrendsItem>
    );
};

export default React.memo(SiteTrendsItem);
