import React from 'react';
import { Box, Button } from '@coursera/coursera-ui';
import _t from 'i18n!nls/slack-account-link';
import SlackButtonV2 from './SlackButtonV2';

import 'css!./__styles__/LinkedAccountSlack';

type Props = {
  email: string;
  showLinkUnlink: boolean;
  slackLink: string;
  onUnlink: () => void;
  onEdit: (email: string) => void;
};

export class LinkedAccountSlack extends React.Component<Props> {
  render(): JSX.Element {
    const { onEdit, onUnlink, email, showLinkUnlink, slackLink } = this.props;

    return (
      <Box justifyContent="between" alignItems="start" flexDirection="column" rootClassName="rc-LinkedAccountSlack">
        <div className="slack-header" style={{ color: '#757575' }}>
          {_t('SLACK ACCOUNT EMAIL')}
        </div>
        <Box justifyContent="between" style={{ width: '100%' }} alignItems="end" flexWrap="wrap">
          <Box alignItems="baseline" flexWrap="wrap" style={{ width: '70%' }}>
            <div
              className="slack-account-email pii-hide"
              style={{
                paddingBottom: '10px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                color: '#2F2F2F',
              }}
            >
              {email}
            </div>
            {showLinkUnlink && (
              <div
                className="slack-account-action-button-group"
                style={{ display: 'flex', justifyContent: 'align-start' }}
              >
                <Button
                  type="link"
                  label={_t('Edit')}
                  rootClassName="slack-account-email-edit slack-account-action-button"
                  onClick={() => onEdit(email)}
                />
                <Button
                  type="link"
                  label={_t('Unlink')}
                  rootClassName="slack-account-email-unlink slack-account-action-button"
                  onClick={onUnlink}
                />
              </div>
            )}
          </Box>
          <SlackButtonV2
            className="launch-slack-button"
            slackLink={slackLink}
            aria-label={_t('Open Slack in new window')}
          />
        </Box>
      </Box>
    );
  }
}

export default LinkedAccountSlack;
