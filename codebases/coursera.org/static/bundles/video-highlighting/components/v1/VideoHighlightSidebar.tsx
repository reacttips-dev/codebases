import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Box } from '@coursera/coursera-ui';

import { VideoHighlights, HighlightSidebarTogglePanel } from 'bundles/video-highlighting';

import {
  getUIPanelVisibilityPreference,
  setUIPanelVisibilityPreference,
} from 'bundles/video-highlighting/utils/highlightingUIPreferenceUtils';

import type { VideoPlayer } from 'bundles/item-lecture/types';
import type { Highlight as HighlightType } from 'bundles/video-highlighting/types';

import 'css!./__styles__/VideoHighlightSidebar';

type Props = {
  loading: boolean;
  expanded: boolean;

  videoPlayer: VideoPlayer;
  highlights: Array<HighlightType>;
  notificationAnnouncement?: string;

  onDelete: (id: string) => void;
  onUpdate: (id: string, highlight: HighlightType) => void;
};

class VideoHighlightSidebar extends React.Component<Props> {
  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  toggleExpansion = () => {
    const { expanded } = this.props;
    const { executeAction } = this.context;
    executeAction(setUIPanelVisibilityPreference, !expanded);
  };

  render() {
    const { loading, expanded, videoPlayer, highlights, notificationAnnouncement, onDelete, onUpdate } = this.props;

    const classes = classNames('rc-VideoHighlightSidebar', {
      expanded,
    });

    return (
      <Box rootClassName={classes} flexDirection="row" justifyContent="start" alignItems="stretch">
        <HighlightSidebarTogglePanel active={expanded} onToggleClick={this.toggleExpansion} />
        <VideoHighlights
          loading={loading}
          videoPlayer={videoPlayer}
          highlights={highlights}
          notificationAnnouncement={notificationAnnouncement}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      </Box>
    );
  }
}

export default getUIPanelVisibilityPreference(VideoHighlightSidebar);
