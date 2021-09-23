import { useCurrentUserCtx } from 'client/contexts/CurrentUser';
import { FetchDistributionDataResponse } from 'client/modules/AnchorAPI/v3/settings/fetchDistributionData';
import { useQuery } from 'react-query';
import { AnchorAPI } from '../../modules/AnchorAPI';

export const FETCH_DISTRIBUTION_DATA_QUERY = 'distributionData';

function useFetchDistributionData() {
  const {
    state: { userId },
  } = useCurrentUserCtx();
  const {
    data: distributionData,
    status: distributionStatus,
    refetch: refetchDistributionData,
  } = useQuery<FetchDistributionDataResponse>(
    [FETCH_DISTRIBUTION_DATA_QUERY, userId],
    () => AnchorAPI.fetchDistributionData({ currentUserId: userId }),
    { enabled: !!userId }
  );

  return { distributionData, distributionStatus, refetchDistributionData };
}

export { useFetchDistributionData };
