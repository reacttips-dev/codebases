import { useQueryClient, useMutation } from 'react-query';
import { AnchorAPI } from 'modules/AnchorAPI';
import { useCurrentUserCtx } from 'contexts/CurrentUser';
import { UpdateDistributionParams } from 'client/modules/AnchorAPI/v3/settings/updateDistributionData';
import { FETCH_DISTRIBUTION_DATA_QUERY } from './useFetchDistributionData';

export function useUpdateDistribution() {
  const queryClient = useQueryClient();
  const {
    state: { userId },
  } = useCurrentUserCtx();

  const { mutate, status } = useMutation(
    (params: Omit<UpdateDistributionParams, 'userId'>) => {
      if (!userId) {
        return Promise.reject(
          new Error('userId is required to update distribution data')
        );
      }
      return AnchorAPI.updateDistributionData({
        ...params,
        userId,
      });
    },
    {
      onSuccess: () => {
        return queryClient.invalidateQueries([FETCH_DISTRIBUTION_DATA_QUERY]);
      },
    }
  );

  return { updateDistribution: mutate, status };
}
