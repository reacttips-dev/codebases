import React from 'react';

import { Button, ButtonProps } from '@coursera/cds-core';

import withSingleTracked from 'bundles/common/components/withSingleTracked';
import SessionSwitchModal from 'bundles/course-sessions/components/SessionSwitchModal';
import SessionJoinModal from 'bundles/course-sessions/components/SessionJoinModal';
import _t from 'i18n!nls/course-sessions';
import withSessionLabel, { SessionLabel } from '../../utils/withSessionLabel';

const ButtonWrapper: React.FunctionComponent<ButtonProps> = (props) => <Button {...props} />;

const TrackedButton = withSingleTracked({ type: 'BUTTON' })(ButtonWrapper);

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
    const { sessionLabel, courseId, buttonText, isSelfServeSession } = this.props;
    const { showModal } = this.state;

    const sessionModal = isSelfServeSession ? (
      <SessionJoinModal onClose={() => this.setState({ showModal: false })} courseId={courseId} />
    ) : (
      <SessionSwitchModal onClose={() => this.setState({ showModal: false })} courseId={courseId} />
    );

    const sessionLabelTypeToDisplay = sessionLabel === 'session' ? _t('Switch Sessions') : _t('Switch Schedules');
    const displayBtnText = buttonText || sessionLabelTypeToDisplay;

    return (
      <div className="rc-SessionSwitchButton align-self-center">
        <TrackedButton variant="primary" trackingName="next_step_click" onClick={() => this.handleClick()}>
          {displayBtnText}
        </TrackedButton>

        {showModal && sessionModal}
      </div>
    );
  }
}

export default withSessionLabel(SessionSwitchButton);
