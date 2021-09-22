import React from 'react';
import classNames from 'classnames';
import LearnerAppClientNavigationLink from 'bundles/course-v2/components/navigation/LearnerAppClientNavigationLink';

import 'css!./__styles__/NavigationDrawerLink';

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
      <div className="horizontal-box align-items-vertical-center navigation-link-title">{title}</div>

      {children && React.cloneElement(children)}
    </LearnerAppClientNavigationLink>
  );
};

export default NavigationDrawerLink;
