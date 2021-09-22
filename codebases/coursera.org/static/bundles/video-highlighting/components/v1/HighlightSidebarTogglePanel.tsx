import React from 'react';
import classNames from 'classnames';
import { Box, SvgButton, color } from '@coursera/coursera-ui';
import { SvgNotes } from '@coursera/coursera-ui/svg';
import withSingleTracked from 'bundles/common/components/withSingleTracked';
import _t from 'i18n!nls/video-highlighting';

import 'css!./__styles__/HighlightSidebarTogglePanel';

type Props = {
  active: boolean;
  onToggleClick: () => void;
};

const TrackedSvgButton = withSingleTracked({ type: 'BUTTON' })(SvgButton);

const HighlightSidebarTogglePanel = ({ active, onToggleClick }: Props) => (
  <Box rootClassName="rc-HighlightSidebarTogglePanel" justifyContent="start" alignItems="center" flexDirection="column">
    <TrackedSvgButton
      trackingName="toggle_highlight_panel"
      trackingData={{ currentlyActive: active }}
      rootClassName={classNames('notes-tool-button', { active })}
      onClick={onToggleClick}
      htmlAttributes={{
        'aria-label': _t('Toggle Notes Panel'),
        'aria-expanded': active,
      }}
      size="zero"
      type="icon"
      svgElement={<SvgNotes color={color.black} hoverColor={color.black} size={20} suppressTitle={true} />}
    />
  </Box>
);

export default HighlightSidebarTogglePanel;
