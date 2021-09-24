/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.sass';

type Height = 40 | 46 | 50 | 70;

export type ButtonColor =
  | 'white'
  | 'purple'
  | 'red'
  | 'green'
  | 'aqua'
  | 'black'
  | 'yellow'
  | 'onDark';

type CommonProps = {
  children: React.ReactNode;
  isDisabled?: boolean;
  color?: ButtonColor;
  className?: string;
  height?: Height;
  dataCy?: string;
  ariaLabel?: string;
};

type ButtonTypeProps = {
  kind: 'button';
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
} & CommonProps;

type LinkTypeProps = {
  kind: 'link';
  href: string;
  target?: string;
  rel?: string;
  download?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  forceAnchorTag?: boolean;
} & CommonProps;

export type ButtonProps = ButtonTypeProps | LinkTypeProps;

export const Button = (props: ButtonProps): JSX.Element => {
  const {
    isDisabled,
    className,
    color,
    children,
    height,
    dataCy,
    ariaLabel,
  } = props;
  const cx = classNames(
    styles.button,
    color !== undefined ? styles[color] : null,
    className !== undefined ? { [className]: className } : null,
    { [styles.disabled]: isDisabled }
  );
  const cssProp = css`
    height: ${height}px;
  `;

  switch (props.kind) {
    case 'link': {
      const { href, target, rel, download, onClick, forceAnchorTag } = props;
      const linkProps = {
        className: cx,
        css: cssProp,
        target,
        rel,
        download,
        'data-cy': dataCy,
        onClick,
      };
      return href.startsWith('http') || forceAnchorTag ? (
        <a {...linkProps} aria-label={ariaLabel} href={href}>
          {children}
        </a>
      ) : (
        <Link {...linkProps} aria-label={ariaLabel} to={href}>
          {children}
        </Link>
      );
    }
    case 'button':
    default: {
      const { type, onClick } = props;
      return (
        <button
          type={type || 'button'}
          className={cx}
          onClick={onClick}
          css={cssProp}
          data-cy={dataCy}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          aria-label={ariaLabel}
        >
          {children}
        </button>
      );
    }
  }
};

Button.defaultProps = {
  kind: 'button',
  height: 46,
};
