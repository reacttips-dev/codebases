import React from 'react';
import { useTrelloInviteFromSlack } from './useTrelloInviteFromSlack';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';

interface InviteFromSlackProps {
  idBoard: string;
  hasSlackConnection: boolean;
}
const CaptionLink: React.FunctionComponent<InviteFromSlackProps> = ({
  idBoard,
  hasSlackConnection,
}) => {
  const { isSlackSearchDismissed, loading, error } = useTrelloInviteFromSlack(
    idBoard,
    false,
  );
  // show caption link when
  // 1. there is slack connection
  // AND
  // 2. slack search is not disabled.
  const shouldRender =
    !loading && !error && hasSlackConnection && !isSlackSearchDismissed;
  return shouldRender ? <a>Placeholder Slack Link</a> : null;
};

export const InviteFromSlackCaptionLink: React.FC<InviteFromSlackProps> = (
  props,
) => {
  return (
    <ComponentWrapper>
      <CaptionLink {...props} />
    </ComponentWrapper>
  );
};
