import React from 'react';
import _t from 'i18n!nls/slack-account-link';
import SlackAccountModal from './SlackAccountModal';
import { SlackAccountStatus } from '../types/SlackAccount';

import SlackButtonV2 from './SlackButtonV2';
import SlackButtonV2WithCDS from './SlackButtonV2WithCDS';

type Props = {
  accountStatus: SlackAccountStatus;
  degreeId: string;
  email: string;
  slackLink: string;
  className: string;
  buttonText: string;
  classMatesWithSlackAccountCount?: number;
  onUpdate?: (status: SlackAccountStatus) => void;
  disabled?: boolean;
  teamDomain?: string;
  cdsEnabled?: boolean;
  buttonVariant?: 'secondary' | 'primary' | 'primaryInvert' | 'ghost' | 'ghostInvert';
};
type State = { showSlackAccountLinkingModal: boolean };

/**
 * SlackButtonWithAccountLinking component can have two possible actions based on accountStatus
 * If accountStatus is EMAIL_VERIFIED button click will open slackLink in a new window
 * If accountStatus is UNLINKED, button click opens a modal that will facilitate the account linking workflow
 * This component takes care of encapsulating these workflows, in case the user goes through the
 * account linking workflow in the modal onUpdate callback will provide the updated account status
 */
class SlackButtonWithAccountLinking extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showSlackAccountLinkingModal: false,
    };
  }

  render() {
    const {
      accountStatus,
      degreeId,
      slackLink,
      className,
      buttonText,
      classMatesWithSlackAccountCount = 0,
      disabled = false,
      teamDomain,
      onUpdate,
      cdsEnabled,
      buttonVariant,
    } = this.props;
    const { showSlackAccountLinkingModal } = this.state;

    let button;
    if (accountStatus === 'EMAIL_VERIFIED') {
      if (cdsEnabled) {
        button = (
          <SlackButtonV2WithCDS
            slackLink={slackLink}
            buttonText={buttonText}
            aria-label={_t('Open Slack app in new tab')}
            className={className}
            buttonVariant={buttonVariant}
          />
        );
      } else {
        button = (
          <SlackButtonV2
            slackLink={slackLink}
            buttonText={buttonText}
            aria-label={_t('Open Slack app in new tab')}
            className={className}
          />
        );
      }
    } else if (cdsEnabled) {
      button = (
        <SlackButtonV2WithCDS
          slackLink={slackLink}
          buttonText={buttonText}
          aria-label={_t('Open Slack account linking modal')}
          className={className}
          onClick={() => {
            this.setState({ showSlackAccountLinkingModal: true });
          }}
          buttonVariant={buttonVariant}
        />
      );
    } else {
      button = (
        <SlackButtonV2
          slackLink={slackLink}
          buttonText={buttonText}
          aria-label={_t('Open Slack account linking modal')}
          className={className}
          onClick={() => {
            this.setState({ showSlackAccountLinkingModal: true });
          }}
        />
      );
    }
    return (
      <div
        className="rc-SlackButtonWithAccountLinking"
        style={disabled ? { pointerEvents: 'none', opacity: '0.5' } : {}}
      >
        {showSlackAccountLinkingModal && (
          <SlackAccountModal
            email=""
            degreeId={degreeId}
            classMatesWithSlackAccountCount={classMatesWithSlackAccountCount}
            slackTeamDomainName={teamDomain}
            onClose={(state: SlackAccountStatus) => {
              if (onUpdate) onUpdate(state);
              this.setState({ showSlackAccountLinkingModal: false });
            }}
          />
        )}
        {button}
      </div>
    );
  }
}

export default SlackButtonWithAccountLinking;
