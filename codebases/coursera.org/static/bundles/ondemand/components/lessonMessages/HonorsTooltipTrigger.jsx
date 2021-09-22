import React from 'react';

import { SvgHelp } from '@coursera/coursera-ui/svg';

import { OverlayTrigger, Tooltip } from 'react-bootstrap-33';

import _t from 'i18n!nls/ondemand';

import 'css!./__styles__/HonorsTooltipTrigger';

const HonorsTooltipTrigger = () => {
  const honorsTooltip = (
    <Tooltip className="od-lesson-message-honors-tooltip">
      <ul>
        <li>
          {_t(
            'Earn Honors recognition by completing all required assignments in the course and all Honors assignments.'
          )}
        </li>
        <li>{_t('Honors assignments are not required to pass the course.')}</li>
        <li>{_t('Your performance on Honors assignments will not affect your course grade.')}</li>
      </ul>
    </Tooltip>
  );

  return (
    <div className="rc-HonorsTooltipTrigger">
      <OverlayTrigger placement="top" overlay={honorsTooltip}>
        <div className="horizontal-box align-items-vertical-center">
          <SvgHelp size={22} />
        </div>
      </OverlayTrigger>
    </div>
  );
};

export default HonorsTooltipTrigger;
