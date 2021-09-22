/** @jsx jsx */
import React from 'react';

import { Popover, PopoverProps } from '@material-ui/core';

import { jsx } from '@emotion/react';

import Button from '@core/Button';
import i18nMessages from '@core/forms/i18n';
import useMessageFormatter from '@core/i18n/useMessageFormatter';
import CloseIcon from '@core/icons/signs/CloseIcon';
import { useTheme } from '@core/theme';
import { SlideUp } from '@core/transitions/SlideUp';
import Typography from '@core/Typography';

import getMobilePopoverCss, { classes } from './getMobilePopoverCss';

export type MobilePopoverProps = {
  /**
   * Defines label to be showed above the content
   */
  label?: string;

  /**
   * Defines whether component is visible
   */
  isVisible: boolean;
} & PopoverProps;

const MobilePopover = (
  props: MobilePopoverProps,
  ref: React.Ref<unknown>
): React.ReactElement<PopoverProps> | null => {
  const theme = useTheme();
  const css = getMobilePopoverCss(theme);
  const formatter = useMessageFormatter(i18nMessages);

  const container = React.useRef(null);
  const closeBtnRef = React.useRef<HTMLButtonElement>(null);

  const { isVisible, children, label, ...popoverProps } = props;

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    // Redirect a focus to the "Close" button
    if (event.target === container.current) {
      if (closeBtnRef && closeBtnRef.current) {
        closeBtnRef.current.focus();
      }
    }
  };

  /**
   * Handles onClose event
   * @param event
   */
  const handleClose = (event: React.ChangeEvent<unknown>) => {
    popoverProps.onClose?.(event, 'backdropClick');
  };

  return isVisible ? (
    <Popover
      css={css}
      {...popoverProps}
      ref={ref}
      PaperProps={{ ref: container }}
      TransitionComponent={SlideUp}
      classes={{
        root: classes.root,
        paper: classes.paper,
      }}
      onFocus={handleFocus}
    >
      <div className={classes.topBar}>
        <Button
          ref={closeBtnRef}
          icon={<CloseIcon size="small" />}
          size="small"
          variant="ghost"
          onClick={handleClose}
        >
          {formatter('close')}
        </Button>
      </div>

      {label && (
        <div className={classes.container}>
          <Typography variant="h3semibold">{label}</Typography>
        </div>
      )}

      {children}
    </Popover>
  ) : null;
};

/**
 * Styled popover for mobile version of select field
 */
export default React.forwardRef(MobilePopover);
