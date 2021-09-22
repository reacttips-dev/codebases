import React from 'react';
import { Box } from '@coursera/coursera-ui';

import { TrackChooser, HelpUsTranslate } from 'bundles/interactive-transcript';
import VideoJsTranscriptContainer from 'bundles/item-lecture/components/v1/VideoJsTranscriptContainer';

import { getDefaultTrack, buildTracks } from 'bundles/interactive-transcript/utils/TrackUtils';

import type Track from 'bundles/interactive-transcript/models/Track';
import type { LanguageCode, LanguageMap } from 'bundles/interactive-transcript/types';

import type { VideoPlayer } from 'bundles/item-lecture/types';

import 'css!./__styles__/VideoItemTranscript';

import _t from 'i18n!nls/item-lecture';

type Props = {
  courseId: string;
  itemId: string;
  hideHelpUsTranslate: boolean;
  languageMap: LanguageMap;
  defaultLanguage: LanguageCode;
  player: VideoPlayer;
};

type State = {
  track?: Track;
};

class VideoItemTranscript extends React.Component<Props, State> {
  static defaultProps = {
    hideHelpUsTranslate: false,
  };

  // @ts-expect-error ts-migrate(2416) FIXME: Property 'state' in type 'VideoItemTranscript' is ... Remove this comment to see the full error message
  state = {
    track: null,
  };

  handleTrackSelect = (track: Track) => {
    this.setState({ track });
  };

  render() {
    const { track } = this.state;
    const { languageMap, defaultLanguage, player, hideHelpUsTranslate, itemId, courseId } = this.props;

    const tracks = buildTracks(languageMap);
    const defaultTrack = getDefaultTrack(tracks, defaultLanguage);
    const selectedTrack = track || defaultTrack;

    if (!selectedTrack) {
      return null;
    }

    return (
      <div className="rc-VideoItemTranscript">
        <Box justifyContent="between" style={{ marginBottom: '20px' }}>
          <h4>{_t('Interactive Transcript')}</h4>

          <Box flexDirection="column" alignItems="end">
            <TrackChooser
              tracks={tracks}
              selectedTrack={selectedTrack}
              onTrackSelect={this.handleTrackSelect}
              itemId={itemId}
              courseId={courseId}
            />
            {!hideHelpUsTranslate && <HelpUsTranslate />}
          </Box>
        </Box>

        <VideoJsTranscriptContainer player={player} selectedTrack={selectedTrack} />
      </div>
    );
  }
}

export default VideoItemTranscript;
