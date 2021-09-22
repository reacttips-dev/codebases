import { ThunkDispatchCommon, ThunkGetState } from "store/types";
import { ThunkDependencies } from "store/thunk-dependencies";
import { findWordWideCountry } from "pages/workspace/sales/sub-modules/site-trends/helpers";
import { ICountryObject } from "services/CountryService";
import {
    fetchAdNetworksThunkAction,
    fetchFeedsThunkAction,
    fetchSiteInfoThunkAction,
    fetchTopCountrysThunkAction,
    fetchTechnologies,
} from "pages/workspace/sales/sub-modules/feed/store/effects";
import { fetchTopBenchmarkThunkAction } from "../../benchmarks/store/effects";
import { setCountryRightBar } from "pages/workspace/sales/sub-modules/common/store/action-creators";
import { fetchSiteTrendsThunkAction } from "pages/workspace/sales/sub-modules/site-trends/store/effects";
import { WORLDWIDE_COUNTRY_ID } from "../../constants";

export const fetchDataForRightBarThunkAction = (
    domain: string,
    activeListId: string | undefined,
    opportunityListCountry: number,
    selectedCountry?: ICountryObject,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    const allowedCountries = deps.si.settingsHelper.getAllowedCountries();
    const country = selectedCountry || findWordWideCountry(allowedCountries) || allowedCountries[0];
    const countryId = country?.id || opportunityListCountry;

    dispatch(setCountryRightBar(country));
    return Promise.all([
        dispatch(fetchSiteInfoThunkAction(domain, WORLDWIDE_COUNTRY_ID)), // SIM-35099 About tab use Worldwide country code only
        dispatch(fetchAdNetworksThunkAction(domain, WORLDWIDE_COUNTRY_ID)),
        dispatch(fetchSiteTrendsThunkAction(String(countryId), domain)),
        dispatch(fetchTopBenchmarkThunkAction(domain, String(countryId))),
        dispatch(fetchFeedsThunkAction(domain)),
        dispatch(fetchTopCountrysThunkAction(domain)),
        dispatch(fetchTechnologies(domain)),
    ]);
};
