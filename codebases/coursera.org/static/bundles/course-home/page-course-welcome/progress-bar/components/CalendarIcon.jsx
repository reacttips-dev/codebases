import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap-33';
import _t from 'i18n!nls/course-home';

import { color } from '@coursera/coursera-ui';
import { SvgCalendar } from '@coursera/coursera-ui/svg';

import 'css!./__styles__/CalendarIcon';

const CalendarIcon = () => {
  const tooltipId = 'gle-calendar-tooltip';
  const tooltip = <Tooltip id={tooltipId}>{_t('This is where you should be to finish the course on time.')}</Tooltip>;

  /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
  return (
    <OverlayTrigger placement="top" overlay={tooltip} trigger={['hover', 'focus']}>
      <div className="rc-CalendarIcon" role="tooltip" tabIndex="0" aria-describedby={tooltipId}>
        <SvgCalendar color={color.primaryText} size={14} />
      </div>
    </OverlayTrigger>
  );
};

export default CalendarIcon;
