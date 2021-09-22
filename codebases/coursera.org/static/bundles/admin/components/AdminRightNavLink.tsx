import React from 'react';
import classNames from 'classnames';

import { TrackedA } from 'bundles/page/components/TrackedLink2';
import { Link } from 'react-router';

import withSingleTracked from 'bundles/common/components/withSingleTracked';
import { isAdminPathname } from 'bundles/page/utils/pageHeaderNavUtils';

const TrackedLink = withSingleTracked({ type: 'BUTTON' })(Link);

type Props = {
  href?: string;
  label: string;
  name: string;
  wrapperClassName: string;
  target: string;
  pathname: string;
};

const AdminRightNavLink: React.FunctionComponent<Props> = ({ href, label, name, wrapperClassName, pathname }) => {
  const elClassName = classNames('rc-HeaderRightNavButton', 'c-ph-right-nav-button', wrapperClassName, {
    'c-ph-right-nav-mobile-only': false,
    'c-ph-right-nav-no-border': true,
    isLohpRebrand: true,
  });

  if (!href) {
    return null;
  }

  // admin app needs these links to use react-router to prevent full
  const isAdminPage = isAdminPathname(pathname);
  if (isAdminPage) {
    return (
      <li role="none" className={elClassName}>
        <TrackedLink
          aria-label={label}
          to={href}
          id={`${name}-link`}
          trackingName={name ? `header_right_nav_button_${name.split('-').join('_')}` : 'header_right_nav_button'}
          trackingData={{ name }}
        >
          {label}
        </TrackedLink>
      </li>
    );
  }

  return (
    <li role="none" className={elClassName}>
      <TrackedA
        aria-label={label}
        href={href}
        id={`${name}-link`}
        trackingName={name ? `header_right_nav_button_${name.split('-').join('_')}` : 'header_right_nav_button'}
        data={{ name }}
      >
        {label}
      </TrackedA>
    </li>
  );
};

export default AdminRightNavLink;
