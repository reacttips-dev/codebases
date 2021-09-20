import React, { useContext } from 'react';
import { ReactReduxContext } from 'react-redux';
import { TestId } from '@trello/test-ids';

import RouterLink, { RouterLinkProps } from './RouterLink';

// Should be used if component is shared between classic and gamma
// Checks if the component is connected to redux store
// If it's connected then we can use RouterLink
// If it's not conencted we can just use a regular link
export const LinkWrapper: React.FC<RouterLinkProps> = ({
  children,
  href,
  ...props
}) => {
  let pathname: string;
  try {
    pathname = new URL(href || '').pathname;
  } catch (e) {
    pathname = href || '';
  }

  const reduxContext = useContext(ReactReduxContext);

  if (reduxContext && reduxContext.store) {
    return (
      <RouterLink href={pathname} {...props}>
        {children}
      </RouterLink>
    );
  }

  const expandedProps: RouterLinkProps & { 'data-test-id'?: TestId } = {
    ...props,
  };
  expandedProps['data-test-id'] = props.testId;
  delete expandedProps.testId;

  return (
    <a href={pathname} {...props}>
      {children}
    </a>
  );
};
