import React from 'react';
import classNames from 'classnames';

import _t from 'i18n!nls/course-v2';
import Badge from 'bundles/coursera-ui/components/basic/Badge';
import LearnerAppClientNavigationLink from 'bundles/course-v2/components/navigation/LearnerAppClientNavigationLink';

import 'css!./__styles__/NavigationLink';

type Props = {
  url: string;
  title: string;
  subtitle?: string;
  selected: boolean;
  notificationCount?: number;
  ariaExpanded?: string;
};

const NavigationLink = (props: Props) => {
  const { url, title, subtitle, selected, notificationCount, ariaExpanded } = props;
  const classes = classNames('rc-NavigationLink', 'horizontal-box', 'align-items-vertical-center', 'wrap', {
    selected,
  });

  const ariaLabel = selected ? _t('Currently selected, #{title}', { title }) : _t('#{title}', { title });

  return (
    <LearnerAppClientNavigationLink
      href={url}
      className={classes}
      trackingName="nav_item"
      ariaExpanded={ariaExpanded}
      ariaLabel={ariaLabel}
    >
      <p className="nav-item headline-1-text">{title}</p>

      {!!notificationCount && (
        <Badge badgeContent={notificationCount} badgeStyle={{ top: 2 }} style={{ paddingTop: 15 }} size="md" />
      )}

      {!!subtitle && <div className="caption-text color-secondary-text">{subtitle}</div>}
    </LearnerAppClientNavigationLink>
  );
};

export default NavigationLink;
