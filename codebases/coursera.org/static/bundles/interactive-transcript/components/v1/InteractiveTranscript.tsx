import React from 'react';
import { SvgLoaderSignal } from '@coursera/coursera-ui/svg';

import Transcript from 'bundles/interactive-transcript/components/v1/Transcript';
import TranscriptHighlighter from 'bundles/interactive-transcript/components/v1/TranscriptHighlighter';

import A11yScreenReaderOnly from 'bundles/a11y/components/A11yScreenReaderOnly';

import { loadTrack } from 'bundles/interactive-transcript/utils/TrackUtils';
import { findCuesAroundTime, buildParagraphs } from 'bundles/interactive-transcript/utils/TranscriptUtils';

import { isVideoHighlightingEnabled } from 'bundles/video-highlighting/utils/highlightingFeatureToggles';

import type Cue from 'bundles/interactive-transcript/models/Cue';
import type Track from 'bundles/interactive-transcript/models/Track';
import type { Highlight, TranscriptSelection } from 'bundles/video-highlighting/types';

import 'css!./__styles__/InteractiveTranscript';
import _t from 'i18n!nls/interactive-transcript';

type Props = {
  time: number;
  track: Track;
  timeDiff?: number;
  highlights: Array<Highlight>;
  onTimeChange: (time: number) => void;
  onRemoveHighlight: (x: string) => void;
  onSaveHighlight: (selection: TranscriptSelection) => void;
  courseId?: string;
  hideTime?: boolean;
  handlePausePlayer: () => void;
};

type State = {
  track: Track;
  cues: Array<Cue>;
  isLoading: boolean;
  targetedHighlight?: Highlight | null;
  componentDidMount: boolean;
  playingCue: Cue | null;
  renderPlainText?: boolean;
};

class InteractiveTranscript extends React.Component<Props, State> {
  static defaultProps = {
    highlights: [],
    onSaveHighlight: () => {},
    onRemoveHighlight: () => {},
    handlePausePlayer: () => {},
  };

  constructor(props: Props) {
    super(props);
    const { track } = props;

    this.state = {
      track,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'cues' does not exist on type 'Track'.
      cues: (track && track.cues) || [],
      isLoading: true,
      playingCue: null,
      targetedHighlight: null,
      componentDidMount: false,
      renderPlainText: false,
    };
  }

  componentDidMount() {
    const { track } = this.state;
    if (track) {
      loadTrack(track).then(this.handleTrackLoaded).done();
    }
    this.setState(() => ({ componentDidMount: true }));
  }

  componentWillReceiveProps(nextProps: Props) {
    const { track: currentTrack } = this.props;
    const { track: nextTrack } = nextProps;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'error' does not exist on type 'Track'.
    if (nextTrack && !nextTrack.error && currentTrack && nextTrack.languageCode !== currentTrack.languageCode) {
      this.setState({ track: nextTrack, isLoading: true });

      loadTrack(nextTrack).then(this.handleTrackLoaded).done();
    }
  }

  handleTrackLoaded = () => {
    const { track } = this.state;

    // @ts-ignore ts-migrate(2339) FIXME: Property 'cues' does not exist on type 'Track'.
    if (!track || !track.cues) {
      return;
    }

    this.setState(() => ({
      isLoading: false,
      // @ts-ignore ts-migrate(2339) FIXME: Property 'cues' does not exist on type 'Track'.
      cues: track.cues,
    }));
  };

  handleCueClick = (cue: Cue, isKeyPress = false) => {
    const { onTimeChange, handlePausePlayer } = this.props;
    const { playingCue } = this.state;
    const isCurrentCueClick = playingCue === cue;
    const shouldPlayCue = !isKeyPress || (isKeyPress && !isCurrentCueClick);

    if (shouldPlayCue) {
      onTimeChange(cue.startTime + 0.01);
      this.setState({
        playingCue: cue,
      });
    } else {
      handlePausePlayer();
      this.setState({
        playingCue: null,
      });
    }
  };

  handleHighlightSelection = (targetedHighlight?: Highlight | null) => {
    const { targetedHighlight: existingTargetedHighlight } = this.state;
    if (targetedHighlight !== existingTargetedHighlight) {
      this.setState({ targetedHighlight });
    }
  };

  handleInteractiveEffectDisable = (event: React.KeyboardEvent | KeyboardEvent) => {
    // KeyCode 27 = Escape Key
    if (event.keyCode === 27) {
      const { renderPlainText } = this.state;
      this.setState({ renderPlainText: !renderPlainText });
    }
  };

  render() {
    const { time, timeDiff, highlights, onSaveHighlight, onRemoveHighlight, courseId, hideTime } = this.props;
    const { cues, track, isLoading, targetedHighlight, componentDidMount, renderPlainText } = this.state;

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'isLoaded' does not exist on type 'Track'... Remove this comment to see the full error message
    const isTrackLoading = isLoading && (!track || !track.isLoaded);
    const includeHighlighting = courseId ? isVideoHighlightingEnabled(courseId) : false;

    if (!track) {
      return null;
    }

    const activeCues = componentDidMount ? findCuesAroundTime(cues, time) : [];
    const showTranscript = !isTrackLoading && cues && cues.length > 0;

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div onKeyDown={this.handleInteractiveEffectDisable} className="rc-InteractiveTranscript body-1-text">
        {isTrackLoading && (
          <div className="horizontal-box align-items-absolute-center" style={{ height: '100px' }}>
            <SvgLoaderSignal />
          </div>
        )}

        <A11yScreenReaderOnly tagName="span">
          <h3>
            {renderPlainText
              ? _t('Basic Transcript - Enable interactive transcript mode by pressing the escape key')
              : _t('Interactive Transcript - Enable basic transcript mode by pressing the escape key')}
          </h3>
        </A11yScreenReaderOnly>

        {showTranscript && includeHighlighting && (
          <TranscriptHighlighter
            highlights={highlights}
            onSave={onSaveHighlight}
            onRemove={onRemoveHighlight}
            onSelect={this.handleHighlightSelection}
          >
            <Transcript
              highlights={highlights}
              activeCues={activeCues}
              onCueClick={this.handleCueClick}
              targetedHighlight={targetedHighlight}
              paragraphs={timeDiff ? buildParagraphs(cues, timeDiff) : buildParagraphs(cues)}
              hideTime={hideTime}
              renderPlainText={renderPlainText}
            />
          </TranscriptHighlighter>
        )}

        {showTranscript && !includeHighlighting && (
          <Transcript
            highlights={highlights}
            activeCues={activeCues}
            targetedHighlight={null}
            onCueClick={this.handleCueClick}
            paragraphs={timeDiff ? buildParagraphs(cues, timeDiff) : buildParagraphs(cues)}
            hideTime={hideTime}
            renderPlainText={renderPlainText}
          />
        )}
      </div>
    );
  }
}

export default InteractiveTranscript;
