import { ListenerQuestion } from './fetchListenerQuestion';

export async function createListenerQuestion(
  episodeId: string,
  text: string
): Promise<ListenerQuestion> {
  try {
    const response = await fetch(
      `/api/proxy/v3/episodes/webEpisodeId:${episodeId}/question`,
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ text }),
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error('response not OK');
  } catch (e) {
    throw new Error(e.message);
  }
}
