import React from "react";

/** VisuallyHidden props */

export interface VisuallyHiddenProps {
  /** Content to be hidden visually */
  children: React.ReactNode;
}

/** VisuallyHidden hides elements on the interface but keeps them visible to screen readers. */

const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
  children
}: VisuallyHiddenProps) => (
  <span className="vds-visually-hidden">{children}</span>
);

export default VisuallyHidden;
