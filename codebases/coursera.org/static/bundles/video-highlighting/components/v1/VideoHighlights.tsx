import React from 'react';

import { Box } from '@coursera/coursera-ui';

import Highlight from 'bundles/video-highlighting/components/v1/Highlight';
import VideoHighlightsPlaceholder from 'bundles/video-highlighting/components/v1/VideoHighlightsPlaceholder';
import VideoHighlightsLoadingPlaceholder from 'bundles/video-highlighting/components/v1/VideoHighlightsLoadingPlaceholder';
import ReviewPageLink from 'bundles/video-highlighting/components/v1/ReviewPageLink';

import type { VideoPlayer } from 'bundles/item-lecture/types';
import type { Highlight as HighlightType } from 'bundles/video-highlighting/types';

import _t from 'i18n!nls/video-highlighting';
import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';

import A11yScreenReaderOnly from 'bundles/a11y/components/A11yScreenReaderOnly';

import 'css!./__styles__/VideoHighlights';

type Props = {
  loading: boolean;

  videoPlayer: VideoPlayer;
  highlights: Array<HighlightType>;

  onDelete: (id: string) => void;
  onUpdate: (id: string, highlight: HighlightType) => void;
  notificationAnnouncement?: string;
};

type State = {
  currentHighlight: string | null;
};

const SidebarTitle = ({ highlights }: { highlights: Array<HighlightType> }) => (
  <h2 className="sidebar-title">
    {highlights.length === 0 && _t('Notes')}

    {highlights.length !== 0 && (
      <FormattedHTMLMessage count={highlights.length} message={_t(`Notes <span class="note-count">({count})</span>`)} />
    )}
  </h2>
);

class VideoHighlights extends React.Component<Props, State> {
  state: State = {
    currentHighlight: null,
  };

  setCurrentHighlight = (id: $TSFixMe) => {
    this.setState({
      currentHighlight: id,
    });
  };

  render() {
    const { loading, videoPlayer, highlights, notificationAnnouncement, onDelete, onUpdate } = this.props;
    const { currentHighlight } = this.state;

    return (
      <div className="rc-VideoHighlights">
        <Box rootClassName="highlight-sidebar-header" justifyContent="between" alignItems="center">
          <SidebarTitle highlights={highlights} />
          <ReviewPageLink />
        </Box>

        {loading && <VideoHighlightsLoadingPlaceholder />}
        {!loading && highlights.length === 0 && <VideoHighlightsPlaceholder />}

        {!loading &&
          highlights.map((highlight: HighlightType) => (
            <Highlight
              highlight={highlight}
              key={highlight.clientId}
              currentHighlight={currentHighlight}
              onSetCurrentHighlight={this.setCurrentHighlight}
              videoPlayer={videoPlayer}
              onDelete={() => onDelete(highlight.id)}
              onUpdate={(updatedHighlight) => onUpdate(highlight.id, updatedHighlight)}
            />
          ))}
        <A11yScreenReaderOnly tagName="span" role="region" aria-live="assertive" aria-atomic={true}>
          {notificationAnnouncement && <span>{notificationAnnouncement}</span>}
        </A11yScreenReaderOnly>
      </div>
    );
  }
}

export default VideoHighlights;
