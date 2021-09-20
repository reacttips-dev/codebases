/* eslint-disable import/no-default-export */
import React from 'react';
import { useSharedState } from '@trello/shared-state';
import { MemberModel } from 'app/gamma/src/types/models';
import AnonymousHeader from './anonymous-header';
import { AuthenticatedHeader } from './authenticated-header';
import { headerState } from './headerState';

interface Props {
  me: MemberModel | undefined;
  isLoggedIn: boolean;
}

const Header: React.FC<Props> = (props) => {
  const { me, isLoggedIn } = props;
  const [{ brandingColor }] = useSharedState(headerState);

  if (isLoggedIn) {
    return <AuthenticatedHeader member={me} brandingColor={brandingColor} />;
  } else {
    return <AnonymousHeader />;
  }
};

export default Header;
