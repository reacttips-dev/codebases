import React from 'react';

import BasicErrorModal from 'bundles/compound-assessments/components/modals/BasicErrorModal';
import StartAttemptModal from 'bundles/compound-assessments/components/modals/StartAttemptModal';
import TimedAttemptStartModal from './quiz-modals/TimedAttemptStartModal';
import UnansweredQuestionsModal from './quiz-modals/UnansweredQuestionsModal';
import TimeExpiredModal from './quiz-modals/TimeExpiredModal';
import LastAttemptModal from './quiz-modals/LastAttemptModal';

const MODAL_TYPES = {
  basicErrorModal: BasicErrorModal,
  startAttemptModal: StartAttemptModal,
  lastAttemptModal: LastAttemptModal,
  timedAttemptStart: TimedAttemptStartModal,
  timeExpiredModal: TimeExpiredModal,
  unansweredQuestions: UnansweredQuestionsModal,
};

export const ModalTypes = {
  basicErrorModal: 'basicErrorModal',
  startAttemptModal: 'startAttemptModal',
  lastAttemptModal: 'lastAttemptModal',
  timedAttemptStart: 'timedAttemptStart',
  timeExpiredModal: 'timeExpiredModal',
  unansweredQuestions: 'unansweredQuestions',
} as const;

export type ModalType = typeof ModalTypes[keyof typeof ModalTypes];

type ModalProps = {
  onPrimaryButtonClick?: () => any;
  [key: string]: any;
};
export type ShowModalFunctionType = (x0: { type: ModalType; props: ModalProps }) => void;

type Props = {
  children: (x0: { hideModal: () => void; showModal: ShowModalFunctionType }) => React.ReactNode;
};

type State = {
  modalType?: ModalType | null;
  modalProps?: ModalProps | null;
};

class AssessmentModal extends React.Component<Props, State> {
  state: State = {
    modalType: null,
    modalProps: null,
  };

  onPrimaryButtonClick = () => {
    const { modalProps } = this.state;
    if (modalProps && modalProps.onPrimaryButtonClick) {
      modalProps.onPrimaryButtonClick();
    }
    this.hideModal();
  };

  showModal = ({ type, props }: { type: ModalType; props: ModalProps }) => {
    this.setState({ modalType: type, modalProps: props });
  };

  hideModal = () => {
    this.setState({ modalType: null, modalProps: null });
  };

  renderModal = (type: any) => {
    const { modalProps } = this.state;
    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const Modal = MODAL_TYPES[type];
    return (
      <Modal {...modalProps} onCancelButtonClick={this.hideModal} onPrimaryButtonClick={this.onPrimaryButtonClick} />
    );
  };

  render() {
    const { hideModal, showModal, renderModal } = this;
    const { children } = this.props;
    const { modalType } = this.state;
    return (
      <div>
        {modalType && renderModal(modalType)}
        {children({ hideModal, showModal })}
      </div>
    );
  }
}

// HOC in case it is needed
export const withAssessmentModal = (BaseComponent: any) => {
  return (props: any) => (
    <AssessmentModal>
      {({ hideModal, showModal }) => {
        return <BaseComponent hideModal={hideModal} showModal={showModal} {...props} />;
      }}
    </AssessmentModal>
  );
};

export default AssessmentModal;
