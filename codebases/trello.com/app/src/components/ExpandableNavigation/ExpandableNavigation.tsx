import React, { useState } from 'react';
import { TestId } from '@trello/test-ids';

import { LinkWrapper } from 'app/src/components/RouterLink/LinkWrapper';

import classNames from 'classnames';

import styles from './ExpandableNavigation.less';

export const ExpandableNavigation: React.FunctionComponent = (props) => (
  <div {...props} className={classNames(styles.expandableNavItemSection)} />
);

export const ExpandableNavigationItemList: React.FunctionComponent = (
  props,
) => <ul {...props} className={styles.expandableNavItemList} />;

export const ExpandableNavigationItem: React.FunctionComponent<{
  className?: string;
  expanded?: boolean;
}> = ({ className, expanded, ...props }) => (
  <li
    {...props}
    className={classNames(
      styles.expandableNavItem,
      expanded && styles.expanded,
      className,
    )}
  />
);

export const ExpandableNavigationItemHeader: React.FunctionComponent<{
  expanded?: boolean;
}> = ({ expanded, ...props }) => (
  <li
    {...props}
    className={classNames(
      styles.expandableNavItemHeader,
      expanded && styles.expanded,
    )}
  />
);

export const ExpandableNavigationItemRightChild: React.FunctionComponent = (
  props,
) => <div {...props} className={styles.expandableNavItemRightChild} />;

export interface ExpandableNavigationItemIconProps {
  className?: string;
  iconName?: string;
  icon?: JSX.Element; //I'd like to be more restrictive than this ideally
}

export const ExpandableNavigationItemIcon: React.FunctionComponent<ExpandableNavigationItemIconProps> = ({
  iconName,
  className,
  icon,
  ...props
}) => {
  //Use the component if it's passed, or default to the classic iconName
  const iconSpan = icon ? (
    React.cloneElement(icon, {
      size: 'small',
      dangerous_className: classNames(styles.expandableNavItemNachosIcon),
    })
  ) : (
    <span
      className={classNames(
        `icon-${iconName}`,
        'icon-sm',
        styles.expandableNavItemIconSpan,
      )}
    />
  );

  return (
    <span
      {...props}
      className={classNames(styles.expandableNavItemIcon, className)}
    >
      <span className={classNames(styles.expandableNavItemIconSpan)}>
        {iconSpan}
      </span>
    </span>
  );
};

export interface ExpandableNavigationItemLogoProps {
  logoUrl1x: string;
  logoUrl2x: string;
}

export const ExpandableNavigationItemLogo: React.FunctionComponent<ExpandableNavigationItemLogoProps> = ({
  logoUrl1x,
  logoUrl2x,
  ...props
}) => {
  const [showPNG, setShowPNG] = useState(true);
  const [showDefaultLogo, setShowDefaultLogo] = useState(false);

  if (showDefaultLogo) {
    return <ExpandableNavigationItemIcon iconName="organization" />;
  }
  const finalLogoUrl1x = showPNG ? logoUrl1x : logoUrl1x.slice(0, -3) + 'gif';
  const finalLogoUrl2x = showPNG ? logoUrl2x : logoUrl2x.slice(0, -3) + 'gif';
  return (
    <img
      src={finalLogoUrl1x}
      srcSet={`${finalLogoUrl1x} 1x, ${finalLogoUrl2x} 2x`}
      width={16}
      height={16}
      alt=""
      role="presentation"
      className={styles.expandableNavItemLogo}
      // eslint-disable-next-line react/jsx-no-bind
      onError={() => {
        showPNG ? setShowPNG(false) : setShowDefaultLogo(true);
      }}
      {...props}
    />
  );
};

export const ExpandableNavigationItemText: React.FunctionComponent<ExpandableNavigationItemBaseProps> = ({
  loud,
  className,
  ...props
}) => (
  <span
    {...props}
    className={classNames(styles.expandableNavItemText, className, {
      [styles.loud]: loud,
    })}
  />
);

interface ExpandableNavigationItemBaseProps {
  className?: string;
  indented?: boolean;
  selected?: boolean;
  small?: boolean;
  quiet?: boolean;
  testId?: TestId;
  loud?: boolean;
}

export type ExpandableNavigationItemLinkProps = ExpandableNavigationItemBaseProps &
  React.DOMAttributes<HTMLAnchorElement>;
export type ExpandableNavigationItemButtonProps = ExpandableNavigationItemBaseProps &
  React.DOMAttributes<HTMLButtonElement>;

export const ExpandableNavigationItemLink: React.FunctionComponent<ExpandableNavigationItemLinkProps> = ({
  className,
  indented,
  selected,
  small,
  quiet,
  ...props
}) => (
  <LinkWrapper
    {...props}
    className={classNames(
      styles.expandableNavItemLink,
      {
        [styles.selected]: selected,
        [styles.small]: small,
        [styles.expandableNavItemListIndent]: indented,
        [styles.quiet]: quiet,
      },
      className,
    )}
  />
);

export const ExpandableNavigationItemButton: React.FunctionComponent<ExpandableNavigationItemButtonProps> = ({
  className,
  indented,
  selected,
  small,
  quiet,
  ...props
}) => (
  <button
    {...props}
    className={classNames(
      styles.expandableNavItemButton,
      {
        [styles.selected]: selected,
        [styles.small]: small,
        [styles.expandableNavItemListIndent]: indented,
        [styles.quiet]: quiet,
      },
      className,
    )}
  />
);
