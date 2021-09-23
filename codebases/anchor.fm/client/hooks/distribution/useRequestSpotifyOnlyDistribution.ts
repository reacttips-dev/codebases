import { AnchorAPI } from 'client/modules/AnchorAPI';
import { useMutation, useQueryClient } from 'react-query';
import { FETCH_DISTRIBUTION_DATA_QUERY } from './useFetchDistributionData';

function useRequestSpotifyOnlyDistribution(webStationId: string | null) {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isSuccess, isError } = useMutation(
    () => {
      if (!webStationId) {
        return Promise.reject(
          new Error(
            'webStationId is required to opt into Spotify only distribution'
          )
        );
      }
      return AnchorAPI.requestSpotifyOnlyDistribution({
        stationId: webStationId,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(FETCH_DISTRIBUTION_DATA_QUERY);
      },
    }
  );
  return {
    handleSpotifyOnlyDistribution: mutate,
    isLoadingDistribution: isLoading,
    isSuccessDistribution: isSuccess,
    isErrorDistribution: isError,
  };
}

export { useRequestSpotifyOnlyDistribution };
