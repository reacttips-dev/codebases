import React from 'react';
import NextLink from 'next/link';
import { Link } from '../Link';
/**
 * The `component` param wrapped with <Link />
 *
 * @param component - Rendered React Component to be rendered
 * @param linkProps - <Link /> component's props
 * @returns - If `linkProps` passed `component` rendered inside
 * of <Link /> otherwise `component`
 */
export const withLink = (component, linkProps) => linkProps ? (React.createElement(NextLink, { shallow: linkProps.shallow, href: linkProps.href, as: linkProps.as, passHref: true },
    React.createElement(Link, { "data-testid": `withLink-${linkProps.as}`, display: "block", sx: linkProps.styles }, component))) : (component);
//# sourceMappingURL=withLink.js.map