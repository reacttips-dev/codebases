/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

import _t from 'i18n!nls/compound-assessments';
import type { Theme } from '@coursera/cds-core';
import { useTheme } from '@coursera/cds-core';

const style = {
  root: (theme: Theme, isMultiLine: boolean, isEmpty: boolean) =>
    css({
      backgroundColor: theme.palette.gray['100'],
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: theme.palette.gray['300'],
      padding: isMultiLine ? theme.spacing(16) : theme.spacing(12),
      whiteSpace: 'pre-line',
      fontStyle: isEmpty ? 'italic' : 'normal',
      color: theme.palette.gray['700'],
    }),
};

type Props = {
  isMultiLine?: boolean;
  children?: React.ReactNode;
};

const ReadOnlyText = ({ isMultiLine = false, children }: Props) => {
  const theme = useTheme();
  return <div css={style.root(theme, isMultiLine, !children)}>{children || _t('No answer')}</div>;
};

export default ReadOnlyText;
