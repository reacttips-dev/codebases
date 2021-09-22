import React from 'react';
import classNames from 'classnames';

import _t from 'i18n!nls/course-v2';
import Badge from 'bundles/coursera-ui/components/basic/Badge';
import LearnerAppClientNavigationLink from 'bundles/course-v2/components/navigation/LearnerAppClientNavigationLink';

import 'css!./../__styles__/NavigationLink';

// eslint-disable-next-line
import { css, jsx } from '@emotion/react';
import { Typography } from '@coursera/cds-core';

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
      <Typography variant="h3semibold" className="nav-item">
        {title}
      </Typography>

      {!!notificationCount && (
        <Badge badgeContent={notificationCount} badgeStyle={{ top: 2 }} style={{ paddingTop: 15 }} size="md" />
      )}

      {!!subtitle && (
        <Typography
          component="div"
          css={css`
            font-size: 14px;
            line-height: 18px;
            color: #525252;
            width: 100%;
          `}
        >
          {subtitle}
        </Typography>
      )}
    </LearnerAppClientNavigationLink>
  );
};

export default NavigationLink;
