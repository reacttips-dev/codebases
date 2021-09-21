export type UpdateEpisodeMetadataValues = {
  description: string | null;
  episodeAudios: any[];
  episodeImage: string | null;
  isDraft: boolean;
  podcastEpisodeIsExplicit: boolean;
  podcastEpisodeNumber: number | null;
  podcastEpisodeType: string | null;
  podcastSeasonNumber: number | null;
  publishOn: string | null;
  title: string;
};

type UpdateEpisodeMetadataParams = {
  podcastEpisodeId: string;
  metadata: UpdateEpisodeMetadataValues;
};

type UpdateEpisodeMetadataResponse = {
  podcastEpisodeId: string;
  description: string;
  title: string;
};

export async function updateEpisodeMetadata({
  podcastEpisodeId,
  metadata,
}: UpdateEpisodeMetadataParams) {
  try {
    const response = await fetch(
      `/api/podcastepisode/${podcastEpisodeId}/metadata`,
      {
        method: 'PUT',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(metadata),
      }
    );
    let error;
    let json;
    if (response.ok) {
      json = await response.json();
    } else {
      error = 'Unexpected error';
    }
    return {
      response,
      json,
      error,
    };
  } catch (err) {
    throw new Error(err.message);
  }
}
