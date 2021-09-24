import { CONVERSION_ERRORS } from '../../../../components/WordPressPostToAudioModal/components/TextToSpeech/useTextConversion';
import { VoiceId } from './fetchSpeechSynthesisTask';

type CreateSpeechSynthesisTaskParams = {
  webStationId: string;
  userId: number;
  webEpisodeId: string;
  voiceId: VoiceId;
  isNeural?: boolean;
  style?: 'conversational' | 'news';
  signal?: AbortSignal;
};

export type CreateSpeechSynthesisTaskResponse = { status: number };

export async function createSpeechSynthesisTask({
  webStationId,
  userId,
  webEpisodeId,
  voiceId,
  isNeural,
  style,
  signal,
}: CreateSpeechSynthesisTaskParams): Promise<
  CreateSpeechSynthesisTaskResponse
> {
  try {
    const response = await fetch(
      `/api/proxy/v3/episodes/webEpisodeId:${webEpisodeId}/speechSynthesisTask`,
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          voiceId,
          isNeural,
          style,
          userId,
          webStationId,
        }),
        signal,
      }
    );
    if (response.ok) {
      return response;
    }
    if (response.status === 429) {
      throw new Error(CONVERSION_ERRORS.RATE_LIMITED);
    }
    throw new Error(
      `Unable to create speech synthesis task for episode: ${webEpisodeId}`
    );
  } catch (err) {
    throw new Error(err.message);
  }
}
