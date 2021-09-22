import React from 'react';
import _t from 'i18n!nls/asset-admin';
import TooltipWrapper from 'bundles/authoring/common/components/TooltipWrapper';
import { SvgCheck } from '@coursera/coursera-ui/svg';
import { color } from '@coursera/coursera-ui';

import 'css!./__styles__/DescriptionCompleteTag';

type InputProps = {
  description: string;
};

const DescriptionCompleteTag: React.FC<InputProps> = ({ description }) => {
  return (
    <div className="rc-DescriptionCompleteTag">
      <div className="flex-container">
        <TooltipWrapper message={description} placement="top">
          <div className="check-icon">
            <SvgCheck size={16} color={color.success} />
          </div>
          <span className="completed-label">{_t('Completed')}</span>
        </TooltipWrapper>
      </div>
    </div>
  );
};

export default DescriptionCompleteTag;
