import React from 'react';

import { H4Bold } from '@coursera/coursera-ui';

import 'css!bundles/goal-setting/components/__styles__/GoalSettingHeader';

type Props = {
  children: string;
};

export default ({ children }: Props) => <H4Bold rootClassName="rc-GoalSettingHeader">{children}</H4Bold>;
