export async function deleteInteractivityPoll(
  episodeId: string,
  userId: number
): Promise<Response> {
  try {
    const response = await fetch(
      `/api/proxy/v3/episodes/webEpisodeId:${episodeId}/poll`,
      {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ userId }),
      }
    );
    if (response.ok) {
      return response;
    }
    throw new Error('response not OK');
  } catch (e) {
    throw new Error(e.message);
  }
}
