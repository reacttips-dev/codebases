/**
 * Private module reserved for @coursera/cds-core package.
 */
/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import clsx from 'clsx';

import { useFormControlContext } from '@core/forms/FormControl/FormControlContext';
import { ValidationStatus } from '@core/forms/FormControl/types';
import ErrorIcon from '@core/icons/signs/ErrorIcon';
import SuccessOutlineIcon from '@core/icons/signs/SuccessOutlineIcon';
import { IconProps } from '@core/SvgIcon';
import { useTheme } from '@core/theme';
import { ComponentPropsWithoutRef } from '@core/types';
import Typography from '@core/Typography';
import { useValidationAriaLabel } from '@core/utils';
import VisuallyHidden from '@core/VisuallyHidden';

import getFormValidationLabelCss, {
  classes,
} from './getFormValidationLabelCss';

export type Props = {
  label: string;
  className?: string;
  hideIcon?: boolean;
  id?: string;
  validationStatus?: ValidationStatus;
} & ComponentPropsWithoutRef<'div'>;

export const getIconToRender = (
  validationStatus: ValidationStatus
): React.ComponentType<IconProps> | null => {
  const iconsMap: Record<
    NonNullable<ValidationStatus>,
    React.ComponentType<IconProps>
  > = {
    error: ErrorIcon,
    success: SuccessOutlineIcon,
  };
  return validationStatus ? iconsMap[validationStatus] : null;
};

const FormValidationLabel = (props: Props): React.ReactElement<Props> => {
  const { className, label, hideIcon, validationStatus, ...restProps } = props;
  const theme = useTheme();
  const formControlContext = useFormControlContext({
    id: props.id,
    validationStatus,
  });

  const ariaLabel = useValidationAriaLabel(
    label,
    formControlContext.validationStatus
  );

  const css = getFormValidationLabelCss(theme, formControlContext);

  const IconToRender = getIconToRender(formControlContext.validationStatus);

  return (
    <div
      className={clsx(
        classes.root,
        {
          [classes.invalid]: formControlContext.validationStatus === 'error',
          [classes.valid]: formControlContext.validationStatus === 'success',
          [classes.onDark]: formControlContext.invert,
          [classes.onLight]: !formControlContext.invert,
        },
        className
      )}
      css={css}
      id={formControlContext.validationLabelId}
      {...restProps}
    >
      {ariaLabel && <VisuallyHidden>{ariaLabel}</VisuallyHidden>}

      {!hideIcon && IconToRender && formControlContext.validationStatus && (
        <IconToRender className={classes.icon} size="small" />
      )}

      <Typography
        aria-hidden
        color={formControlContext.validationStatus}
        component="span"
        variant="h4bold"
      >
        {label}
      </Typography>
    </div>
  );
};

export default FormValidationLabel;
