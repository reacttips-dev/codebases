import React from 'react';
import { buildLearnerHelpUrl } from 'bundles/common/utils/urlUtils';
import _t from 'i18n!nls/authoring';

type Props = {
  articleId?: string;
  sectionId?: string;
  linkText?: string;
  linkClasses?: string;
};

const LearnerHelpLink: React.FC<Props> = ({ articleId, sectionId, linkText, linkClasses }) => {
  const link = buildLearnerHelpUrl(articleId, sectionId);

  return (
    <a className={linkClasses} href={link} target="_blank" rel="noopener noreferrer">
      {linkText || _t('Learn more')}
    </a>
  );
};

export default LearnerHelpLink;
