import { useQuery } from 'react-query';
import { useCurrentUserCtx } from '../contexts/CurrentUser';
import { AnchorAPI } from '../modules/AnchorAPI';

const FETCH_SPONSORSHIPS_QUERY_KEY = 'fetchSponsorships';

function useSponsorships() {
  const {
    state: { webStationId },
  } = useCurrentUserCtx();
  const { data, status, refetch } = useQuery(
    [FETCH_SPONSORSHIPS_QUERY_KEY, webStationId],
    () => AnchorAPI.fetchSponsorships(webStationId!),
    { enabled: !!webStationId }
  );
  const { activationLifeCycleState, activationListenerThreshold, campaigns } =
    data || {};
  return {
    status,
    refetch,
    activationLifeCycleState,
    activationListenerThreshold,
    campaigns,
  };
}

export { FETCH_SPONSORSHIPS_QUERY_KEY, useSponsorships };
