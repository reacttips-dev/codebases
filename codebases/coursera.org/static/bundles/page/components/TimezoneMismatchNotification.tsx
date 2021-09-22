import React from 'react';
import moment from 'moment-timezone';

import user from 'js/lib/user';
import DateTimeUtils from 'js/utils/DateTimeUtils';
import deferToClientSideRender from 'js/lib/deferToClientSideRender';

import Modal from 'bundles/phoenix/components/Modal';

import { SvgWarning } from '@coursera/coursera-ui/svg';
import { Box, color } from '@coursera/coursera-ui';

import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/common';

import 'css!./__styles__/TimezoneMismatchNotification';

type Props = {};

type State = {
  showModal: boolean;
};

class TimezoneMismatchNotification extends React.Component<Props, State> {
  state: State = {
    showModal: false,
  };

  componentDidMount() {
    const courseraSettingsTimezone = user.get().timezone;
    const localTimezone = moment.tz.guess();

    const areUTCOffsetsEqual = DateTimeUtils.hasEqualUTCOffset(courseraSettingsTimezone, localTimezone);

    if (!areUTCOffsetsEqual) {
      this.setState({ showModal: true });
    }
  }

  handleDismiss = () => {
    this.setState({ showModal: false });
  };

  render() {
    const courseraSettingsTimezone = user.get().timezone;
    const { showModal } = this.state;

    // show nothing if local timezone and Coursera settings timezone match
    if (!showModal) {
      return null;
    }

    return (
      <div className="rc-TimezoneMismatchNotification">
        <Modal
          className="top-right"
          type="popup"
          trackingName="timezone_mismatch_modal"
          handleClose={this.handleDismiss}
          modalName={_t('Timezone mismatch warning modal')}
        >
          <div className="timezone-modal-content">
            <Box>
              <div className="p-r-1">
                <SvgWarning size={24} color={color.warning} />
              </div>
              <div>
                <FormattedMessage
                  message={_t(
                    `Your computer's timezone does not seem to match your Coursera account's timezone setting of {courseraSettingsTimezone}.`
                  )}
                  courseraSettingsTimezone={courseraSettingsTimezone}
                />
                <br />
                <a href="/account-settings" target="_blank" rel="noopener noreferrer">
                  {_t('Change your Coursera timezone setting')}
                </a>
              </div>
            </Box>
          </div>
        </Modal>
      </div>
    );
  }
}

export default deferToClientSideRender(TimezoneMismatchNotification);
