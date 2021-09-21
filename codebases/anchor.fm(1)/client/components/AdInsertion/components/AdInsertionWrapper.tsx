import React from 'react';
import { useAdInsertion } from 'hooks/span/useAdInsertion';
import { AdInsertion } from 'components/AdInsertion';
import { AdInsertionUIType } from 'components/AdInsertion/types';
import { AdInsertionLibraryAudio } from 'screens/EpisodeEditorScreen/components/AddSponsorSegmentButton';

// TODO: add a discriminating union for `addAdSegmentButton` vs the others
// only `addAdSegmentButton` would need the `libraryAudios`
// https://anchorfm.atlassian.net/browse/PODRACER-1940/
type AdInsertionWrapperProps = {
  webEpisodeId: string;
  kind?: AdInsertionUIType;
  libraryAudios?: AdInsertionLibraryAudio[];
};

/**
 * Wraps the <AdInsertion /> in order to make ad insertion UI more portable
 *
 * This wrapping component determines if a user should see the ad insertion UI
 * and fetches the necessary audio data
 * needed to render the ad insertion waveform
 */
export function AdInsertionWrapper({
  webEpisodeId,
  kind = 'section',
  libraryAudios,
}: AdInsertionWrapperProps) {
  const {
    status: statusFetchEpisodeAudio,
    isWaveformAdInsertionEpisode,
    isWaveformAdInsertionUser,
    audioId,
    url,
    caption,
    duration,
  } = useAdInsertion({ webEpisodeId, libraryAudios });
  const isWaveformEnabled =
    isWaveformAdInsertionEpisode && isWaveformAdInsertionUser;

  function renderAdInsertionComponent() {
    return (
      <AdInsertion
        isWaveformEnabled={isWaveformEnabled}
        duration={duration}
        podcastEpisodeId={webEpisodeId}
        // TODO: Make setPodcastEpisodeId optional https://anchorfm.atlassian.net/browse/PODRACER-1956
        // setPodcastEpisodeId is a required prop for one of the underlying hooks for creating cue points,
        // but with the way this component is used, this function will never be called.
        setPodcastEpisodeId={() => {}}
        waveformAudioInfo={{
          audioId,
          url,
          caption,
        }}
        kind={kind}
      />
    );
  }

  switch (statusFetchEpisodeAudio) {
    case 'loading':
      // placeholder, need design input
      return (
        <div>
          <h3>Loading ad insertion UI</h3>
        </div>
      );
    case 'idle': {
      // this is the case where the `libraryAudios` are provided and we do not
      // need to fetch the episode audio from the API

      // if a user cannot use the waveform OR the library audio is empty, show nothing
      if (!isWaveformEnabled || !audioId) return null;
      return renderAdInsertionComponent();
    }
    case 'success': {
      // success means that we fetched for the episode audio and will use
      // that to render the ad insertion UI
      return renderAdInsertionComponent();
    }
    case 'error':
      // placeholder, need design input
      return (
        <div>
          <h3>Error fetching episode audio for ad insertion</h3>
        </div>
      );
    default:
      return null;
  }
}
