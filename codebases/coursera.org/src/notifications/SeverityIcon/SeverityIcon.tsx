/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import ErrorFilledIcon from '@core/icons/signs/ErrorFilledIcon';
import InfoFilledIcon from '@core/icons/signs/InfoFilledIcon';
import SuccessFilledIcon from '@core/icons/signs/SuccessFilledIcon';
import WarningFilledIcon from '@core/icons/signs/WarningFilledIcon';
import { severities } from '@core/notifications/LocalNotification/getLocalNotificationCss';
import { IconProps } from '@core/SvgIcon';

export type SeverityIconProps = {
  /**
   * Notification severity type
   */
  severity: keyof typeof severities;
};

const SeverityIcon = (
  props: SeverityIconProps
): React.ReactElement<SeverityIconProps> => {
  const { severity } = props;
  const commonProps: IconProps = {
    size: 'large',
    'aria-hidden': true,
  };

  switch (severity) {
    case 'success':
      return <SuccessFilledIcon color="success" {...commonProps} />;
    case 'warning':
      return <WarningFilledIcon color="warning" {...commonProps} />;
    case 'error':
      return <ErrorFilledIcon color="error" {...commonProps} />;
    case 'information':
    default:
      return <InfoFilledIcon color="interactive" {...commonProps} />;
  }
};

export default SeverityIcon;
