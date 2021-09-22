import React from 'react';
import classNames from 'classnames';

import { Box } from '@coursera/coursera-ui';

import { DayOfWeek, DAYS_OF_WEEK } from 'bundles/goal-setting/utils/constants';

import 'css!bundles/goal-setting/components/__styles__/GoalSettingSetScheduleDays';

type Props = {
  selectedDays: DayOfWeek[];
  onChange: (selectedDays: DayOfWeek[]) => void;
};

export class GoalSettingSetScheduleDays extends React.Component<Props> {
  static defaultProps = {
    selectedDays: [],
  };

  toggleDay = (dayName: DayOfWeek) => {
    const { onChange } = this.props;

    let { selectedDays } = this.props;

    if (selectedDays.indexOf(dayName) > -1) {
      selectedDays = selectedDays.filter((i) => i !== dayName);
    } else {
      selectedDays = [...selectedDays, dayName];
    }

    onChange(selectedDays);
  };

  render() {
    const { selectedDays } = this.props;

    return (
      <div className="rc-GoalSettingSetScheduleDays">
        <Box flexDirection="row">
          {Object.keys(DAYS_OF_WEEK).map((day) => (
            <Box
              key={day}
              onClick={() => this.toggleDay(day as DayOfWeek)}
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              rootClassName={classNames('day', {
                selected: selectedDays.includes(day as DayOfWeek),
              })}
            >
              {DAYS_OF_WEEK[day]}
            </Box>
          ))}
        </Box>
      </div>
    );
  }
}

export default GoalSettingSetScheduleDays;
