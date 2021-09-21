import { useFetchSpanStatus } from 'client/hooks/span/useSpanStatus';
import AnchorAPI from 'client/modules/AnchorAPI';
import { LibraryAudio } from 'client/modules/AnchorAPI/fetchAudioLibrary';
import { Audio } from 'client/modules/AnchorAPI/v3/episodes';
import { WaveformAudioInfo } from 'client/screens/EpisodeScreen/context';
import { useQuery } from 'react-query';

export const USE_FETCH_EPISODE_AUDIO_KEY = 'useAdInsertion';
type AdInsertionAudioType = WaveformAudioInfo &
  Pick<Audio, 'type' | 'duration'>;

type AdInsertionParams = {
  webEpisodeId?: string;
  libraryAudios?: LibraryAudio[];
};

/**
 * this hook will determine if a user can use the waveform UI to insert ads:
 * - is a SPAN user OR Studio creator
 * - episode has a single original audio (e.g. not a transition)
 *
 * this hook accepts an optional `libraryAudios` value which is used in the case
 * where the user is trying to insert ads on the episode builder. in this case,
 * we should use the audios that the current user has in the staging area of their
 * episode and NOT fetch the episodes audios. this is because when the user is editing
 * their episode in the episode builder, the segments have not been saved yet,
 * so we cannot rely on fetching the episodes segments from the server because
 * it will not reflect the changes the user has made in the staging area.
 *
 * if no `libraryAudios` is provided, we will fallback to fetching the episode's
 * audios.
 */
export function useAdInsertion({
  webEpisodeId,
  libraryAudios,
}: AdInsertionParams) {
  const { isSPANUser } = useFetchSpanStatus();

  // TODO: Update with `usePodcastMetadata` hook to get studio creator flag
  // https://anchorfm.atlassian.net/browse/PODRACER-1926
  const isStudioCreator = false;
  const isWaveformAdInsertionUser = isSPANUser || isStudioCreator;

  /**
   * only enable the query if:
   * - webEpisodeId is defined
   * - user is allowed to use waveform
   * - libraryAudios have not been provided or there are no audios in the array
   */
  const enableFetchEpisodeAudioQuery =
    !!webEpisodeId &&
    isWaveformAdInsertionUser &&
    (libraryAudios === undefined || libraryAudios.length === 0);

  const { data, status } = useQuery(
    [USE_FETCH_EPISODE_AUDIO_KEY, webEpisodeId],
    () => {
      return AnchorAPI.fetchEpisodeAudio({ webEpisodeId: webEpisodeId! });
    },
    { enabled: enableFetchEpisodeAudioQuery }
  );
  const episodeAudios = getEpisodeAudios({
    libraryAudios,
    audios: data?.audios,
  });
  const isWaveformAdInsertionEpisode = getIsWaveformAdInsertionEpisode({
    audios: episodeAudios,
  });
  const { duration, audioId, url, caption } = episodeAudios[0] || {};

  return {
    isWaveformAdInsertionEpisode,
    isWaveformAdInsertionUser,
    duration,
    audioId,
    url,
    caption,
    status,
  };
}

/**
 * returns a new array of audios derived from audios fetched from one of two places:
 * - audio library via episode builder's staging area
 * - directly fetching the episode audio (via the useQuery in the `useAdInsertion` hook)
 */
function getEpisodeAudios({
  libraryAudios,
  audios,
}: {
  libraryAudios?: LibraryAudio[];
  audios?: Audio[];
}): AdInsertionAudioType[] {
  if (libraryAudios?.length) {
    return libraryAudios.map(libraryAudio => {
      const { duration, audioId, caption, url, type } = libraryAudio;
      return { duration, audioId, caption, url: url || undefined, type };
    });
  }
  if (audios?.length) {
    return audios.map(audio => {
      const { duration, audioId, caption, urls, type } = audio;
      const { url } = urls ? urls[0] : { url: undefined };
      return {
        duration,
        audioId,
        caption,
        url,
        type,
      };
    });
  }
  return [];
}

function getIsWaveformAdInsertionEpisode({
  audios,
}: {
  audios: AdInsertionAudioType[];
}) {
  // if no audio or more than one audio, user can't use waveform
  if (audios.length === 0 || audios.length > 1) return false;

  // if audio is user generated, user can use waveform
  if (
    !['ad', 'interlude', 'music', 'shoutout', 'callin'].includes(audios[0].type)
  )
    return true;

  // fallback to false
  return false;
}
