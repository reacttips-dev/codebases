import React from "react";
import * as s from "./styles";
import { abbrNumberFilter } from "filters/ngFilters";
import { FEED_AD_NETWORKS_OTHER_COUNTRIES } from "../../constants";
import { useTranslation } from "components/WithTranslation/src/I18n";

//TODO: Add to refactoring
type AdNetworkOtherCountriesProps = {
    visits: number;
};

const AdNetworkOtherCountries: React.FC<AdNetworkOtherCountriesProps> = ({ visits }) => {
    const t = useTranslation();

    return (
        <s.StyledCountryRow>
            <s.StyledCountryColumn>
                <span>{t(FEED_AD_NETWORKS_OTHER_COUNTRIES)}</span>
            </s.StyledCountryColumn>
            <s.StyledSimpleColumn>
                <span>-</span>
            </s.StyledSimpleColumn>
            <s.StyledSimpleColumn>
                <span>{abbrNumberFilter()(visits)}</span>
            </s.StyledSimpleColumn>
        </s.StyledCountryRow>
    );
};

export default React.memo(AdNetworkOtherCountries);
