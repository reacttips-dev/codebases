import React from 'react';

import { Button } from '@coursera/coursera-ui';

import withSingleTracked from 'bundles/common/components/withSingleTracked';
import SessionSwitchModal from 'bundles/course-sessions/components/SessionSwitchModal';
import SessionJoinModal from 'bundles/course-sessions/components/SessionJoinModal';
import withSessionLabel, { SessionLabel } from '../utils/withSessionLabel';

import _t from 'i18n!nls/course-sessions';

const TrackedButton = withSingleTracked({ type: 'BUTTON' })(Button);

type InputProps = {
  courseId: string;
  buttonText?: string;
  style?: { [styleAttr: string]: string | number };
  size?: 'sm' | 'md' | 'lg';
  type?: 'primary' | 'secondary';
  isSelfServeSession?: boolean;
};

type Props = InputProps & {
  sessionLabel: SessionLabel;
};

type State = {
  showModal: boolean;
};

class SessionSwitchButton extends React.Component<Props, State> {
  static defaultProps: Partial<InputProps> = {
    isSelfServeSession: false,
    size: 'md',
    type: 'primary',
  };

  state = {
    showModal: false,
  };

  handleClick = () => {
    this.setState({ showModal: true });
  };

  render() {
    const { type, sessionLabel, courseId, size, buttonText, isSelfServeSession } = this.props;
    const { showModal } = this.state;

    const sessionModal = isSelfServeSession ? (
      <SessionJoinModal onClose={() => this.setState({ showModal: false })} courseId={courseId} />
    ) : (
      <SessionSwitchModal onClose={() => this.setState({ showModal: false })} courseId={courseId} />
    );

    return (
      <div className="rc-SessionSwitchButton align-self-center">
        <TrackedButton size={size} type={type} trackingName="next_step_click" onClick={() => this.handleClick()}>
          {buttonText && buttonText}
          {!buttonText && (sessionLabel === 'session' ? _t('Switch Sessions') : _t('Switch Schedules'))}
        </TrackedButton>

        {showModal && sessionModal}
      </div>
    );
  }
}

export default withSessionLabel(SessionSwitchButton);
