import React from "react";
import { SWReactCountryIcons } from "@similarweb/icons";
import CountryService from "services/CountryService";
import { abbrNumberFilter } from "filters/ngFilters";
import { AdNetwork } from "../../types/adNetwork";
import * as s from "./styles";
import { formatAdNetworkSharePercentage } from "../../helpers";
import AdNetworkDetailsHead from "./AdNetworkDetailsHead";
import AdNetworkOtherCountries from "./AdNetworkOtherCountries";

//TODO: Add to refactoring

type AdNetworkDetailsProps = {
    adNetwork: AdNetwork;
    restAdNetworks: AdNetwork[];
};

const AdNetworkDetails: React.FC<AdNetworkDetailsProps> = (props) => {
    const { adNetwork, restAdNetworks } = props;
    const otherVisitsCount =
        adNetwork.visits - restAdNetworks.reduce((sum, an) => sum + an.visits, 0);

    return (
        <s.StyledAdNetworkDetails>
            <s.StyledCountriesList>
                <AdNetworkDetailsHead />
                {restAdNetworks.map((an) => (
                    <s.StyledCountryRow key={an.country}>
                        <s.StyledCountryColumn>
                            <SWReactCountryIcons countryCode={an.country} />
                            <s.StyledCountryName>
                                {CountryService.getCountryById(an.country)?.text}
                            </s.StyledCountryName>
                        </s.StyledCountryColumn>
                        <s.StyledSimpleColumn>
                            <span>{formatAdNetworkSharePercentage(an.share)}</span>
                        </s.StyledSimpleColumn>
                        <s.StyledSimpleColumn>
                            <span>{abbrNumberFilter()(an.visits)}</span>
                        </s.StyledSimpleColumn>
                    </s.StyledCountryRow>
                ))}
                {otherVisitsCount > 0 && <AdNetworkOtherCountries visits={otherVisitsCount} />}
            </s.StyledCountriesList>
        </s.StyledAdNetworkDetails>
    );
};

export default React.memo(AdNetworkDetails);
