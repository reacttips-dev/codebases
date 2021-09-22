import React from 'react';

import { ApiButton, Button, Box, H4Bold } from '@coursera/coursera-ui';
import { API_BEFORE_SEND, API_IN_PROGRESS } from '@coursera/coursera-ui/lib/constants/sharedConstants';

import computeGoalProgressLevel from 'bundles/goal-setting/utils/computeGoalProgressLevel';
import GoalSettingSetGoalOptionList from 'bundles/goal-setting/components/GoalSettingSetGoalOptionList';
import withSingleTracked from 'bundles/common/components/withSingleTracked';
import TrackedDiv from 'bundles/page/components/TrackedDiv';

import { GoalChoice } from 'bundles/goal-setting/types/GoalChoice';
import { LearnerGoal } from 'bundles/goal-setting/types/LearnerGoal';

import _t from 'i18n!nls/video-quiz';

import 'css!bundles/goal-setting/components/__styles__/GoalSettingSetGoal';

type Props = {
  goalChoices: GoalChoice[];
  onDismiss: () => void;
  goalCreationInProgress: boolean;
  onGoalSelection: (choice: GoalChoice) => void;
  existingLearnerGoal?: LearnerGoal;
};

type State = {
  selectedIndex: number;
};

const TrackedButton = withSingleTracked({ type: 'BUTTON' })(Button);
const TrackedApiButton = withSingleTracked({ type: 'BUTTON' })(ApiButton);

export class GoalSettingSetGoal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { goalChoices, existingLearnerGoal } = props;

    if (existingLearnerGoal !== null && existingLearnerGoal !== undefined) {
      const {
        goalType: {
          definition: { n: existingN },
          typeName: existingType,
        },
      } = existingLearnerGoal;

      const existingIndex = goalChoices.findIndex(
        ({
          goalType: {
            definition: { n },
            typeName,
          },
        }) => n === existingN && typeName === existingType
      );

      this.state = {
        selectedIndex: existingIndex,
      };
    } else {
      this.state = {
        selectedIndex: goalChoices.findIndex(({ isRecommended }) => isRecommended),
      };
    }
  }

  onChange = (index: number) => {
    this.setState({
      selectedIndex: index,
    });
  };

  onSubmit = () => {
    const { goalChoices, onGoalSelection } = this.props;
    const { selectedIndex } = this.state;

    onGoalSelection(goalChoices[selectedIndex]);
  };

  render() {
    const { goalChoices, goalCreationInProgress, onDismiss, existingLearnerGoal } = this.props;
    const { selectedIndex } = this.state;

    const trackingPrefix = existingLearnerGoal ? 'edit_goal' : 'set_goal';
    const selectedGoal = goalChoices[selectedIndex];
    const goalProgressLevel = existingLearnerGoal
      ? computeGoalProgressLevel({ learnerGoal: existingLearnerGoal })
      : 'no_goal_set';

    let headerText = _t('Set a weekly goal');
    let cancelText = _t('Not now');
    let saveText = _t('Set goal');
    let savingText = _t('Setting goal...');

    if (existingLearnerGoal) {
      headerText = _t('Edit your weekly goal');
      cancelText = _t('Cancel');
      saveText = _t('Save');
      savingText = _t('Saving...');
    }

    return (
      <div className="rc-GoalSettingSetGoal">
        <TrackedDiv
          trackingName={`${trackingPrefix}_message`}
          data={{
            selectedGoal,
            goalProgressLevel,
          }}
          trackClicks={false}
          requireFullyVisible={false}
          withVisibilityTracking
        >
          <H4Bold>{headerText}</H4Bold>
          <p>{_t('Learners who set a goal are 75% more likely to complete the course. You can always change it.')}</p>
          <GoalSettingSetGoalOptionList
            goalChoices={goalChoices}
            selectedIndex={selectedIndex}
            onChange={this.onChange}
          />
          {!existingLearnerGoal && (
            <div className="disclaimer-text">{_t('Your goal will be tracked Monday - Sunday')}</div>
          )}

          <Box flexDirection="row" justifyContent="end" rootClassName="buttons">
            <TrackedButton
              trackingName={`${trackingPrefix}_dismiss`}
              trackingData={{ goalProgressLevel }}
              type="link"
              rootClassName="dismiss-button"
              onClick={onDismiss}
            >
              {cancelText}
            </TrackedButton>

            <TrackedApiButton
              trackingName={`${trackingPrefix}_cta`}
              trackingData={{ goalProgressLevel }}
              disabled={selectedIndex < 0}
              apiStatus={goalCreationInProgress ? API_IN_PROGRESS : API_BEFORE_SEND}
              type="primary"
              onClick={this.onSubmit}
              rootClassName="primary-button"
              apiStatusAttributesConfig={{
                label: {
                  API_BEFORE_SEND: saveText,
                  API_IN_PROGRESS: savingText,
                },
              }}
            />
          </Box>
        </TrackedDiv>
      </div>
    );
  }
}

export default GoalSettingSetGoal;
