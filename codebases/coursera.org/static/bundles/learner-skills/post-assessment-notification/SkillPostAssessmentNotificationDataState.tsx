import React from 'react';

import { Box, color } from '@coursera/coursera-ui';
import { SvgFail, SvgLoaderSignal } from '@coursera/coursera-ui/svg';

import _t from 'i18n!nls/skills-common';

type DataState = 'error' | 'loading';
type Props = {
  dataState: DataState;
};

const SkillPostAssessmentNotificationDataState = ({ dataState }: Props) => (
  <Box rootClassName="rc-SkillTagDialogDataState" flexDirection="column" justifyContent="center" alignItems="center">
    {dataState === 'error' && [
      <SvgFail key="icon" size={84} color={color.error} />,
      <div key="message" className="data-state-message headline-5-text">
        {_t('There was an issue loading the skill assessment notification.')}
      </div>,
    ]}

    {dataState === 'loading' && [
      <SvgLoaderSignal key="icon" size={84} />,
      <div key="message" className="data-state-message headline-5-text">
        {_t('Loading...')}
      </div>,
    ]}
  </Box>
);

export default SkillPostAssessmentNotificationDataState;
