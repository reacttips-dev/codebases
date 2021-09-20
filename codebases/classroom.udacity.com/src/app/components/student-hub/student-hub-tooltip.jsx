import { Heading } from '@udacity/veritas-components';
import React from 'react';
import { Tooltip } from '@udacity/veritas-components';
import UiHelper from 'helpers/ui-helper';
import { __ } from 'services/localization-service';
import { actionsBinder } from 'helpers/action-helper';
import { connect } from 'react-redux';
import styles from './index.scss';

const mapStateToProps = (state) => {
  return {
    isStudentHubWelcomeToolTipVisible: UiHelper.State.isStudentHubWelcomeToolTipVisible(
      state
    ),
  };
};

const mapDispatchToProps = () => actionsBinder('dismissStudentHubTooltip');

class StudentHubTooltip extends React.Component {
  dismissToolTip = () => {
    const { dismissStudentHubTooltip } = this.props;
    dismissStudentHubTooltip();
  };

  render() {
    const {
      children,
      isStudentHubWelcomeToolTipVisible,
      shouldRender,
    } = this.props;

    const overlayTooltipCopy = isStudentHubWelcomeToolTipVisible
      ? __('Chat with your mentor and classmates in Student Hub.')
      : __('Student Hub');

    const overlayTooltip = (
      <div className={styles.inner}>
        <div>{overlayTooltipCopy}</div>
        {isStudentHubWelcomeToolTipVisible && (
          <Heading size="h5">
            <a href="#" onClick={this.dismissToolTip}>
              {__('Got It')}
            </a>
          </Heading>
        )}
      </div>
    );

    return shouldRender ? (
      <Tooltip
        placement="end"
        content={overlayTooltip}
        trigger={children}
        open={isStudentHubWelcomeToolTipVisible}
      />
    ) : (
      children
    );
  }
}

const reduxTooltip = connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentHubTooltip);

export { reduxTooltip as default, StudentHubTooltip };
