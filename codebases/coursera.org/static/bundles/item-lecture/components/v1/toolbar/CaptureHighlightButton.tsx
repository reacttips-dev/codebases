import React from 'react';
import VideoToolbarButton from 'bundles/item-lecture/components/v1/toolbar/VideoToolbarButton';

import HighlightCapturePreview from 'bundles/video-highlighting/components/v1/HighlightCapturePreview';
import { generateHighlightFromCaptureButton } from 'bundles/video-highlighting';

import { color } from '@coursera/coursera-ui';
import { SvgSaveNote } from '@coursera/coursera-ui/svg';

import type { VideoPlayer } from 'bundles/item-lecture/types';
import type { Highlight } from 'bundles/video-highlighting';
import type Track from 'bundles/interactive-transcript/models/Track';

import _t from 'i18n!nls/item-lecture';

const PREVIEW_DURATION = 5000;

type Props = {
  selectedTrack?: Track;
  videoPlayer: VideoPlayer;
  onCapture: (highlight: Highlight) => void;
  onFocusHighlight: (highlight: Highlight) => void;
};

type State = {
  showPreview: boolean;
  isIVQVisible: boolean;
  highlight: Highlight | null;
};

class CaptureHighlightButton extends React.Component<Props, State> {
  previewTimeout: number | null | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      highlight: null,
      showPreview: false,
      isIVQVisible: false,
    };
  }

  componentDidMount() {
    const { videoPlayer } = this.props;

    videoPlayer.emitter.on('videoQuizView.hidden', this.handleIVQHidden);
    videoPlayer.emitter.on('videoQuizView.visible', this.handleIVQVisible);
  }

  componentWillUnmount() {
    const { videoPlayer } = this.props;

    videoPlayer.emitter.on('videoQuizView.hidden', this.handleIVQHidden);
    videoPlayer.emitter.on('videoQuizView.visible', this.handleIVQVisible);
  }

  handleIVQVisible = () => {
    this.setState({ isIVQVisible: true });
  };

  handleIVQHidden = () => {
    this.setState({ isIVQVisible: false });
  };

  handleClick = (event: $TSFixMe) => {
    // NOTE: On hitting SPACE key to activate the button it calls the click event twice [SPACE as a click event buggy behavior]
    // This check is to prevent handleClick from being called twice on SPACE keypress
    if (event.type === 'keypress' && event.key !== 'Enter') return;

    const { selectedTrack, videoPlayer, onCapture } = this.props;
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'Track | undefined' is not assign... Remove this comment to see the full error message
    const highlight = generateHighlightFromCaptureButton(selectedTrack, videoPlayer);

    onCapture(highlight);

    if (this.previewTimeout) {
      clearTimeout(this.previewTimeout);
    }

    this.setState({ highlight, showPreview: true });

    this.previewTimeout = window.setTimeout(() => {
      this.setState({ showPreview: false });
    }, PREVIEW_DURATION);
  };

  handlePreviewClick = () => {
    const { onFocusHighlight } = this.props;
    const { highlight } = this.state;

    if (this.previewTimeout) {
      clearTimeout(this.previewTimeout);
    }

    this.setState({ showPreview: false });

    if (highlight) {
      onFocusHighlight(highlight);
    }
  };

  render() {
    const { highlight, showPreview, isIVQVisible } = this.state;

    return (
      <div className="rc-CaptureHighlightButton">
        <VideoToolbarButton
          type="secondary"
          disabled={isIVQVisible}
          label={_t('Save Note')}
          onClick={this.handleClick}
          trackingName="create_video_highlight"
          svgElement={
            <SvgSaveNote
              color={color.secondaryText}
              hoverColor={color.white}
              size={18}
              style={{ marginTop: '-3px' }}
              suppressTitle={true}
            />
          }
        />

        <HighlightCapturePreview show={showPreview} highlight={highlight} onClick={this.handlePreviewClick} />
      </div>
    );
  }
}

export default CaptureHighlightButton;
