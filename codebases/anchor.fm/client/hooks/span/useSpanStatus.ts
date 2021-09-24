import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useCurrentUserCtx } from 'client/contexts/CurrentUser';
import { UpdateSpanStatusParams } from 'client/modules/AnchorAPI/v3/span/updateSpanStatus';
import { AnchorAPI } from 'client/modules/AnchorAPI';

const FETCH_SPAN_STATUS_QUERY_KEY = 'fetchSpanStatus';

function useFetchSpanStatus() {
  const {
    state: { webStationId },
  } = useCurrentUserCtx();
  const { data: spanStatusData, status, refetch } = useQuery(
    [FETCH_SPAN_STATUS_QUERY_KEY, webStationId],
    () => AnchorAPI.fetchSpanStatus(webStationId!),
    { enabled: !!webStationId }
  );

  const spanStatus =
    spanStatusData?.spanActivationLifeCycleState || 'notEligible';
  // users who have activated or deactivated SPAN will have access to the SPAN
  // tools like ad insertion via waveform
  const isSPANUser = ['deactivated', 'activated'].includes(spanStatus);

  return {
    status,
    refetch,
    spanStatusData,
    isSPANUser,
  };
}

function useUpdateSpanStatus() {
  const queryClient = useQueryClient();
  const {
    state: { webStationId },
  } = useCurrentUserCtx();
  const { mutate: updateSpanStatus, status } = useMutation(
    ({
      spanActivationLifeCycleState,
      countryCode,
    }: Omit<UpdateSpanStatusParams, 'webStationId'>) => {
      if (!webStationId) {
        return Promise.reject(
          new Error(
            'webStationId is required to update Sponsor Read Ads eligibility'
          )
        );
      }
      if (spanActivationLifeCycleState === 'pending') {
        return Promise.reject(
          new Error(
            'The Sponsor Read Ads eligibility cannot be changed to pending'
          )
        );
      }

      return AnchorAPI.updateSpanStatus({
        spanActivationLifeCycleState,
        webStationId,
        countryCode,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(FETCH_SPAN_STATUS_QUERY_KEY);
      },
    }
  );

  return { updateSpanStatus, status };
}

export { FETCH_SPAN_STATUS_QUERY_KEY, useFetchSpanStatus, useUpdateSpanStatus };
