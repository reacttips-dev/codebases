import { SvgExternalLink } from '@coursera/coursera-ui/svg';
import { color } from '@coursera/coursera-ui';
import _t from 'i18n!nls/course-item-resource-panel';
import React from 'react';
import 'css!./__styles__/index';

export default function ButtonViewAllDiscussions() {
  return (
    <span className="viewAllDiscussionsButton">
      <span>
        <SvgExternalLink size={18} color={color.primary} hoverColor={color.darkPrimary} />
      </span>
      <span>{_t('View all discussions')}</span>
    </span>
  );
}
