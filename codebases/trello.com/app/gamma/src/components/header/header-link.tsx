/* eslint-disable import/no-default-export */
import classNames from 'classnames';
import RouterLink, {
  RouterLinkProps,
} from 'app/src/components/RouterLink/RouterLink';
import React from 'react';
import styles from './header.less';

export interface HeaderLinkProps extends RouterLinkProps {
  buttonStyle?: string;
}

const HeaderLink: React.FunctionComponent<HeaderLinkProps> = ({
  children,
  className,
  buttonStyle,
  ...rest
}) => (
  <RouterLink
    {...rest}
    className={classNames(
      buttonStyle
        ? [styles.headerButton, styles[buttonStyle]]
        : styles.textLink,
      className,
    )}
  >
    {children}
  </RouterLink>
);

export default HeaderLink;
