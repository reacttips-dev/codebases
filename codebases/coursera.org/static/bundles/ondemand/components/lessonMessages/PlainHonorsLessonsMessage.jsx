import React from 'react';

import { SvgHonorsAssignment } from '@coursera/coursera-ui/svg';

import HonorsTooltipTrigger from 'bundles/ondemand/components/lessonMessages/HonorsTooltipTrigger';

import { rtlStyle } from 'js/lib/language';
import _t from 'i18n!nls/ondemand';

import 'css!./__styles__/PlainHonorsLessonsMessage';

const PlainHonorsLessonsMessage = () => (
  <div className="rc-PlainHonorsLessonsMessage horizontal-box align-items-vertical-center">
    <SvgHonorsAssignment size={22} style={rtlStyle({ marginRight: '10px' })} />
    <strong style={rtlStyle({ marginRight: '10px' })}>{_t('Optional Honors Content')}</strong>
    <HonorsTooltipTrigger />
  </div>
);

export default PlainHonorsLessonsMessage;
