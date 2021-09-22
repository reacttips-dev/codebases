/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import _t from 'i18n!nls/discussions';
import React from 'react';
import { Typography, withTheme } from '@coursera/cds-core';
import type { Theme } from '@coursera/cds-core';
import type { ForumPostWithCreator } from '../../__providers__/ForumPostDataProvider/__types__';

type Props = {
  post: ForumPostWithCreator & { showAdminDetails: boolean };
  theme: Theme;
};

class AdminDetails extends React.Component<Props> {
  render() {
    const { post, theme } = this.props;
    return post.showAdminDetails ? (
      <span
        className="rc-forumsV2_AdminDetails"
        css={css`
          float: right;
        `}
      >
        <Typography
          css={css`
            background-color: ${theme.palette.blue[50]};
            border: 1px solid ${theme.palette.gray[300]};
            border-radius: 3px;
            padding: ${theme.spacing(4)};
          `}
          component="span"
          variant="body2"
          aria-label="creator user id"
        >
          {_t('User ID') + ': ' + post.creator?.userId}
        </Typography>
      </span>
    ) : null;
  }
}

export default withTheme(AdminDetails);
