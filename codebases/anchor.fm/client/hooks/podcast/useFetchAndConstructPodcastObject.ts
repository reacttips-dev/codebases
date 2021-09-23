import { useQuery } from 'react-query';
import {
  fetchAndConstructPodcastObject,
  PodcastObject,
} from '../../modules/AnchorAPI/fetchCurrentUsersPodcast';

const FETCH_PODCAST_OBJECT_QUERY = 'podcast';

function useFetchAndConstructPodcastObject() {
  const {
    data: podcast,
    refetch: handleSetPodcast,
    isLoading: isLoadingPodcast,
  } = useQuery<PodcastObject>([FETCH_PODCAST_OBJECT_QUERY], () =>
    fetchAndConstructPodcastObject()
  );

  return {
    podcast,
    handleSetPodcast,
    isLoadingPodcast,
  };
}

export { useFetchAndConstructPodcastObject, FETCH_PODCAST_OBJECT_QUERY };
