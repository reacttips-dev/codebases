import { getHourOffset } from '../../Date';

type CreateEpisodeParams = {
  description?: string;
  episodeAudios?: any[];
  title?: string;
};

export type CreateEpisodeResponse = {
  episodeAudios: any;
  podcastEpisodeId: string;
};

export async function createEpisode(
  params: CreateEpisodeParams = {}
): Promise<CreateEpisodeResponse> {
  try {
    const response = await fetch('/api/podcastepisode', {
      method: 'POST',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        ...params,
        hourOffset: getHourOffset(),
        episodeAudios: params.episodeAudios || [],
      }),
    });
    if (response.ok) {
      return response.json();
    }
    throw new Error('Unable to create podcast episode');
  } catch (err) {
    throw new Error(err.message);
  }
}
