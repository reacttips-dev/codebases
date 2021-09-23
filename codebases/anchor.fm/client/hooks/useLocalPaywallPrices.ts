import { useQuery } from 'react-query';
import { AnchorAPI } from '../modules/AnchorAPI';

const FETCH_LOCAL_PRICE = 'fetchLocalPaywallPrices';
const DEFAULT_COUNTRY = 'US';

function useLocalPaywallPrices(countryCode: string, tier: string | undefined) {
  const country = countryCode || DEFAULT_COUNTRY;
  const { data, status, refetch } = useQuery(
    [FETCH_LOCAL_PRICE, country, tier],
    () => AnchorAPI.fetchLocalPaywallPrices(country, tier),
    { enabled: !!tier }
  );
  const { prices } = data || {};
  return {
    status,
    retrieveUpdatedPrice: refetch,
    prices,
  };
}

export { FETCH_LOCAL_PRICE, useLocalPaywallPrices };

