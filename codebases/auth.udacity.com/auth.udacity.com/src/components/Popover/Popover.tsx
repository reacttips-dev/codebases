import React, { useRef } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import {
  Manager,
  Reference,
  Popper,
  ReferenceChildrenProps
} from "react-popper";
import {
  useOnClickOutside,
  useOnEscKeyDown,
  useDirectionToPopperPlacement
} from "../../utils";

const PREFIX = "vds-popover";

/** Popover Props */

export interface PopoverProps {
  /** Content to display inside the Popover */
  children: React.ReactNode;

  /** Callback when Popover is closed */
  onClose(evt?: React.MouseEvent): void;

  /** The trigger element */
  trigger: React.ReactNode;

  /** Preferred display direction. Popover will recompute its placement dynamically based on available browser space to prevent clipped text */
  direction?: "start" | "end" | "bottom" | "top";

  /** Toggles whether Popover is visible and rendered in DOM */
  open?: boolean;
}

/** Popover is a small overlay that appears contextually to provide messaging and additional content. */

const Popover: React.FC<PopoverProps> = ({
  children,
  onClose,
  trigger,
  direction = "bottom",
  open
}: PopoverProps) => {
  // Close when clicked outside
  const popoverRef = useRef<HTMLInputElement>(null);
  useOnClickOutside(popoverRef, onClose);

  // Close when `esc` is pressed
  useOnEscKeyDown(onClose);

  // Setup classnames
  const className = classNames(PREFIX);
  const arrowClassName = classNames("vds-tail", "vds-tail--inverse");

  const popoverTrigger = (
    <Reference>
      {({ ref }: ReferenceChildrenProps): React.ReactNode => (
        <span
          aria-describedby={PREFIX}
          aria-expanded={open}
          aria-haspopup
          ref={ref}
        >
          {trigger}
        </span>
      )}
    </Reference>
  );

  const popover = (
    <Popper placement={useDirectionToPopperPlacement(direction)}>
      {({ ref, placement, style, arrowProps }): React.ReactNode => (
        <span ref={popoverRef}>
          <span
            className={className}
            data-placement={placement}
            id={PREFIX}
            ref={ref}
            role="dialog"
            style={style as React.CSSProperties}
          >
            <span
              className={arrowClassName}
              ref={arrowProps.ref}
              style={arrowProps.style as React.CSSProperties}
            />
            {children}
          </span>
        </span>
      )}
    </Popper>
  );

  return (
    <Manager>
      {popoverTrigger}
      {open && createPortal(popover, document.body)}
    </Manager>
  );
};

export default Popover;
