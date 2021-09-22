import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap-33';

import classNames from 'classnames';

import { color } from '@coursera/coursera-ui';

import { SvgCheckSolid } from '@coursera/coursera-ui/svg';

import { WeekStatus } from 'bundles/course-v2/types/Week';

import _t from 'i18n!nls/course-home';

import 'css!./__styles__/WeekStatusMarker';

type Props = {
  status: WeekStatus;
};

class WeekStatusMarker extends React.Component<Props> {
  render() {
    const { status } = this.props;

    const isWeekComplete = status === 'COMPLETED';

    const classes = classNames('rc-WeekStatusMarker', 'horizontal-box', 'align-items-absolute-center');

    let statusMarker;
    let tooltipText;

    if (isWeekComplete) {
      statusMarker = <SvgCheckSolid fill={color.success} size={24} aria-hidden="true" />;
      tooltipText = _t('Great Work!');
    }

    if (!statusMarker) {
      return null;
    }

    return (
      <OverlayTrigger
        placement="top"
        delay={500}
        overlay={
          <Tooltip role="tooltip">
            <span aria-label={tooltipText}>{tooltipText}</span>
          </Tooltip>
        }
        trigger={['hover', 'focus']}
      >
        <div className={classes}>{statusMarker}</div>
      </OverlayTrigger>
    );
  }
}

export default WeekStatusMarker;
