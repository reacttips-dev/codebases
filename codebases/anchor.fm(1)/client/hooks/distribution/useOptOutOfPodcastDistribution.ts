import { useQueryClient, useMutation } from 'react-query';
import { AnchorAPI } from '../../modules/AnchorAPI';
import { FETCH_PODCAST_OBJECT_QUERY } from '../podcast/useFetchAndConstructPodcastObject';

function useOptOutOfPodcastDistribution(
  webStationId: string | null,
  onFinishDeclineDistribution?: () => void
) {
  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    () => {
      if (!webStationId) {
        return Promise.reject(
          new Error('webStationId is required to opt out of distribution')
        );
      }
      return AnchorAPI.optOutOfPodcastDistribution({ webStationId });
    },
    {
      onSuccess: () => {
        if (onFinishDeclineDistribution) onFinishDeclineDistribution();
        queryClient.invalidateQueries(FETCH_PODCAST_OBJECT_QUERY);
      },
    }
  );
  return { handleOptOutPodcastDistribution: mutate };
}

export { useOptOutOfPodcastDistribution, FETCH_PODCAST_OBJECT_QUERY };
