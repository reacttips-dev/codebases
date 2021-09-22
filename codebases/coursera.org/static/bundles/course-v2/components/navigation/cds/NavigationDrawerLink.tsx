import React from 'react';
import classNames from 'classnames';
import LearnerAppClientNavigationLink from 'bundles/course-v2/components/navigation/LearnerAppClientNavigationLink';
// eslint-disable-next-line
import { css, jsx } from '@emotion/react';
import { Typography } from '@coursera/cds-core';

import 'css!./../__styles__/NavigationDrawerLink';

type Props = {
  url: string;
  selected: boolean;
  trackingName: string;
  title: string | JSX.Element;

  className?: string;
  children?: JSX.Element;
  ariaLabel?: string;
};

const NavigationDrawerLink = (props: Props) => {
  const { className, children, url, title, selected, trackingName, ariaLabel } = props;

  const classes = classNames('rc-NavigationDrawerLink', 'headline-1-text', 'horizontal-box', className, { selected });

  return (
    <LearnerAppClientNavigationLink
      trackingName={trackingName}
      href={url}
      className={classes}
      {...(ariaLabel ? { ariaLabel } : {})}
    >
      <Typography
        component="div"
        css={css`
          display: flex;
          flex-direction: row;
          align-items: center;
        `}
      >
        {title}
      </Typography>

      {children && React.cloneElement(children)}
    </LearnerAppClientNavigationLink>
  );
};

export default NavigationDrawerLink;
