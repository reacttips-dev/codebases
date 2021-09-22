import { SerializedStyles, css } from '@emotion/react';

import {
  severities,
  severityColor,
} from '@core/notifications/LocalNotification/getLocalNotificationCss';
import { Theme } from '@core/theme';

export default (
  theme: Theme,
  severity?: keyof typeof severities
): SerializedStyles => css`
  margin: ${theme.spacing(0, 0, 4)};
  ${severity && `color: ${severityColor[severity](theme)}`};
`;
