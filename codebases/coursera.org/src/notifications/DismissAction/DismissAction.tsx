/** @jsx jsx */
import React from 'react';

import { jsx, css } from '@emotion/react';

import Button, { ButtonProps } from '@core/Button';
import useMessageFormatter from '@core/i18n/useMessageFormatter';
import CloseIcon from '@core/icons/signs/CloseIcon';
import i18nMessages from '@core/notifications/i18n';

export type DismissActionProps = Partial<
  Omit<ButtonProps, 'icon' | 'iconPosition' | 'size' | 'variant'>
>;

const DismissAction = (
  props: DismissActionProps
): React.ReactElement<DismissActionProps> => {
  const { children, ...rest } = props;
  const formatter = useMessageFormatter(i18nMessages);

  return (
    <Button
      css={css`
        margin-right: -8px;
      `}
      icon={<CloseIcon size="small" />}
      iconPosition="after"
      size="small"
      variant="ghost"
      {...rest}
    >
      {children || formatter('dismiss')}
    </Button>
  );
};

export default DismissAction;
