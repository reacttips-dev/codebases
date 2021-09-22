import React from 'react';
import type { LinkProps } from '@coursera/cds-core';
import { Link } from '@coursera/cds-core';
import { buildPartnerHelpUrl } from 'bundles/common/utils/urlUtils';
import _t from 'i18n!nls/authoring';

type Props = {
  articleId?: string;
  categoryId?: string;
  sectionId?: string;
  anchor?: string;
  linkText?: React.ReactNode;
  linkClasses?: string;
  pendoTarget?: string;
  linkProps?: Omit<LinkProps, 'children'>;
};

const PartnerHelpLink = (props: Props): JSX.Element => {
  const { articleId, categoryId, sectionId, anchor, linkText, linkClasses, linkProps, pendoTarget } = props;
  const anchorPart = anchor ? `#${anchor}` : '';
  const link = buildPartnerHelpUrl(articleId, categoryId, sectionId) + anchorPart;
  return (
    <Link
      className={linkClasses}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      {...linkProps}
      {...(pendoTarget ? { 'data-pendo': pendoTarget } : {})}
    >
      {linkText || _t('Learn more')}
    </Link>
  );
};

export default PartnerHelpLink;
