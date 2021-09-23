type UpdateEpisodeMediaParameters = {
  episodeId: string;
  audioIdsInOrder: string[];
};

type UpdateEpisodeMediaResponse = {
  status: 'ok';
};

/**
 * passing in an empty array will remove all media from an episode
 */
export async function updateEpisodeMedia({
  episodeId,
  audioIdsInOrder,
}: UpdateEpisodeMediaParameters): Promise<UpdateEpisodeMediaResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/episodes/webEpisodeId:${episodeId}/reorder`,
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          audioIdsInOrder,
        }),
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Could not update episode media`);
  } catch (err) {
    throw new Error(err.message);
  }
}
