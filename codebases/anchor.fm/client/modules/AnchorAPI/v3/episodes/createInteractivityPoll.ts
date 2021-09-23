import {
  InteractivityPollsResponse,
  PollFormData,
} from './fetchInteractivityPoll';

export async function createInteractivityPoll(
  episodeId: string,
  poll: PollFormData
): Promise<InteractivityPollsResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/episodes/webEpisodeId:${episodeId}/poll`,
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ poll }),
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
