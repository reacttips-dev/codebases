import glamorous from 'glamorous';
import * as glamor from 'glamor';

export const magic = glamor.css.keyframes({
  '0%': {backgroundPosition: `0 0`},
  '100%': {backgroundPosition: `100em 0`}
});

export const Loader = glamorous.div(
  {
    borderRadius: 2,
    backgroundSize: '200% 100%'
  },
  ({w = 'auto', h = 'auto', animate}) => ({
    width: w,
    height: h,
    animation: animate ? `20s ${magic} 0s linear infinite` : 'none',
    background: animate
      ? `linear-gradient(to right, #f1f1f1 0%, #fbfbfb 50%, #f1f1f1 100%)`
      : `#f9f9f9`
  })
);
