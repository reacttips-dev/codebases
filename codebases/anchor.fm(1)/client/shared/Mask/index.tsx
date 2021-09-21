import { css } from 'emotion';
import React from 'react';

type Shape = 'square' | 'rounded' | 'circle' | 'circle';
interface MaskProps {
  children: React.ReactNode;
  shape: Shape;
  borderRadius: number;
  isFullHeight: boolean;
  isFullWidth: boolean;
  width: string | number;
  height: string | number;
  boxShadow?: string;
}

const noop = () => null;

// TODO:
//   This should be the same as the radius
//   of box. Use a constant and import into
//   both components
const cornerRaidus = 10;

const getBorderRadiusStyleForSquareShape = () => ({
  borderRadius: 0,
});

const getBorderRadiusStyleForRoundedShape = () => ({
  borderRadius: cornerRaidus,
});

const getBorderRadiusStyleForCircleShape = () => ({
  borderRadius: '50%',
});

const getBorderRadiusStylesForShape = (shape: Shape) => {
  switch (shape) {
    case 'square':
      return getBorderRadiusStyleForSquareShape();
    case 'rounded':
      return getBorderRadiusStyleForRoundedShape();
    case 'circle':
      return getBorderRadiusStyleForCircleShape();
    default:
      const exhaustiveCheck: never = shape;
      return exhaustiveCheck;
  }
};

/**
 * @deprecated Use plain CSS instead
 */
const Mask = ({
  children,
  isFullWidth,
  shape,
  isFullHeight,
  borderRadius,
  width,
  height,
  boxShadow,
}: MaskProps) => (
  <div
    className={css({
      overflow: 'hidden',
      ...(isFullWidth ? { width: '100%' } : width ? { width } : {}),
      ...(isFullHeight ? { height: '100%' } : height ? { height } : {}),
      ...(borderRadius
        ? { borderRadius }
        : getBorderRadiusStylesForShape(shape)),
      ...(boxShadow ? { boxShadow } : {}),
    })}
  >
    {children}
  </div>
);

Mask.defaultProps = {
  shape: 'square',
  borderRadius: null,
  isFullHeight: false,
  isFullWidth: false,
  width: null,
  height: null,
};

export { Mask as default, Mask };
