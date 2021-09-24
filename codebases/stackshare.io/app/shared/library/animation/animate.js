import {easeInOutQuad} from './timing';

export const translateX = (style, val) => (style.transform = `translateX(${val}px)`);
export const translateXvw = (style, val) => (style.transform = `translateX(${val}vw)`);
export const translateY = (style, val) => (style.transform = `translateY(${val}px)`);
export const blur = (style, val) => (style.filter = `blur(${val}px)`);
export const opacity = (style, val) => (style.opacity = val);
export const scaleXY = (style, val) => (style.transform = `scale(${val},${val})`);
export const scaleY = (style, val) => (style.transform = `scale(1,${val})`);

const animate = (tweens, duration = 300, setStyle, callback) => {
  let startTime = null;
  let cancelled = false;

  const go = ts => {
    if (cancelled) {
      return;
    }
    if (!startTime) {
      startTime = ts;
    }
    tweens.forEach(({element, from, to, timing = easeInOutQuad}) => {
      if (element) {
        let val = (to - from) * timing((ts - startTime) / duration) + from;
        if (ts - startTime >= duration) {
          // this is important so we arrive at the final value of the tween
          val = to;
        }
        setStyle(element.style, val);
      }
    });

    if (ts - startTime <= duration) {
      requestAnimationFrame(go);
    } else {
      callback && requestAnimationFrame(callback);
    }
  };
  requestAnimationFrame(go);
  return () => (cancelled = true);
};

export default animate;
