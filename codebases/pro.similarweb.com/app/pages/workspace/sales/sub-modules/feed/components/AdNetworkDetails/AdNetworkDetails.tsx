import React from "react";
import { abbrNumberFilter } from "filters/ngFilters";
import * as s from "./styles";
import AdNetworkDetailsHead from "./AdNetworkDetailsHead";
import { SWReactCountryIcons } from "@similarweb/icons";
import CountryService from "services/CountryService";
import { formatAdNetworkSharePercentage } from "pages/workspace/sales/sub-modules/feed/helpers";
import AdNetworkOtherCountries from "./AdNetworkOtherCountries";
import { AdNetworkDetailsProps } from "./types";

const AdNetworkDetails = ({ restAdNetworks = [], adNetwork }: AdNetworkDetailsProps) => {
    const otherVisitsCount =
        adNetwork.visits - restAdNetworks.reduce((sum, an) => sum + an.visits, 0);

    return (
        <s.StyledAdNetworkDetails>
            <s.StyledCountriesList>
                <AdNetworkDetailsHead />
                {restAdNetworks?.map((adNetwork) => (
                    <s.StyledCountryRow key={Math.random()}>
                        <s.StyledCountryColumn>
                            <SWReactCountryIcons countryCode={adNetwork.country} />
                            <s.StyledCountryName>
                                {CountryService.getCountryById(adNetwork.country)?.text}
                            </s.StyledCountryName>
                        </s.StyledCountryColumn>
                        <s.StyledSimpleColumn>
                            <span>{abbrNumberFilter()(adNetwork.visits)}</span>
                        </s.StyledSimpleColumn>
                        <s.StyledSimpleColumn>
                            <span>{formatAdNetworkSharePercentage(adNetwork.share)}</span>
                        </s.StyledSimpleColumn>
                    </s.StyledCountryRow>
                ))}
                {otherVisitsCount > 0 && <AdNetworkOtherCountries visits={otherVisitsCount} />}
            </s.StyledCountriesList>
        </s.StyledAdNetworkDetails>
    );
};

export default React.memo(AdNetworkDetails);
