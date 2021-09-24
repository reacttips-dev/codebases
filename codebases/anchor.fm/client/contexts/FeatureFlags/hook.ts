import { useQuery } from 'react-query';
import { AnchorAPI } from '../../modules/AnchorAPI';
import { useCurrentUserCtx } from '../CurrentUser';

export function useFeatureFlags() {
  const {
    state: { userId },
  } = useCurrentUserCtx();
  const { data, status, refetch, remove } = useQuery(
    ['featureFlags', userId],
    () => AnchorAPI.fetchAllEnabledFeatureFlags(userId),
    { enabled: !!userId }
  );

  return {
    state: {
      status,
      featureFlags: data?.allEnabledFlags.map(featureFlag => featureFlag.name),
    },
    handleSetFeatureFlags: refetch,
    resetFeatureFlags: remove,
  };
}
