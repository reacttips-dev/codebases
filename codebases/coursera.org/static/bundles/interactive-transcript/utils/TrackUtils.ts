import { parse as nodeWebVttParse } from 'bundles/interactive-transcript/utils/webvttParser';

import Q from 'q';
import _ from 'lodash';
import Cue from 'bundles/interactive-transcript/models/Cue';
import Track from 'bundles/interactive-transcript/models/Track';
import TrackList from 'bundles/interactive-transcript/models/TrackList';
import StorageUtils from 'bundles/interactive-transcript/utils/StorageUtils';
import inServerContext from 'bundles/ssr/util/inServerContext';
import API from 'js/lib/api';
import type { LanguageCode, Languages } from 'bundles/video-logged-out-page/types/vlpSharedTypes';

// This exports WebVTT on the window object.
import 'video.js';

declare const WebVTT: any;

declare global {
  interface Window {
    vttjs: any;
  }
}

export const parseCues = (sourceContent: any) => {
  if (inServerContext) {
    return nodeWebVttParse(sourceContent).cues;
  }

  const cues: Array<Cue> = [];
  const parser = new WebVTT.Parser(window, window.vttjs, new WebVTT.StringDecoder());

  parser.oncue = (cue: $TSFixMe) => cues.push(cue);
  parser.onparsingerror = (error: $TSFixMe) => {
    throw new Error('Error parsing track: ' + error);
  };

  parser.parse(sourceContent);
  parser.flush();
  return cues;
};

export const loadTrack = (track: Track): Q.Promise<Track> => {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'isLoaded' does not exist on type 'Track'... Remove this comment to see the full error message
  if (track.isLoaded) {
    return Q(track);
  }

  const constructCues = (data: $TSFixMe) => {
    const _track = track;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'sourceContent' does not exist on type 'T... Remove this comment to see the full error message
    _track.sourceContent = data;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isLoaded' does not exist on type 'Track'... Remove this comment to see the full error message
    _track.isLoaded = true;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'sourceContent' does not exist on type 'T... Remove this comment to see the full error message
    const cues = parseCues(_track.sourceContent);

    // @ts-ignore ts-migrate(2339) FIXME: Property 'cues' does not exist on type 'Track'.
    _track.cues = _.sortBy(
      _.filter(
        _.map(_.compact(cues), (cue: any, index) => {
          // On server side, we're using node-webvtt which returns slightly different property name
          if (inServerContext) {
            return new Cue(cue.identifier, index, cue.text, cue.start, cue.end);
          }
          return new Cue(cue.id, index, cue.text, cue.startTime, cue.endTime);
        }),
        (cue) => !!cue.text.trim()
      ),
      'index'
    );

    return _track;
  };

  const api = API('', { type: 'rest' });
  return (
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'url' does not exist on type 'Track'.
    Q(api.get(track.url))
      .then(constructCues)
      // @ts-expect-error TSMIGRATION
      .catch((xhr: any, status: string, error: string) => {
        throw new Error(
          `Error loading track. Error: ${error}; status: ${status}; response text: ${JSON.stringify(xhr)}`
        );
      })
  );
};

export const buildTracks = (languages: Languages): TrackList => {
  const tracks: Array<Track> = [];
  // Will treat the __typename field as a separate language if this is not included
  const _filteredLanguages = _.omit(languages, '__typename');

  Object.keys(_filteredLanguages).forEach((key) => {
    const language = languages[key];
    tracks.push(new Track(key, language.label, language.url));
  });

  return new TrackList(tracks);
};

export const getDefaultTrack = (tracks: TrackList, defaultLanguage: LanguageCode) => {
  return (
    // If the user has selected a language previously, use that.
    (!inServerContext && tracks.getFromLanguageCode(StorageUtils.get('language-code'))) ||
    // If not, or if that language is not in the tracks, use the configured default language.
    tracks.getFromLanguageCode(defaultLanguage) ||
    // If the configured default language is not in the tracks, use english.
    tracks.getFromLanguageCode('en') ||
    // If even english subtitles are not found, use the first track in the list. If there is no track,
    // then there are no subtitles and the transcript will not be visible.
    tracks.toArray()[0]
  );
};
