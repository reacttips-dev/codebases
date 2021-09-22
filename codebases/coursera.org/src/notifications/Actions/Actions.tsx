/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import Button, { ButtonProps } from '@core/Button';
import { useTheme } from '@core/theme';

import getActionsCss from './getActionsCss';

export type ActionsProps = {
  /**
   * Primary call to action button
   */
  primaryAction?: React.ReactElement<ButtonProps, typeof Button>;
  /**
   * Secondary call to action button
   */
  secondaryAction?: React.ReactElement<ButtonProps, typeof Button>;
};

const Actions = (
  props: ActionsProps
): React.ReactElement<ActionsProps> | null => {
  const { primaryAction, secondaryAction, ...rest } = props;
  const theme = useTheme();
  const actionsCss = getActionsCss(theme);

  if (!primaryAction && !secondaryAction) {
    return null;
  }

  return (
    <div {...rest} css={actionsCss}>
      {primaryAction}

      {secondaryAction}
    </div>
  );
};

export default Actions;
