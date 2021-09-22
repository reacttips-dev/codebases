import React from 'react';
import { Box } from '@coursera/coursera-ui';
import { SvgMembers } from '@coursera/coursera-ui/svg';

import _t from 'i18n!nls/slack-account-link';

import Modal from 'bundles/phoenix/components/Modal';

import { FormattedHTMLMessage } from 'react-intl';
import AccountLinkSlack from './AccountLinkSlack';
import { SlackAccountStatus, NetworkOperationState, SlackAccount, NetworkOperationStates } from '../types/SlackAccount';
import { VERIFY, LINKED, SLACK_ACCOUNT_STATUS } from '../constants';
import { link } from '../utills/SlackAccountAPIUtils';
import { NotificationType, SlackAccountComponentNotification } from './SlackAccountComponentNotification';
import 'css!./__styles__/SlackAccountModal';

type Props = {
  email: string;
  degreeId: string;
  slackTeamDomainName?: string;
  classMatesWithSlackAccountCount: number;
  onClose: (status: SlackAccountStatus) => void;
};

type State = {
  email: string;
  status: SlackAccountStatus;
  initialStatus: SlackAccountStatus;
  linkOperationStatus: NetworkOperationState | null;
};

class SlackAccountModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { email } = props;

    this.state = {
      email: email || '',
      status: SLACK_ACCOUNT_STATUS.UNLINKED as SlackAccountStatus,
      initialStatus: SLACK_ACCOUNT_STATUS.UNLINKED as SlackAccountStatus,
      linkOperationStatus: null,
    };
  }

  onLink = (emailValue: string) => {
    const { degreeId } = this.props;
    this.setState({ linkOperationStatus: NetworkOperationStates.IN_PROGRESS });

    link(degreeId, emailValue)
      .then((result: SlackAccount) => {
        const { email } = result;

        this.setState({
          email: email || '',
          status: SLACK_ACCOUNT_STATUS.EMAIL_VERIFIED as SlackAccountStatus,
          initialStatus: SLACK_ACCOUNT_STATUS.EMAIL_VERIFIED as SlackAccountStatus,
          linkOperationStatus: NetworkOperationStates.SUCCESS,
        });
      })
      .catch(() => {
        this.setState({
          email: emailValue,
          status: SLACK_ACCOUNT_STATUS.UNLINKED as SlackAccountStatus,
          linkOperationStatus: NetworkOperationStates.FAILED,
        });
      });
  };

  renderNotification = () => {
    const { slackTeamDomainName } = this.props;
    const { initialStatus, linkOperationStatus } = this.state;
    let status: null | NotificationType = null;
    const signupLink = slackTeamDomainName
      ? `https://${slackTeamDomainName}.slack.com/signup`
      : 'https://slack.com/get-started';

    if (
      initialStatus === SLACK_ACCOUNT_STATUS.UNLINKED &&
      !(linkOperationStatus === NetworkOperationStates.IN_PROGRESS)
    ) {
      status = NotificationType.INFO;
    }

    if (linkOperationStatus === NetworkOperationStates.FAILED) {
      status = NotificationType.LINK_ERROR;
    } else if (linkOperationStatus === NetworkOperationStates.SUCCESS) {
      status = NotificationType.LINK_SUCCESS;
    }

    return (
      <SlackAccountComponentNotification
        notificationType={status}
        onDismiss={() => this.setState({ linkOperationStatus: null })}
        signupLink={signupLink}
      />
    );
  };

  render() {
    const { classMatesWithSlackAccountCount } = this.props;
    const { email, status, linkOperationStatus } = this.state;

    return (
      <Modal
        modalName="link-slack-account-modal"
        className="rc-SlackAccountModal"
        allowClose={true}
        handleClose={() => this.props.onClose(this.state.status)}
      >
        <div className="link-slack-account-modal-content" style={{ minHeight: '230px' }}>
          <div
            className="link-slack-account-modal-header"
            style={{ fontSize: '24px', lineHeight: '28px', fontWeight: 'normal', marginBottom: '12px' }}
          >
            {_t('Link your Slack account')}
          </div>
          <Box style={{ marginBottom: '10px' }}>
            <SvgMembers />
            <span
              className="slack-account-modal-info-message"
              style={{ fontSize: '14px', lineHeight: '24px', marginLeft: '10px' }}
            >
              {classMatesWithSlackAccountCount > 10 ? (
                <FormattedHTMLMessage
                  message={_t(
                    '<strong>{number}</strong> of your classmates are on Slack. Join them by linking your Slack account to Coursera.'
                  )}
                  number={classMatesWithSlackAccountCount}
                />
              ) : (
                _t('Your classmates are talking on Slack. Join them by linking your Slack account to Coursera.')
              )}
            </span>
          </Box>
          {this.renderNotification()}
          <AccountLinkSlack
            mode={status === SLACK_ACCOUNT_STATUS.UNLINKED ? VERIFY : LINKED}
            showLinkUnlink={false}
            email={email}
            errorState={linkOperationStatus === NetworkOperationStates.FAILED}
            onLink={this.onLink}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onUnlink={() => {}}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onEdit={() => {}}
          />
        </div>
      </Modal>
    );
  }
}

export default SlackAccountModal;
