import React, { useMemo } from "react";
import classNames from "classnames";

import LogoDefault from "./svgs/LogoDefault";
import LogoIconOnly from "./svgs/LogoIconOnly";
import LogoStacked from "./svgs/LogoStacked";

export const PREFIX = "vds-logo";

const SVG_SIZES = {
  default: {
    height: "30",
    width: "180"
  },
  stacked: {
    height: "97",
    width: "100"
  },
  icon: {
    height: "30",
    width: "30"
  }
};

/** Logo Props */
export interface LogoProps {
  /** When true, the logo and text will be white. For use on dark backgrounds. */
  inverted?: boolean;

  /** Logo variant */
  variant?: "default" | "stacked" | "icon";

  /** Height for the logo */
  height?: string;

  /** Width for the logo */
  width?: string;

  /** Callback when clicked */
  onClick?(evt?: React.MouseEvent): void;
}

/** Logo displays different variations of the Udacity logo in SVG form */

const Logo: React.FC<LogoProps> = ({
  inverted,
  variant = "default",
  height,
  width,
  onClick
}: LogoProps) => {
  type Size = { height?: string; width?: string };
  const containerClass = classNames(
    PREFIX,
    `${PREFIX}--${variant}`,
    inverted && `${PREFIX}--inverted`,
    onClick && `${PREFIX}--clickable`
  );
  const iconClass = classNames(`${PREFIX}__icon`);
  const titleClass = classNames(`${PREFIX}__title`);

  const svgSize = useMemo((): Size => {
    return SVG_SIZES[variant];
  }, [variant]);

  const containerStyle = useMemo((): Size => {
    const size: Size = {};
    if (height || width) {
      size.height = height;
      size.width = width;
    } else if (!height && !width) {
      size.height = `${svgSize.height}px`;
      size.width = `${svgSize.width}px`;
    }
    return size;
  }, [svgSize, height, width]);

  const svgStyle = useMemo((): Size => {
    const size: Size = {};
    if (containerStyle.height) {
      size.height = "100%";
    }
    if (containerStyle.width) {
      size.width = "100%";
    }
    return size;
  }, [containerStyle, height, width]);

  return (
    <div
      className={containerClass}
      style={containerStyle}
      onClick={onClick}
      role={onClick && "button"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
        style={svgStyle}
      >
        <title>Udacity Logo</title>

        <g fill="none">
          {variant === "default" && (
            <LogoDefault iconClass={iconClass} titleClass={titleClass} />
          )}

          {variant === "stacked" && (
            <LogoStacked iconClass={iconClass} titleClass={titleClass} />
          )}

          {variant === "icon" && <LogoIconOnly iconClass={iconClass} />}
        </g>
      </svg>
    </div>
  );
};

export default Logo;
