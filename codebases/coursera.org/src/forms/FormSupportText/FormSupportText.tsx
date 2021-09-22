/** @jsx jsx */

import React from 'react';

import { FormHelperText as MuiFormHelperText } from '@material-ui/core';

import { jsx } from '@emotion/react';

import { useFormControlContext } from '@core/forms/FormControl/FormControlContext';
import { useTheme } from '@core/theme';

import getFormSupportTextCss, { classes } from './getFormSupportTextCss';

export type Props = React.ComponentPropsWithRef<'div'>;

/**
 * Support text component for usage with form fields.
 */
const FormSupportText = (props: Props): React.ReactElement<Props> => {
  const theme = useTheme();
  const { invert, supportTextId } = useFormControlContext();
  const css = getFormSupportTextCss(theme, invert);

  return (
    <MuiFormHelperText
      {...props}
      classes={classes}
      css={css}
      id={supportTextId}
    />
  );
};

export default FormSupportText;
