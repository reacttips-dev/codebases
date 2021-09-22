import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap-33';

import 'css!./__styles__/TooltipWrapper';

type Props = {
  tooltipId?: string;
  tooltipClassName?: string;
  message?: React.ReactNode;
  show?: boolean | string;
  placement?: string;
  children: React.ReactNode;
};

function TooltipWrapper({ tooltipId, tooltipClassName, message, show = true, placement = 'top', children }: Props) {
  return show && message ? (
    <OverlayTrigger
      placement={placement}
      overlay={
        <Tooltip className={tooltipClassName} id={tooltipId}>
          {message}
        </Tooltip>
      }
    >
      <span className="rc-TooltipWrapper">{children}</span>
    </OverlayTrigger>
  ) : (
    <span className="rc-TooltipWrapper">{children}</span>
  );
}

export default TooltipWrapper;
