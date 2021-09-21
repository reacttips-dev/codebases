export async function deleteListenerQuestion(
  episodeId: string,
  questionId: number
): Promise<Response> {
  try {
    const response = await fetch(
      `/api/proxy/v3/episodes/webEpisodeId:${episodeId}/question/${questionId}`,
      {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
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
