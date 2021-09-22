import React, { Component } from 'react';

import { Radio } from '@coursera/coursera-ui';

import _t from 'i18n!nls/video-quiz';

import 'css!bundles/goal-setting/components/__styles__/GoalSettingSetGoalOption';

type Props = {
  onChange: () => void;
  checked: boolean;
  children: React.ReactNode;
  isRecommended?: boolean;
};

class GoalSettingSetGoalOption extends Component<Props> {
  static defaultProps = {
    isRecommended: false,
  };

  render() {
    const { checked, onChange, children, isRecommended } = this.props;

    return (
      <div aria-hidden={true} className="rc-GoalSettingSetGoalOption">
        <Radio checked={checked} onChange={onChange}>
          {children}
        </Radio>
        {isRecommended && <div className="recommended-label">{_t('Recommended')}</div>}
      </div>
    );
  }
}

export default GoalSettingSetGoalOption;
