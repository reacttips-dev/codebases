import { Metadata } from 'client/types/Metadata';
import { useQuery } from 'react-query';
import { AnchorAPI } from '../modules/AnchorAPI';

const FETCH_PODCAST_METADATA_QUERY_KEY = 'fetchPodcastMetadata';

export function useFetchPodcastMetadata() {
  const { data, status, refetch } = useQuery<Metadata>(
    [FETCH_PODCAST_METADATA_QUERY_KEY],
    () => AnchorAPI.fetchMyPodcastMetadata()
  );

  return {
    data,
    status,
    refetch,
  };
}
