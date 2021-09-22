/** @jsx jsx */
import React from 'react';

import { InputAdornment as MuiInputAdornment } from '@material-ui/core';

import { jsx } from '@emotion/react';

import clsx from 'clsx';

import { ValidationStatus } from '@core/forms/FormControl/types';
import { useTheme } from '@core/theme';

import getInputAdornmentCss, { classes } from './getInputAdornmentCss';

export type InputAdornmentProps = {
  /**
   * Defines position of the component
   * @default start
   */
  position?: 'start' | 'end';

  /**
   * Defines variant of the component
   * @default standard
   */
  variant?: 'filled' | 'standard';

  /**
   * Defines children of the component
   */
  children: React.ReactNode;

  /**
   * Defines additional classes for a root component
   */
  className?: string;

  /**
   * Defines validation status
   */
  validationStatus?: ValidationStatus;

  /**
   * Defines vertical alignment of content inside
   * @default center
   */
  verticallyAligned?: 'top' | 'center';
} & React.ComponentPropsWithRef<'div'>;

/**
 * Renders input field Prefix/Suffix
 */
const InputAdornment: React.FC<InputAdornmentProps> = (
  props: InputAdornmentProps
) => {
  const theme = useTheme();
  const css = getInputAdornmentCss(theme);

  const {
    position = 'start',
    variant = 'standard',
    validationStatus,
    className,
    verticallyAligned, // eslint-disable-line
    ...rest
  } = props;
  return (
    <MuiInputAdornment
      aria-hidden
      css={css}
      {...rest}
      disableTypography
      className={clsx(
        verticallyAligned && classes[verticallyAligned],
        classes[variant],
        {
          [classes.valid]: validationStatus === 'success',
          [classes.invalid]: validationStatus === 'error',
        },
        className
      )}
      classes={{
        root: classes.root,
      }}
      position={position}
    />
  );
};

export default InputAdornment;
