/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/react';
import { EDUCATOR_HELP_CENTER_HOME_PAGE_URL } from 'bundles/author-common/constants/EducatorHelpCenterHomePageURL';
import _t from 'i18n!nls/author-common';

type Props = {
  children?: React.ReactNode;
};

const styles = css`
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  a {
    color: inherit;
  }
`;

const HeaderHelpLink: React.FC<Props> = ({ children }: Props) => {
  return (
    <div className="rc-HeaderHelpLink" css={styles}>
      <a href={EDUCATOR_HELP_CENTER_HOME_PAGE_URL} target="_blank" rel="noopener noreferrer">
        {children ?? <span>{_t('Help')}</span>}
      </a>
    </div>
  );
};

export default HeaderHelpLink;
