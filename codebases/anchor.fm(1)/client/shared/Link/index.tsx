import { css } from 'emotion';
import styled from '@emotion/styled';
import React from 'react';
import { Link as ReactRouterDOMLink } from 'react-router-dom';
import { GRAY_LINK_COLOR } from 'client/modules/Styleguide';

type ColorProp = 'purple' | 'gray';
interface LinkProps {
  children: React.ReactNode;
  isInline?: boolean;
  to: string;
  onClick?: () => void;
  color?: ColorProp;
  target?: '_self' | '_blank';
  isIncludingSpacesAround?: boolean;
}
interface LinkableProps {
  className?: string;
  style?: any;
  children: React.ReactNode;
  to: string;
  onClick?: () => void;
  target?: '_self' | '_blank';
  isFullWidth?: boolean;
  dataCy?: string;
}

const Shared = css`
  outline: 0;
  height: auto;
  vertical-align: top;
  width: 100%;
`;
const LinkContainer = styled.div`
  ${Shared};
  display: inline-block;
`;

const InlineLinkContainer = styled.div`
  ${Shared};
  display: inline;
`;

const addSpacesAround = (element: React.ReactNode) => (
  <>
    {'\u00A0'}
    {element}
    {'\u00A0'}
  </>
);

const isUrlExternal = (url: string): boolean => {
  // https://stackoverflow.com/questions/10687099/how-to-test-if-a-url-string-is-absolute-or-relative
  const regexForProtocolInUrlString = new RegExp('^(?:[a-z]+:)?//', 'i');
  const isProtocolIncludedInString = regexForProtocolInUrlString.test(url);
  return isProtocolIncludedInString;
};

const Linkable = ({
  children,
  to,
  onClick,
  target,
  className = '',
  style = {},
  isFullWidth = false,
  dataCy,
}: LinkableProps) => {
  const linkableClassName = css({
    '&, &:hover, &:visited, &:link, &:active': {
      textDecoration: 'none',
    },
    // color: 'inherit',
    display: 'inline-block',
    ...(isFullWidth ? { width: '100%' } : {}),
  });

  return isUrlExternal(to) ? (
    <InlineLinkContainer>
      <a
        className={`${linkableClassName} ${className}`}
        style={{
          // ...baseStyle,
          ...style,
          // ...(isFullWidth ? { width: '100%' } : {}),
        }}
        rel={target === '_blank' ? 'noopener noreferrer' : ''}
        data-vars-outbound-link={to}
        href={to}
        target={target}
        onClick={() => {
          const params = {
            eventCategory: 'Outbound',
            eventAction: 'Click',
            eventLabel: to,
            ...(target === '_blank'
              ? {
                  transport: 'beacon',
                  hitCallback: () => {
                    // eslint-disable-next-line no-unused-expressions
                    document.location;
                  },
                }
              : {}),
          };
          // TODO https://anchorfm.atlassian.net/browse/WHEEL-807: Find Solution Without Utilizing GA Global Object
          // @ts-ignore
          if (window.ga !== undefined) {
            // @ts-ignore
            window.ga('send', 'event', params);
          }
          if (onClick) {
            onClick();
          }
        }}
      >
        {children}
      </a>
    </InlineLinkContainer>
  ) : (
    <LinkContainer>
      <ReactRouterDOMLink
        data-cy={dataCy}
        to={to}
        className={`${linkableClassName} ${className}`}
        style={{
          // ...baseStyle,
          ...style,
          // ...(isFullWidth ? { width: '100%' } : {}),
        }}
        target={target || undefined}
      >
        {children}
      </ReactRouterDOMLink>
    </LinkContainer>
  );
};

const LinkText = ({
  isInline,
  color = 'purple',
  isIncludingSpacesAround,
  children,
  to,
  onClick,
  target,
}: LinkProps) => {
  const linkableClassName = css({
    '&, &:hover, &:visited, &:link, &:active': {
      textDecoration: 'none',
    },
  });
  const linkStyles = {
    display: isInline ? 'inline' : 'block',
  };

  const getColorClassName = (colorProp: ColorProp) => {
    switch (colorProp) {
      case 'gray':
        return css({
          color: GRAY_LINK_COLOR,
          '&:hover': {
            color: '#292F36',
          },
        });
      case 'purple':
        return css({
          color: '#5000b9',
          '&:hover': {
            color: '#6732B9',
          },
        });
      default:
        // eslint-disable-next-line no-case-declarations
        const exhaustiveCheck: never = colorProp;
        return exhaustiveCheck;
    }
  };
  return (
    <Linkable
      className={`${linkableClassName} ${getColorClassName(color)}`}
      style={{
        cursor: 'pointer',
        ...linkStyles,
      }}
      to={to}
      onClick={onClick}
      target={target}
    >
      {isIncludingSpacesAround ? addSpacesAround(children) : children}
    </Linkable>
  );
};

export { LinkText, Linkable };
