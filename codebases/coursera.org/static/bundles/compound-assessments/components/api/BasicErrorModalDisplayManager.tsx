import React from 'react';
import initBem from 'js/lib/bem';

import BasicErrorModal from 'bundles/compound-assessments/components/modals/BasicErrorModal';

import { StepState as StepStateType } from 'bundles/compound-assessments/components/local-state/step-state/types';

const bem = initBem('BasicErrorModalDisplayManager');

type Props = {
  stepState: StepStateType;
  setStepState: (x0: Partial<StepStateType>) => void;
};

type State = {
  showErrorModal: boolean;
};

// This is a component that will display error modals based on the error code from StepState
export class BasicErrorModalDisplayManager extends React.Component<Props, State> {
  state = {
    showErrorModal: false,
  };

  componentWillReceiveProps(nextProps: Props) {
    const { stepState: newStepState } = nextProps;
    const { stepState } = this.props;

    // This part is to make sure we only show the modal once when the errorCode appears
    if (!stepState.errorCode && stepState.errorCode !== newStepState.errorCode) {
      this.setState({ showErrorModal: true });
    }
  }

  handleErrorConfirm = () => {
    const { setStepState } = this.props;
    this.setState({ showErrorModal: false });
    setStepState({ errorCode: null });
  };

  render() {
    const {
      stepState: { errorCode },
    } = this.props;
    const { showErrorModal } = this.state;

    return (
      <div className={bem()}>
        {showErrorModal && (
          <BasicErrorModal
            {...{
              errorCode,
              onPrimaryButtonClick: this.handleErrorConfirm,
              onCancelButtonClick: this.handleErrorConfirm,
            }}
          />
        )}
      </div>
    );
  }
}

export default BasicErrorModalDisplayManager;
