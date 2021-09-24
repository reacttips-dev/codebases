import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import ArrowImage from './arrow.svg';

export const ARROW_HEIGHT = 10;
export const ARROW_WIDTH = 20;
export const ARROW_TOP = 'top';
export const ARROW_BOTTOM = 'bottom';
export const ARROW_LEFT = 'left';
export const ARROW_RIGHT = 'right';
export const ARROW_CENTER_OFFSET = -(ARROW_WIDTH * 1.5);

function getArrowTransform(side) {
  switch (side) {
    case ARROW_TOP:
      return {transform: 'rotate(180deg)'};
    case ARROW_BOTTOM:
      return {transform: 'rotate(0)'};
    case ARROW_LEFT:
      return {transform: 'rotate(90deg)', transformOrigin: '0 0'};
    case ARROW_RIGHT:
      return {transform: 'rotate(270deg)', transformOrigin: '100% 0'};
  }
}

function getPosition(side, offset) {
  switch (side) {
    case ARROW_TOP:
      return {
        left: Math.max(0, offset) + ARROW_WIDTH,
        top: -ARROW_HEIGHT
      };
    case ARROW_BOTTOM:
      return {
        left: Math.max(0, offset) + ARROW_WIDTH,
        bottom: -ARROW_HEIGHT
      };
    case ARROW_LEFT:
      return {
        top: Math.max(0, offset) + ARROW_WIDTH,
        left: 0
      };
    case ARROW_RIGHT:
      return {
        top: Math.max(0, offset) + ARROW_WIDTH,
        right: 0
      };
  }
}

const Container = glamorous.div(
  {
    position: 'absolute',
    width: 20,
    height: 10
  },
  ({side, offset}) => getPosition(side, offset)
);

const Arrow = ({offset, side}) => {
  return (
    <Container offset={offset} side={side}>
      <ArrowImage
        style={{
          position: 'absolute',
          ...getArrowTransform(side)
        }}
      />
    </Container>
  );
};

Arrow.propTypes = {
  offset: PropTypes.number,
  side: PropTypes.oneOf([ARROW_TOP, ARROW_BOTTOM, ARROW_LEFT, ARROW_RIGHT])
};

Arrow.defaultProps = {
  offset: 0,
  side: ARROW_TOP
};

export default Arrow;
