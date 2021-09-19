import React, { ReactNode } from 'react';
import { Link } from 'react-router';

import { isLeftClickEvent, isModifiedEvent } from 'helpers/EventHelpers';
import useMartyContext from 'hooks/useMartyContext';

interface Props {
  children?: ReactNode;
  className?: string;
  target?: string;
  to: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => any;
  [key: string]: any;
}

export const MartyLink = (props: Props) => {
  const { onClick, ...rest } = props;

  const { router } = useMartyContext();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { target, to } = props;

    if (onClick) {
      onClick(e);
    }

    if (!isLeftClickEvent(e) || isModifiedEvent(e) || e.defaultPrevented || target) {
      return;
    }

    e.preventDefault();
    router.pushPreserveAppRoot(to);
  };

  return <Link onClick={handleClick} {...rest}/>;
};

export default MartyLink;
