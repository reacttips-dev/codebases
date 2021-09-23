import React, { useEffect, useRef, useState } from 'react';
import clamp from 'lodash/clamp';

export function usePlayhead(initialPosition = 50) {
  const [position, setPosition] = useState(initialPosition);
  const [dragging, setDragging] = useState(false);
  const parentRef = useRef();
  const ref = useRef();

  useEffect(() => {
    if (dragging) {
      let id = null;

      const move = (pageX) => {
        window.cancelAnimationFrame(id);
        id = window.requestAnimationFrame(() => {
          const { width } = parentRef.current.getBoundingClientRect();
          const { x } = ref.current.getBoundingClientRect();
          setPosition((prevPosition) => clamp(prevPosition - (pageX - x), 0, width));
        });
      };

      const onMouseMove = (e) => move(e.pageX);
      const onTouchMove = (e) => move(e.touches[0].pageX);

      const onMouseUp = () => {
        setDragging(false);
      };
      const onTouchEnd = onMouseUp;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('touchmove', onTouchMove);

      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchend', onTouchEnd);

      return () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('touchmove', onTouchMove);

        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('touchend', onTouchEnd);
      };
    }
    return undefined;
  }, [dragging]);

  return {
    dragging,
    parentRef,
    position,
    setPosition,
    playheadProps: {
      ref,
      position,
      startDragging: () => {
        setDragging(true);
      },
    },
  };
}

export default React.forwardRef(function Playhead({ position, startDragging }, ref) {
  return (
    /* Existing a11y issue ported to React */
    /* eslint-disable-next-line jsx-a11y/no-static-element-interactions */
    <div ref={ref} className="playhead" onMouseDown={startDragging} onTouchStart={startDragging} style={{ right: `${position}px` }}>
      <div className="playhead-arrow icon" />
      <div className="tail" />
    </div>
  );
});
