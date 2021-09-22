/** @jsx jsx */

import React from 'react';

import { FormLabel as MuiFormLabel } from '@material-ui/core';
import { useFormControl as useMuiFormControl } from '@material-ui/core/FormControl';

import { jsx } from '@emotion/react';

import clsx from 'clsx';

import { useFormControlContext } from '@core/forms/FormControl/FormControlContext';
import i18nMessages from '@core/forms/i18n';
import useMessageFormatter from '@core/i18n/useMessageFormatter';
import { useTheme } from '@core/theme';
import { OverrideProps } from '@core/types';
import Typography from '@core/Typography';
import VisuallyHidden from '@core/VisuallyHidden';

import getFormLabelCss, { classes } from './getFormLabelCss';

export type BaseProps = {
  /**
   * Defines whether to render optional text next to the label
   */
  optional?: boolean;

  /**
   * Allows to add (required) to the label so that custom fields could also be announced as required
   * Example: SelectField
   */
  includeRequiredIndicatorWithLabel?: boolean;

  /**
   * Defines a classes for root element
   */
  className?: string;
};

export interface FormLabelMapType<D extends React.ElementType = 'label'> {
  props: BaseProps;
  defaultComponent: D;
}

export type FormLabelProps<
  D extends React.ElementType = FormLabelMapType['defaultComponent']
> = OverrideProps<FormLabelMapType<D>, D> & { component?: React.ElementType };

/**
 * Main Input label component
 * @param props
 */
const FormLabel = (
  props: FormLabelProps
): React.ReactElement<FormLabelProps> => {
  const {
    children,
    className,
    optional,
    includeRequiredIndicatorWithLabel,
    ...rest
  } = props;
  const formatter = useMessageFormatter(i18nMessages);

  const { optionalLabel, onDark, onLight, ...muiClasses } = classes;
  const theme = useTheme();
  const css = getFormLabelCss(theme);

  const muiFormControl = useMuiFormControl();
  const formControlContext = useFormControlContext({
    id: props.htmlFor,
    labelId: props.id,
  });

  const showOptionalMark = muiFormControl?.required === false || optional;
  const showRequiredMark =
    muiFormControl?.required && includeRequiredIndicatorWithLabel;

  const OptionalMark = showOptionalMark && (
    <Typography
      aria-hidden="true"
      className={optionalLabel}
      color="supportText"
      component="span"
      variant="h3semibold"
    >
      {/* eslint-disable-next-line react/jsx-no-literals, react/jsx-newline */}
      <i>&nbsp;{`(${formatter('optional')})`}</i>
    </Typography>
  );

  return (
    <MuiFormLabel
      className={clsx(
        {
          [onDark]: formControlContext.invert,
          [onLight]: !formControlContext.invert,
        },
        className
      )}
      classes={muiClasses}
      css={css}
      htmlFor={formControlContext.id}
      id={formControlContext.labelId}
      {...rest}
    >
      {children}

      {OptionalMark}

      {showRequiredMark && (
        <VisuallyHidden>{`(${formatter('required')})`}</VisuallyHidden>
      )}
    </MuiFormLabel>
  );
};

export default FormLabel;
