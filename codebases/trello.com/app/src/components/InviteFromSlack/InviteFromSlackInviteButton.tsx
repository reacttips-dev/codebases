import React from 'react';
import { Button } from '@trello/nachos/button';
import { useTrelloInviteFromSlack } from './useTrelloInviteFromSlack';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';

interface InviteFromSlackProps {
  idBoard: string;
  hasSlackConnection: boolean;
}
const InviteButton: React.FunctionComponent<InviteFromSlackProps> = ({
  idBoard,
  hasSlackConnection,
}) => {
  const { isSlackSearchDismissed, loading, error } = useTrelloInviteFromSlack(
    idBoard,
    false,
  );
  // show invite button when
  // 1. there is no slack connection
  // OR
  // 2. there is slack connection but search is disabled.
  const shouldRender =
    (!loading && !error && hasSlackConnection === false) ||
    (hasSlackConnection && isSlackSearchDismissed);
  return shouldRender ? <Button>Placeholder Slack Button</Button> : null;
};

export const InviteFromSlackInviteButton: React.FC<InviteFromSlackProps> = (
  props,
) => {
  return (
    <ComponentWrapper>
      <InviteButton {...props} />
    </ComponentWrapper>
  );
};
