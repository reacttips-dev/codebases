import { DISTRIBUTION_STATUS } from '../v3/episodes/fetchEpisodes';

type FetchEpisodeParams = {
  podcastEpisodeId: string;
};

export type FetchEpisodeResponse = {
  created: string;
  createdUnixTimestamp: number;
  description: string | null;
  episodeAudios: any[];
  isDraft: boolean;
  podcastEpisodeId: string;
  podcastEpisodeIsExplicit?: boolean;
  podcastEpisodeNumber?: number;
  podcastEpisodeType?: string;
  podcastSeasonNumber?: number;
  publishOn: string | null;
  safeDescription?: string | null;
  shareLinkEmbedPath?: string;
  shareLinkPath?: string;
  title: string | null;
  episodeImage?: string;
  isPublishedToSpotifyExclusively: boolean;
  episodeDistributionRequestStatus?: DISTRIBUTION_STATUS;
  spotifyShowUrl?: string;
  spotifyUrl?: string;
  reviewState: 'accepted' | 'rejected' | 'pending' | 'none';
  wordpressPostMetadataId?: string;
};

export async function fetchEpisode({
  podcastEpisodeId,
}: FetchEpisodeParams): Promise<FetchEpisodeResponse> {
  try {
    const response = await fetch(`/api/podcastepisode/${podcastEpisodeId}`, {
      method: 'GET',
      credentials: 'same-origin',
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Unable to fetch podcast episode');
  } catch (err) {
    throw new Error(err.message);
  }
}
