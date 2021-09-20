import React from "react";
import VisuallyHidden from "../VisuallyHidden/VisuallyHidden";
import { logging } from "../../utils";

export const PREFIX = "vds-badge";
const COMPONENT_NAME = "Badge";
const MAX_LABEL_LENGTH = 3;

/* Badge Props */
export interface BadgeProps {
  /** The node on which to put a badge */
  children: React.ReactNode;

  /** The main badge label. Should be 3 characters or less. */
  displayLabel: string | number;

  /** A visually hidden label to provide more info for screen readers. Should include the original
   * display label, along with a short additional description.
   */
  a11yLabel: string;
}

/**
 * Badges are used to indicate hidden information.
 *
 * Badges are currently only meant for use through a component rather than on their own.
 */
const Badge: React.FC<BadgeProps> = ({
  children,
  displayLabel,
  a11yLabel
}: BadgeProps) => {
  if (displayLabel.toString().length > MAX_LABEL_LENGTH) {
    logging.warning(
      COMPONENT_NAME,
      `"displayLabel" should be ${MAX_LABEL_LENGTH} or less characters`
    );
  }
  return (
    <div className={PREFIX}>
      {children}

      <span className={`${PREFIX}__circle`} role="status" aria-live="polite">
        <span aria-hidden>{displayLabel}</span>
        <VisuallyHidden>{a11yLabel}</VisuallyHidden>
      </span>
    </div>
  );
};

export default Badge;
