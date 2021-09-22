/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

import _t from 'i18n!nls/compound-assessments';

import type { Theme } from '@coursera/cds-core';
import { Typography, useTheme } from '@coursera/cds-core';

type Props = {
  id?: string;
  message?: React.ReactNode;
  className?: string;
};

const styles = {
  root: (theme: Theme) =>
    css({
      color: theme.palette.red[700],
    }),
};
const ValidationError: React.FC<Props> = ({ message, className, id }: Props) => {
  const theme = useTheme();
  return (
    <Typography
      variant="body1"
      css={styles.root(theme)}
      className={className}
      id={id ? `validation-error-${id}` : undefined}
    >
      {message || _t("Warning: You haven't provided an answer for this question")}
    </Typography>
  );
};

export default ValidationError;
