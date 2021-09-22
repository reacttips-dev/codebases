/* @jsx jsx */
import { jsx, css } from '@emotion/react';
import React from 'react';
import _t from 'i18n!nls/discussions';
import { Typography, useTheme } from '@coursera/cds-core';
import classNames from 'classnames';

type Props = {
  initials: string | JSX.Element;
  color?: string;
  photoUrl?: string;
  className?: string;
};

export default function ProfileAvatar({ initials, className, photoUrl }: Props) {
  const theme = useTheme();
  const styles = {
    borderRadius: '50px',
    width: '36px',
    height: '36px',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    overflow: 'hidden',
    verticalAlign: 'middle',
    backgroundColor: theme.palette.blue[100],

    ['.rc-ProfileAvatar__profileImage']: {
      width: '36px',
      height: '36px',
      verticalAlign: 'middle',
    },
  };

  return (
    <Typography component="span" className={classNames('classNames', className)} css={styles}>
      {photoUrl && <img className="rc-ProfileAvatar__profileImage" src={photoUrl} alt={_t('user profile avatar')} />}
      {!photoUrl && initials}
    </Typography>
  );
}
