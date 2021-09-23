import { AnchorAPIError } from '.';
import { PodcastEpisode } from '../../hooks/usePodcastEpisodes';
import { Metadata } from '../../types/Metadata';
import { PodcastUrlDictionary } from './fetchPodcastStatus';
import { Audio } from './v3/episodes';

type PodcastUserDictionary = {
  [userId: number]: {
    imageUrl: string;
    name: string;
  };
};

export type FetchPodcastProfileResponse = {
  creator: {
    generatedImage: string;
    name: string;
    url: string;
    userId: number;
    vanitySlug: string;
  };
  episode: PodcastEpisode;
  episodeAudios: Audio[];
  episodes: PodcastEpisode[];
  podcastMetadata: Metadata;
  podcastUrlDictionary: PodcastUrlDictionary;
  trailerUrl: string;
  userDictionary: PodcastUserDictionary;
};

async function fetchPodcastProfile(
  stationId: string
): Promise<FetchPodcastProfileResponse> {
  try {
    const response = await fetch(
      `/api/v3/profile/${stationId}?doAuthenticate`,
      {
        credentials: 'same-origin',
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new AnchorAPIError(
      response,
      `Non 200 response status: ${response.status}`
    );
  } catch (err) {
    throw new Error(err.messages);
  }
}

export { fetchPodcastProfile };
