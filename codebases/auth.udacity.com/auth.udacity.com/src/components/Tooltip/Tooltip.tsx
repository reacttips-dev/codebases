import React, { useState, useMemo } from "react";
import classNames from "classnames";
import {
  Manager,
  Reference,
  Popper,
  PopperChildrenProps,
  ReferenceChildrenProps
} from "react-popper";
import { useDirectionToPopperPlacement } from "../../utils";
import { useCallback } from "react";

const generateId = (): string => {
  const chars = 'acdefhiklmnoqrstuvwxyz0123456789'.split('');
  let result = '';
  for(let i=0; i < 6; i++){
    const x = Math.floor(Math.random() * chars.length);
    result += chars[x];
  }
  return result;
}

export const PREFIX = "vds-tooltip";
const TOOLTIP_ID = `${PREFIX}_${generateId()}`;

/** Tooltip Props */

export interface TooltipProps {
  /**
   * Text to display inside the tooltip.
   * If you use HTML instead of a string, please ensure it includes proper a11y
   * labels/props.
   */
  content: string | React.ReactNode;

  /** The trigger element */
  trigger: JSX.Element;

  /**
   * Preferred display direction. Tooltip will recompute its placement
   * dynamically based on available browser space to prevent clipped text
   */
  direction?: "start" | "end" | "bottom" | "top";

  /** Toggle light theme for dark backgrounds */
  inverse?: boolean;

  /** Control prop to always show Tooltip */
  open?: boolean;
}

/**
 * Tooltip is a floating, non-actionable label used to explain a user interface
 * element or feature.
 */

const Tooltip: React.FC<TooltipProps> = ({
  content,
  trigger,
  direction = "bottom",
  inverse = false,
  open: controlledOpen = false
}: TooltipProps) => {
  // Setup open state
  const [uncontrolledOpen, setOpen] = useState(false);
  const open = controlledOpen || uncontrolledOpen;

  // Setup event listeners
  const handleOpen = useCallback((): void => setOpen(true), [setOpen]);
  const handleClose = useCallback((): void => setOpen(false), [setOpen]);
  const eventProps = useMemo(
    () => ({
      onBlur: handleClose,
      onFocus: handleOpen,
      onMouseEnter: handleOpen,
      onMouseLeave: handleClose
    }),
    [handleClose, handleOpen]
  );

  // Setup classnames
  const className = classNames(PREFIX, inverse && `${PREFIX}--inverse`);
  const arrowClassName = classNames("vds-tail", inverse && "vds-tail--inverse");

  return (
    <Manager>
      {/** Tooltip Trigger */}
      <Reference>
        {({ ref }: ReferenceChildrenProps): React.ReactNode => (
          <span aria-describedby={TOOLTIP_ID} ref={ref} {...eventProps}>
            {trigger}
          </span>
        )}
      </Reference>

      {/**
        * Tooltip
        * Visually hide (rather than remove from DOM) when not open
        * for accessibility purposes
        */}
      <div
        data-testid={`${PREFIX}__wrapper`}
        className={`${PREFIX}__wrapper`}
        data-open={open}
      >
        <Popper placement={useDirectionToPopperPlacement(direction)}>
          {({
            ref,
            placement,
            style,
            arrowProps
          }: PopperChildrenProps): React.ReactNode => (
            <span
              className={className}
              data-placement={placement}
              id={TOOLTIP_ID}
              ref={ref}
              role="tooltip"
              style={style as React.CSSProperties}
              {...eventProps}
            >
              <span
                className={arrowClassName}
                ref={arrowProps.ref}
                style={arrowProps.style as React.CSSProperties}
              />
              {content}
            </span>
          )}
        </Popper>
      </div>
    </Manager>
  );
};

export default Tooltip;
