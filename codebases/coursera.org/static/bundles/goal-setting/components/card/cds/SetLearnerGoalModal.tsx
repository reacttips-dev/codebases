import React from 'react';

import Modal from 'bundles/ui/components/Modal';
import SetLearnerGoalFlow from 'bundles/goal-setting/components/card/cds/SetLearnerGoalFlow';

import { GoalChoice } from 'bundles/goal-setting/types/GoalChoice';

interface Props {
  onDismiss: () => void;
  isOpen: boolean;
  branchId: string | null;
  courseId: string;
  goalChoices: GoalChoice[];
}
const SetLearnerGoalModal: React.FC<Props> = ({ isOpen, onDismiss, branchId, courseId, goalChoices }) => (
  <Modal
    allowClose={true}
    shouldCloseOnOverlayClick={false}
    onRequestClose={onDismiss}
    isOpen={isOpen}
    className="rc-SetLearnerGoalModal"
  >
    <SetLearnerGoalFlow branchId={branchId} courseId={courseId} goalChoices={goalChoices} onDismiss={onDismiss} />
  </Modal>
);

export default SetLearnerGoalModal;
