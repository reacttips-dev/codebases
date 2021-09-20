import React from "react";
import classNames from "classnames";

const PREFIX = "vds-progress-bar";

/** ProgressBar Props */

export interface ProgressBarProps {
  /** Hide label visually */
  hiddenLabel?: boolean;

  /** Text label to describe the process */
  label?: string;

  /** Alignment of the label */
  labelAlign?: "inline" | "left" | "center" | "right";

  /** A custom completion value. If present, the [maxValue](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) must have a value greater than `0` */
  maxValue?: number;

  /** Size of progress bar */
  size?: "sm" | "md" | "lg";

  /** A number between `0` and `100 | maxValue` that indicates the progress made */
  value?: number;

  /** Visual style of the progress bar */
  variant?:
    | "default"
    | "inverse"
    | "information"
    | "error"
    | "warning"
    | "success";
}

/** A progress bar is used to visually represent the completion of a task or operation. */

const ProgressBar: React.FC<ProgressBarProps> = ({
  hiddenLabel,
  labelAlign = "inline",
  label,
  size = "sm",
  maxValue = 100,
  value = 0,
  variant = "default"
}: ProgressBarProps) => {
  const className = classNames(
    PREFIX,
    labelAlign && `${PREFIX}--${labelAlign}`,
    size && `${PREFIX}--${size}`,
    variant && `${PREFIX}--${variant}`
  );

  const labelClassName = hiddenLabel
    ? `vds-visually-hidden`
    : `${PREFIX}__label`;

  const finalValue = maxValue ? Math.round((value / maxValue) * 100) : value;
  const defaultLabel = `${finalValue}%`;

  return (
    <div className={className} role="progressbar">
      <progress value={value} max={maxValue} />
      <span className={labelClassName}>{label || defaultLabel}</span>
    </div>
  );
};

export default ProgressBar;
