import React from 'react';
import { debounce, isEqual } from 'lodash';

import { ChangedResponse } from 'bundles/compound-assessments/components/local-state/changed-response/types';
import { StepState } from 'bundles/compound-assessments/components/local-state/step-state/types';

import epic from 'bundles/epic/client';

const DEFAULT_DEBOUNCE_WAIT_TIME = 3000; // this can be overwritten with the debounceWaitTime prop value

type Props = {
  saveDraft?: (() => Promise<void>) | null;
  stepState: StepState;
  setStepState?: ((x0: Partial<StepState>) => void) | null;
  changedResponses: Array<ChangedResponse>;
  children: () => JSX.Element;
  debounceWaitTime?: number;
};

class AutoSaveDraft extends React.Component<Props> {
  componentDidUpdate(prevProps: Props) {
    const { changedResponses } = this.props;

    if (!isEqual(changedResponses, prevProps.changedResponses)) {
      this.autoSaveDraft();
    }
  }

  setAutoSavingStepState = (isAutoSaving: boolean) => {
    const { setStepState } = this.props;
    if (setStepState) {
      setStepState({ isAutoSaving });
    }
  };

  save = () => {
    const { saveDraft, stepState } = this.props;

    if (stepState.isSubmitting) {
      this.autoSaveDraft.cancel();
    } else if (stepState.isAutoSaving || stepState.isSaving) {
      this.autoSaveDraft();
    } else if (saveDraft) {
      this.setAutoSavingStepState(true);

      saveDraft().then(() => {
        this.setAutoSavingStepState(false);
      });
    }
  };

  autoSaveDraft = debounce(
    this.save,
    this.props.debounceWaitTime || epic.get('Flex', 'CAAutoSaveWaitTimeInMS') || DEFAULT_DEBOUNCE_WAIT_TIME
  );

  render() {
    const { children } = this.props;
    return children();
  }
}

export default AutoSaveDraft;
