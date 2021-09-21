import { IAudio } from '../../types/Audio';
import {
  IBackgroundTrackAudio,
  IBackgroundTrackCategory,
} from '../../types/BackgroundTracks';

const ENDPOINT_URL = '/api/proxy/v3/audioGroup/backgroundTracks';

export const fetchAudioGroup = async () => {
  const response = await fetch(ENDPOINT_URL, {
    method: 'GET',
    credentials: 'same-origin',
  });
  const json = await response.json();
  return json;
};

const getAudio = (audios: IAudio[], matchAudioId: number): IAudio | null => {
  return audios.find((audio: IAudio) => audio.audioId === matchAudioId) || null;
};

export const fetchBackgroundTracks = async (): Promise<
  IBackgroundTrackCategory[]
> => {
  const backgroundTrackJson = await fetchAudioGroup();
  const { audios, backgroundTracks } = backgroundTrackJson;
  return backgroundTracks.map((backgroundTrack: IBackgroundTrackCategory) => {
    const { tracks } = backgroundTrack;
    const backgroundTracksWithAudios = tracks.map(
      (track: IBackgroundTrackAudio) => {
        const matchedAudio = getAudio(audios, track.audioId);
        if (!matchedAudio) return {};
        const { urls } = matchedAudio;
        return {
          ...track,
          url: urls[0].url,
        };
      }
    );
    return {
      ...backgroundTrack,
      tracks: backgroundTracksWithAudios,
    };
  });
};
