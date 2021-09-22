/* -------------------------------------
 * This component implements a radial progress display with variable coloration and dimensions.
 * Styles based on https://codepen.io/geedmo/pen/InFfd
 * ------------------------------------- */

import React from 'react';

import { color } from '@coursera/coursera-ui';
import classNames from 'classnames';
import 'css!./__styles__/ProgressCircle';

type Props = {
  percentComplete: number;
  diameter?: number;
  arcWidth?: number;
  arcColor?: string; // The color of the progress arc
  innerColor?: string; // The color of the area encircled by the arc
  backgroundColor?: string; // The color of the incomplete portions of the arc
  emptyColor?: string; // The color of the arc when 0% complete
  className?: string;
  children?: JSX.Element;
};

class ProgressCircle extends React.Component<Props> {
  static defaultProps = {
    diameter: 20,
    arcWidth: 4,
    arcColor: color.success,
    innerColor: color.white,
    backgroundColor: color.white,
    emptyColor: color.secondaryText,
  };

  getOuterCircleStyles() {
    const { percentComplete, diameter, arcColor, emptyColor, backgroundColor } = this.props;

    const increment = 360 / 100;

    let backgroundImage: string | undefined;

    const backgroundColorDisplay = percentComplete === 0 ? emptyColor : backgroundColor;

    if (percentComplete < 50) {
      const degrees = 90 + increment * percentComplete;
      backgroundImage = `linear-gradient(90deg, ${backgroundColorDisplay} 50%, transparent 50%, transparent),
        linear-gradient(${degrees}deg, ${arcColor} 50%, ${backgroundColorDisplay} 50%, ${backgroundColorDisplay})`;
    } else {
      const degrees = -90 + increment * (percentComplete - 50);
      backgroundImage = `linear-gradient(${degrees}deg, ${arcColor} 50%, transparent 50%, transparent),
          linear-gradient(270deg, ${arcColor} 50%, ${backgroundColorDisplay} 50%, ${backgroundColorDisplay})`;
    }

    return {
      width: diameter,
      height: diameter,
      backgroundColor: arcColor,
      backgroundImage,
    };
  }

  getInnerCircleStyles() {
    const { diameter = 0, arcWidth = 0, innerColor } = this.props;
    const innerCircleDiameter = diameter - arcWidth;

    return {
      width: innerCircleDiameter,
      height: innerCircleDiameter,
      backgroundColor: innerColor,
    };
  }

  render() {
    const { className, children } = this.props;
    const classes = classNames('rc-ProgressCircle', 'outer-circle', className);

    return (
      <div className={classes} style={this.getOuterCircleStyles()}>
        <div className="inner-circle" style={this.getInnerCircleStyles()}>
          {children && React.cloneElement(children, {})}
        </div>
      </div>
    );
  }
}

export default ProgressCircle;
