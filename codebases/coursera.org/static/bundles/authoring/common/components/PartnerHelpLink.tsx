import React from 'react';
import { buildPartnerHelpUrl } from 'bundles/common/utils/urlUtils';
import _t from 'i18n!nls/authoring';
import { isCdsTypographyMigrationEnabled } from 'bundles/authoring/featureFlags';
import PartnerHelpLinkV2 from 'bundles/authoring/common/components/cds/PartnerHelpLink';

type Props = {
  articleId?: string;
  categoryId?: string;
  sectionId?: string;
  anchor?: string;
  linkText?: React.ReactNode;
  linkClasses?: string;
  ariaLabel?: string;
  useCdsOverride?: boolean;
};

const PartnerHelpLink = (props: Props): JSX.Element => {
  const { articleId, categoryId, sectionId, anchor, linkText, linkClasses, ariaLabel, useCdsOverride } = props;
  const anchorPart = anchor ? `#${anchor}` : '';
  const link = buildPartnerHelpUrl(articleId, categoryId, sectionId) + anchorPart;

  if (isCdsTypographyMigrationEnabled() || useCdsOverride) {
    return <PartnerHelpLinkV2 {...props} />;
  }

  return (
    <a
      className={linkClasses}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
    >
      {linkText || _t('Learn more')}
    </a>
  );
};

export default PartnerHelpLink;
