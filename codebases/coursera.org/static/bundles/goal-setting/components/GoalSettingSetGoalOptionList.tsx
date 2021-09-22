import React, { Component } from 'react';

import { Box } from '@coursera/coursera-ui';

import CML from 'bundles/cml/components/CML';
import CMLUtils from 'bundles/cml/utils/CMLUtils';
import GoalSettingSetGoalOption from 'bundles/goal-setting/components/GoalSettingSetGoalOption';

import { GoalChoice } from '../types/GoalChoice';

import 'css!bundles/goal-setting/components/__styles__/GoalSettingSetGoalOptionList';

type Props = {
  goalChoices: GoalChoice[];
  onChange: (index: number) => void;
  selectedIndex: number;
};

class GoalSettingSetGoalOptionList extends Component<Props> {
  static defaultProps = {
    goalChoices: [],
  };

  onChange = (index: number) => () => {
    const { onChange } = this.props;
    onChange(index);
  };

  render() {
    const { goalChoices, selectedIndex } = this.props;

    return (
      <Box rootClassName="rc-GoalSettingSetGoalOptionList" flexDirection="column">
        {goalChoices.map(({ isRecommended, name }, idx) => (
          <GoalSettingSetGoalOption
            key={CMLUtils.getValue(name)}
            isRecommended={isRecommended}
            checked={idx === selectedIndex}
            onChange={this.onChange(idx)}
          >
            <CML className="option-cml" cml={name} />
          </GoalSettingSetGoalOption>
        ))}
      </Box>
    );
  }
}

export default GoalSettingSetGoalOptionList;
