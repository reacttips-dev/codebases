import React from 'react';

import Modal from 'bundles/ui/components/Modal';
import ModalButtonFooter from 'bundles/authoring/common/modals/ModalButtonFooter';
import initBem from 'js/lib/bem';

import 'css!./__styles__/AssessmentModalLayout';

const bem = initBem('AssessmentModalLayout');

type Props = {
  title: React.ReactNode;
  content: React.ReactNode;
  primaryButtonContents: string;
  cancelButtonContents?: string;
  hideCancelButton?: boolean;
  onCancelButtonClick: () => void;
  onPrimaryButtonClick: () => void;
};

const AssessmentModalLayout = ({
  title,
  content,
  onCancelButtonClick,
  onPrimaryButtonClick,
  primaryButtonContents,
  cancelButtonContents,
  hideCancelButton,
}: Props) => {
  return (
    <Modal onRequestClose={onCancelButtonClick} title={title} size="large" className={bem()}>
      <div className={bem('content')}>{content}</div>
      <div className={bem('control')}>
        <ModalButtonFooter
          onPrimaryButtonClick={onPrimaryButtonClick}
          onCancelButtonClick={hideCancelButton ? undefined : onCancelButtonClick}
          primaryButtonContents={primaryButtonContents}
          cancelButtonContents={cancelButtonContents}
        />
      </div>
    </Modal>
  );
};

export default AssessmentModalLayout;
