/** @jsx jsx */
import React from 'react';

import { jsx } from '@emotion/react';

import clsx from 'clsx';

import { classes as inputClasses } from '@core/forms/Input/getInputCss';
import Typography from '@core/Typography';

import { classes } from './getSilentSelectFieldCss';

type SelectedValueProps = {
  label: string;
  labelId: string;
  placeholderId: string;
  value?: React.ReactNode;
  placeholder?: string;
  hideLabel?: boolean;
};

/**
 * Renders integrated label with placeholder or selected value
 *
 * ---
 * Colon is tied to the label with `&lrm;`
 * @link https://en.wikipedia.org/wiki/Left-to-right_mark
 */
const SelectedValue = (
  props: SelectedValueProps
): React.ReactElement<SelectedValueProps> => {
  const {
    value,
    placeholder,
    placeholderId,
    label,
    labelId,
    hideLabel,
  } = props;
  const filled = value !== undefined && value !== '';
  const selectedValue = filled ? value : placeholder;

  return (
    <Typography
      className={clsx({
        [classes.filled]: filled,
        [inputClasses.placeholder]: !filled,
      })}
      component="span"
    >
      {!hideLabel && (
        <Typography
          className={classes.label}
          color="inherit"
          component="span"
          id={labelId}
          variant="h3semibold"
        >
          {label}
          {': '}
        </Typography>
      )}

      {selectedValue && <span id={placeholderId}>{selectedValue}</span>}
    </Typography>
  );
};

export default SelectedValue;
