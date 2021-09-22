import React from 'react';
import VerifyAccountSlack from './VerifyAccountSlack';
import LinkedAccountSlack from './LinkedAccountSlack';

type componentState = 'VERIFY' | 'LINKED';

type Props = {
  mode: componentState;
  showLinkUnlink: boolean;
  email: string;
  errorState?: boolean;
  slackLink?: string;
  onLink: (email: string) => void;
  onUnlink: () => void;
  onEdit: (email: string) => void;
};

export class AccountLinkSlack extends React.Component<Props> {
  render(): JSX.Element {
    const { onLink, onUnlink, onEdit, email, showLinkUnlink, errorState, mode, slackLink } = this.props;
    const emailValue = email || '';
    const slackLinkValue = slackLink || 'slack://open';

    return (
      <div className="rc-AccountLinkSlack">
        {mode === 'VERIFY' ? (
          <VerifyAccountSlack email={emailValue} errorState={!!errorState} onLink={onLink} />
        ) : (
          <LinkedAccountSlack
            email={emailValue}
            showLinkUnlink={showLinkUnlink}
            slackLink={slackLinkValue}
            onUnlink={onUnlink}
            onEdit={onEdit}
          />
        )}
      </div>
    );
  }
}

export default AccountLinkSlack;
