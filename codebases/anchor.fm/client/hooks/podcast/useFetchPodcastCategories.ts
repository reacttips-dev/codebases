import { useQuery } from 'react-query';
import { AnchorAPI } from '../../modules/AnchorAPI';

import { PodcastCategoriesResponse } from '../../modules/AnchorAPI/fetchPodcastCategories';

function useFetchPodcastCategories() {
  const { data: podcastCategoriesData } = useQuery<PodcastCategoriesResponse>(
    ['categories'],
    () => AnchorAPI.fetchPodcastCategories() // get backend to fix the format of the categories options
  );

  return {
    podcastCategoriesData,
  };
}

export { useFetchPodcastCategories };
