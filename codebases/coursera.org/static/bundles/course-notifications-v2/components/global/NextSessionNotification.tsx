import React from 'react';
import { GradientWrapper, Box, Button, gradient } from '@coursera/coursera-ui';
import { compose } from 'recompose';
import { NextSessionNotification as NextSessionNotificationType } from 'bundles/course-notifications-v2/types/CourseNotification';
import SessionSwitchModal from 'bundles/course-sessions/components/SessionSwitchModal';

import { rtlStyle } from 'js/lib/language';
import _t from 'i18n!nls/course-notifications-v2';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import withSessionLabel, { SessionLabel } from 'bundles/course-sessions/utils/withSessionLabel';
import mapProps from 'js/lib/mapProps';

const NotificationBox = (props: {}) => (
  <Box alignItems="center" flexDirection="column" justifyContent="start" {...props} />
);

type InputProps = {
  notification: NextSessionNotificationType;
};

type Props = InputProps & {
  sessionLabel: SessionLabel;
};

type State = {
  showModal: boolean;
};

export class NextSessionNotification extends React.Component<Props, State> {
  state: State = {
    showModal: false,
  };

  render() {
    const { showModal } = this.state;
    const {
      notification: {
        definition: { courseId },
      },
      sessionLabel,
    } = this.props;

    const action = (
      <Button
        size="sm"
        type="primary"
        label={sessionLabel === 'session' ? _t('Join a session') : _t('Join a schedule')}
        style={rtlStyle({ marginLeft: '60px' })}
        onClick={() => this.setState({ showModal: true })}
      />
    );

    return (
      <div className="rc-NextSessionNotification">
        <GradientWrapper
          tag={NotificationBox}
          gradient={gradient.sea}
          style={{
            padding: '10px',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          <FormattedMessage
            action={action}
            message={
              sessionLabel === 'session'
                ? _t(
                    'You can pick up where you left off. Just join a new session and we’ll reset your deadlines. {action}'
                  )
                : _t(
                    'You can pick up where you left off. Just join a new schedule and we’ll reset your deadlines. {action}'
                  )
            }
          />
        </GradientWrapper>

        {showModal && <SessionSwitchModal onClose={() => this.setState({ showModal: false })} courseId={courseId} />}
      </div>
    );
  }
}

export default compose<Props, InputProps>(
  mapProps(({ notification: { definition: { courseId } } }: Props) => ({
    courseId,
  })),
  withSessionLabel
)(NextSessionNotification);
