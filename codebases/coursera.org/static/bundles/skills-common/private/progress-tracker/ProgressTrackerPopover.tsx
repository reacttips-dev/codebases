import * as React from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap-33';

import 'css!./__styles__/ProgressTrackerPopover';

type ProgressTrackerPopoverProps = {
  popoverContent: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  defaultOverlayShown?: boolean;
  children: React.ReactNode;
};

const ProgressTrackerPopover: React.FC<ProgressTrackerPopoverProps> = (props) => {
  const { children, placement = 'top', popoverContent, ...rest } = props;

  const tooltip = (
    <Popover id="rc-ProgressTrackerPopover-Popover" positionTop={50} bsStyle="progressTrackerPopover">
      <div>{popoverContent}</div>
    </Popover>
  );

  return (
    <OverlayTrigger placement={placement} overlay={tooltip} {...rest}>
      {React.Children.only(children)}
    </OverlayTrigger>
  );
};

export default ProgressTrackerPopover;
