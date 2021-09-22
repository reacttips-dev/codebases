import * as React from 'react';

import ProgressTrackerPopover from './ProgressTrackerPopover';

import { DEFAULT_MAX_SCORE, DEFAULT_BAR_HEIGHT } from './constants';
import generateHexagon from './utils/generateHexagon';
import clampValues from './utils/clampValues';

export type ProgressBarSvgProps = {
  /** width of component to render. (Default = 100) */
  width?: number;

  /** an optional benchmark target. */
  target?: number;

  /** the learner's current score. */
  score?: number;

  /** the maximum possible score (default = 500) */
  maxScore?: number;

  /**
   * an array of numbers indicating where segment lines should be drawn.
   *
   * Note: there was not much information in the design as to the intended use,
   * so the assumption was made that these would be the points that divide
   * ranges within a program.
   */
  segments?: number[];

  /**
   * a tooltip for the target element.
   */
  targetTooltip?: React.ReactNode;

  /**
   * the height of the bar in pixels. was designed for 12.
   */
  barHeight?: number;
};

const palette = {
  border: '#bdbdbd',
  fill: '#ffc300',
  empty: '#ffffff',
};

const ProgressBarSvg: React.FC<ProgressBarSvgProps> = (props) => {
  const {
    targetTooltip,
    width = 100,
    target = 0,
    maxScore = DEFAULT_MAX_SCORE,
    score = 0,
    segments,
    barHeight = DEFAULT_BAR_HEIGHT,
  } = props;

  const outerBarHeight = barHeight + 2 * 2;
  const capRadius = outerBarHeight / 2;
  const outlineThickness = 2;

  const height = outerBarHeight * 2;
  const hexHeight = barHeight * 1.25;

  //
  // hexagon paths used to generate a sane scaled version of the chevron that indicates the target
  //
  const hexDefs = {
    outer: generateHexagon(hexHeight),
    padding: generateHexagon(hexHeight - outlineThickness),
    inner: generateHexagon(hexHeight - outlineThickness - 2),
  };

  //
  // should the target be rendered
  //
  const showTarget = props.target !== undefined;

  //
  // clamp percentages to multiples of 2. ensures that equality tests have
  // a certain level of sanity.
  //
  const segmentPercents = segments?.map((segment) => clampValues(segment, maxScore, 2));

  const fillPercent = clampValues(score, maxScore, 2);
  const targetPercent = clampValues(target, maxScore, 2);

  const targetFilled = score >= target;
  let hexSolidLeft = target === 0;
  let hexSolidRight = target === score || targetPercent >= 1.0;

  //
  // The target should be rendered centered on the targetPercentage.
  // In order to avoid off-by-one issues, we use the same width as for
  // the score. However, if the target would sit either below or above
  // a point were it would be rendered off the bar, adjust to a min/max
  // value that will place it at the start or end accordingly.
  //
  // Target hex is drawn centered at this offset.
  //
  let targetCenter = width * targetPercent;

  const halfHex = hexDefs.outer.width / 2;

  // constrain the target such that it will stick to the ends without being
  // drawn too far left or right.
  if (targetCenter < halfHex) {
    targetCenter = Math.round(halfHex);
    hexSolidLeft = true;
  } else if (targetCenter > width - halfHex) {
    targetCenter = Math.round(width - halfHex);
    hexSolidRight = true;
  }

  //
  // star needs to be scaled according to the height of the bar.
  // it was designed to be 12px so we scale using that as a base.
  //
  const starScale = barHeight / 12;

  let targetElement;
  //
  // the component "changed" to include a hover interaction on the target
  // element. This has been implemented by pulling the target out of the body of
  // the svg and then conditionally wrapping it in an overlay trigger. This
  // allows the consumer to decide if they want an overlay and what the content
  // of that overlay should be. Due to the number of variables used, it's not
  // entirely simple to just pull this out into it's own component. However,
  // that might be something worth doing in the future.
  //
  if (showTarget) {
    targetElement = (
      <g className="rc-ProgressTrackerSvg-Target" transform={`translate(${targetCenter}, 0)`}>
        <path fill={palette.border} d={hexDefs.outer.path} />
        <path fill={palette.empty} d={hexDefs.padding.path} />

        {/* bar mask left */}
        {!hexSolidLeft && (
          <g transform={`translate(-${Math.round((hexDefs.outer.width + 2) / 2)}, -${Math.round(barHeight / 2)})`}>
            <path
              fill={palette.empty}
              d={`
                  M 0 0
                  l ${outlineThickness + 4} 0
                  l 0 ${barHeight}
                  l -${outlineThickness + 4} 0
                  Z
                `}
            />

            {/* offset one pixel to the left to overlap the white part properly */}
            {targetFilled && (
              <path
                fill={palette.fill}
                d={`
                  M -1 1
                  l ${outlineThickness + 5} 0
                  l 0 ${barHeight - 2}
                  l -${outlineThickness + 5} 0
                  Z `}
              />
            )}
          </g>
        )}

        {/* right mask */}
        {!hexSolidRight && (
          <g transform={`translate(${Math.round((hexDefs.outer.width - 1) / 2)}, -${Math.round(barHeight / 2)})`}>
            {/* only needs to be wide enough to cover the grey border on the hex */}
            <path
              fill={palette.empty}
              d={`
                  M -2 0
                  l ${outlineThickness + 4} 0
                  l 0 ${barHeight}
                  l -${outlineThickness + 4} 0
                  Z
                `}
            />

            {/* pulled to the right to line up with the right of the target fill. Extends wider than white space above */}
            {targetFilled && (
              <path
                fill={palette.fill}
                d={`
                    M -4 1
                    l ${outlineThickness + 8} 0
                    l 0 ${barHeight - 2}
                    l -${outlineThickness + 8} 0
                    Z
                  `}
              />
            )}
          </g>
        )}

        {targetFilled && <path fill={palette.fill} d={hexDefs.inner.path} />}

        {/* the star */}
        <path
          transform={`
              translate(${Math.round(-19.5 * starScale)}, ${Math.round(-14 * starScale)})
              scale(${starScale} , ${starScale})
            `}
          fill={targetFilled ? palette.empty : palette.fill}
          d="M19.5 17.5l-4.114 2.163.785-4.581-3.328-3.245 4.6-.669L19.5 7l2.057 4.168 4.6.669-3.328 3.245.785 4.581z"
        />
      </g>
    );

    //
    // wrap the target element in an overlay trigger because #yolo.
    // I am not a huge fan of this approach...
    //
    if (targetTooltip) {
      targetElement = <ProgressTrackerPopover popoverContent={targetTooltip}>{targetElement}</ProgressTrackerPopover>;
    }
  }

  //
  // fuzzes the target value to try to keep it out of the way of segment indicators.
  //
  return (
    <svg width={width} height={height} viewBox={`0 -${height / 2} ${width} ${height}`} role="presentation">
      <g transform={`translate(0, -${Math.ceil(barHeight / 2 + outlineThickness)})`}>
        {/* the border of the bar drawn as a solid bar with round caps */}
        <path
          fill={palette.border}
          d={`
            M ${capRadius} 0
            L ${width - capRadius} 0
            A ${capRadius} ${capRadius} 0 1 1 ${width - capRadius} ${outerBarHeight}
            L ${capRadius} ${outerBarHeight}
            A ${capRadius} ${capRadius} 0 1 1 ${capRadius} 0
            Z
          `}
        />

        {/* fills the solid bar with the empty color (white by default) */}
        <path
          fill={palette.empty}
          d={`
            M ${capRadius} ${outlineThickness}
            L ${width - capRadius} ${outlineThickness}
            A ${capRadius - outlineThickness} ${capRadius - outlineThickness}
              0 1 1
              ${width - capRadius} ${outerBarHeight - outlineThickness}
            L ${capRadius} ${outerBarHeight - outlineThickness}
            A ${capRadius - outlineThickness} ${capRadius - outlineThickness} 0 1 1 ${capRadius} ${outlineThickness}
            Z
          `}
        />

        {/*
         * if there is a nonzero score, fill a line with the fill colour.
         */}
        {score > 0 && (
          <path
            fill={palette.fill}
            d={`
              M ${capRadius} ${outlineThickness * 1.5}
              L ${width * fillPercent - capRadius} ${outlineThickness * 1.5}
              ${
                fillPercent < 1
                  ? `
                    L ${width * fillPercent} ${outlineThickness * 1.5}
                    L ${width * fillPercent} ${outerBarHeight - outlineThickness * 1.5}
                    `
                  : `A ${capRadius - outlineThickness * 1.5} ${capRadius - outlineThickness * 1.5} 0 1 1 ${
                      width * fillPercent - capRadius
                    } ${outerBarHeight - outlineThickness * 1.5}`
              }

              L ${capRadius} ${outerBarHeight - outlineThickness * 1.5}
              A ${capRadius - outlineThickness * 1.5} ${capRadius - outlineThickness * 1.5} 0 1 1 ${capRadius} ${
              outlineThickness * 1.5
            }
              Z
            `}
          />
        )}
      </g>

      {segmentPercents && (
        <g className="rc-ProgressTrackerSvg-Segments" transform={`translate(0, -${Math.round(outerBarHeight / 2)})`}>
          {segmentPercents.map((segment) => (
            <g key={`segment-${segment}`} transform={`translate(${Math.round(segment * width - capRadius)}, 0)`}>
              <line x1="0" y1="0" x2="0" y2={outerBarHeight} stroke={palette.border} strokeWidth="2" />
              <line x1="2" y1="0" x2="2" y2={outerBarHeight} stroke={palette.empty} strokeWidth="2" />
              <line x1="4" y1="0" x2="4" y2={outerBarHeight} stroke={palette.border} strokeWidth="2" />
            </g>
          ))}
        </g>
      )}

      {/*
       * the star icon that indicates the target score
       */}
      {targetElement}
    </svg>
  );
};

export default ProgressBarSvg;
