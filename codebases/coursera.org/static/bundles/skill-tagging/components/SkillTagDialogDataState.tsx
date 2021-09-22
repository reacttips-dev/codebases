import React from 'react';

import { Box, color } from '@coursera/coursera-ui';
import { SvgFail, SvgLoaderSignal } from '@coursera/coursera-ui/svg';

import _t from 'i18n!nls/skill-tagging';

import 'css!./__styles__/SkillTagDialogDataState';

type DataState = 'error' | 'loading' | 'thanks';
type Props = {
  dataState: DataState;
};

const SkillTagDialogDataState = ({ dataState }: Props) => (
  <Box rootClassName="rc-SkillTagDialogDataState" flexDirection="column" justifyContent="center" alignItems="center">
    {dataState === 'error' && [
      <SvgFail key="icon" size={84} color={color.error} />,
      <div key="message" className="data-state-message headline-5-text">
        {_t('There was an issue loading the skill tagging data. Please try refreshing the page.')}
      </div>,
    ]}

    {dataState === 'loading' && [
      <SvgLoaderSignal key="icon" size={84} />,
      <div key="message" className="data-state-message headline-5-text">
        {_t('Loading...')}
      </div>,
    ]}

    {dataState === 'thanks' && (
      <div className="skill-tag-modal-content">
        <div className="skill-tag-title">{_t('Thanks for your input')}</div>
        <span className="skill-tag-description skill-tag-description--centered">
          {_t('Your feedback will help us continue to make the learning experience better.')}
        </span>
      </div>
    )}
  </Box>
);

export default SkillTagDialogDataState;
