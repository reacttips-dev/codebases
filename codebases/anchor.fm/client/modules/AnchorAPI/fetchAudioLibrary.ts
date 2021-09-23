import { AudioType } from 'modules/AnchorAPI/v3/episodes/fetchEpisodeAudio';

// https://github.com/AnchorFM/server-common/blob/449dbf3dd0bc42c26119e5f0ed5a431bf3d4d9a9/utilities/episode/constants.js#L11-L23
type AudioColor =
  | '#1cee4e'
  | '#2dcfb3'
  | '#8940fA'
  | '#292f36'
  | '#fface7'
  | '#00b3ce'
  | '#428eff'
  | '#509BF5'
  | '#fd6767'
  | '#d34cef'
  | '#8940fa';

// https://github.com/AnchorFM/server-common/blob/449dbf3dd0bc42c26119e5f0ed5a431bf3d4d9a9/models/audioTransformationRequest/index.d.ts#L10
type AudioTransformationStaus = 'waiting' | 'started' | 'failed' | 'finished';

export type LibraryAudio = {
  audioId: string;
  audioTransformationName: string | null;
  audioTransformationStatus: AudioTransformationStaus;
  caption: string | null;
  color: AudioColor;
  created: string;
  derivedFromAudioId: number | null;
  doesHaveGeneratedVideo: boolean;
  duration: number;
  key: string;
  modified: string | null;
  originalAudioId: number;
  originalAudioWebId: string;
  sort: number;
  type: AudioType;
  url: string | null;
  userId: number | null;
};

type UserDictionary = {
  bio: string | null;
  name: string;
  userId: number;
};

type FetchAudioLibraryResponse = {
  audios: LibraryAudio[];
  userDictionary: UserDictionary;
};

const getEndpointUrl = (isCacheBust: boolean) => {
  const timestampParam = isCacheBust ? `?timestamp=${Date.now()}` : '';
  return `/api/sourceaudio/audiolibrary${timestampParam}`;
};

export const fetchAudioLibrary = async (
  isCacheBust: boolean
): Promise<FetchAudioLibraryResponse> => {
  const response = await fetch(getEndpointUrl(isCacheBust), {
    method: 'GET',
    credentials: 'same-origin',
  });
  if (!response.ok) {
    throw response;
  }
  return response.json();
};
