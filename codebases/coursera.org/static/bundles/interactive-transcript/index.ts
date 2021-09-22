import { getDefaultTrack, buildTracks } from 'bundles/interactive-transcript/utils/TrackUtils';

export { default as Track } from 'bundles/interactive-transcript/models/Track';
export { default as TrackList } from 'bundles/interactive-transcript/models/TrackList';
export { default as TrackChooser } from 'bundles/interactive-transcript/components/v1/TrackChooser';
export { default as InteractiveTranscript } from 'bundles/interactive-transcript/components/v1/InteractiveTranscript';
export { default as HelpUsTranslate } from 'bundles/interactive-transcript/components/v1/HelpUsTranslate';
export { TranslationModal } from './components/v1/TranslationModal';

const TrackUtils = {
  getDefaultTrack,
  buildTracks,
};

export { TrackUtils };
