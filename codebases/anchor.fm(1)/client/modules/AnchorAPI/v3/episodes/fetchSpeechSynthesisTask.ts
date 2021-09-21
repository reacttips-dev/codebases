import queryString from 'query-string';

export type AudioFile = {
  audioFileId: number;
  audioId: number;
  bitrate?: number;
  isOriginal: boolean;
  isDeleted: boolean;
  url: string;
  sampleRate: number;
  channels: number;
  extension: string;
  fileSize: number;
  hash: string;
  created: string;
  modified?: string | null;
  audioByteStart?: number;
  audioByteEnd?: number;
  duration?: number;
};

type FetchSpeechSynthesisTaskParams = {
  webEpisodeId: string;
  signal?: AbortSignal;
  webStationId: string;
  userId: number;
};

export type TaskStatus = 'success' | 'failure' | 'inProgress';

export type VoiceId = 'Matthew' | 'Joanna';

export type FetchSpeechSynthesisTaskResponse = {
  voiceId: VoiceId;
  status: TaskStatus;
  audio: AudioFile | null;
};

export async function fetchSpeechSynthesisTask({
  webEpisodeId,
  signal,
  webStationId,
  userId,
}: FetchSpeechSynthesisTaskParams): Promise<FetchSpeechSynthesisTaskResponse | null> {
  const url = queryString.stringifyUrl({
    url: `/api/proxy/v3/episodes/webEpisodeId:${webEpisodeId}/speechSynthesisTask`,
    query: {
      webStationId,
      userId: userId.toString(),
    },
  });
  try {
    const response = await fetch(url, { signal });
    if (response.ok) {
      return response.json();
    }
    if (response.status === 404) {
      return null; // if response is 404, no speech synthesis task exists
    }
    throw new Error(
      `Unable to fetch speech syntesis task for episode: ${webEpisodeId}`
    );
  } catch (err) {
    throw new Error(err.message);
  }
}
