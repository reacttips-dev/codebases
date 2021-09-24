import { useQuery } from 'react-query';
import { AnchorAPI } from '../modules/AnchorAPI';

const FETCH_COUNTRY_CODE_QUERY_KEY = 'fetchListenerCountryCode';

function useListenerCountryCode() {
  const { data, status } = useQuery([FETCH_COUNTRY_CODE_QUERY_KEY], () =>
    AnchorAPI.fetchListenerCountryCode()
  );

  return {
    status,
    data,
  };
}

export { FETCH_COUNTRY_CODE_QUERY_KEY, useListenerCountryCode };
