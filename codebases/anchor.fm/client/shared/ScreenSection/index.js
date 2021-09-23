import React from 'react';
import Box from '../Box';

// TODO: Instead of specifying how many pizels the slope is, we should add an option to calculate
//       based on screen size:
//       Example:
//
//         calc(100% - 6vw)
//
//         For the bottom downward slope, it would be
//         polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 6vw))
//       Reference:
//         https://kilianvalkhof.com/2017/design/sloped-edges-with-consistent-angle-in-css/

const ScreenSection = ({
  color,
  children,
  bottomBorderSlope = 0,
  topSlopeDirection = 'up',
  bottomSlopDirection = 'up',
  topBorderSlope = 0,
}) => (
  <Box>
    <Box
      testId="ScreenSection_top-slope-container"
      color={color}
      dangerouslySetInlineStyle={{
        // clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - ${bottomBorderSlope}px)`,
        clipPath:
          topSlopeDirection === 'up'
            ? `polygon(0px 100%, 100% 100%, 100% 0%, 0% 100%)`
            : topSlopeDirection === 'down'
              ? `polygon(0 100%, 100% 100%, 100% ${topBorderSlope}px, 0% 0%`
              : 'none',
        // clipPath: `polygon(0 100%, 100% 100%, 100% - calc(100% - ${topBorderSlope}px), 0 calc(100% - ${bottomBorderSlope}px)`,
        // marginBottom: -bottomBorderSlope,
        marginTop: -topBorderSlope,
        height: `${topBorderSlope}px`,
      }}
    />
    <Box color={color}>{children}</Box>
    <Box
      testId="ScreenSection_bottom-slope-container"
      color={color}
      dangerouslySetInlineStyle={{
        clipPath:
          bottomSlopDirection === 'up'
            ? `polygon(0 0, 100% 0, 0% 100%, 0 calc(100% - ${bottomBorderSlope}px)`
            : bottomSlopDirection === 'down'
              ? `polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - ${bottomBorderSlope}px)`
              : 'none',
        marginTop: -1, // This prevents a visible space between the child element and sloped section on ipad
        marginBottom: -bottomBorderSlope,
        height: `${bottomBorderSlope}px`,
      }}
    />
  </Box>
);

export default ScreenSection;
