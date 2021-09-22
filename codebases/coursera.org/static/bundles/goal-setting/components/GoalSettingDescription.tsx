import React from 'react';

import 'css!bundles/goal-setting/components/__styles__/GoalSettingDescription';

type Props = {
  children: string;
};

export default ({ children }: Props) => <p className="rc-GoalSettingDescription">{children}</p>;
