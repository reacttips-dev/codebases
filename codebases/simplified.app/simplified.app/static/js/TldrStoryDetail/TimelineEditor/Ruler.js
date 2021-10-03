import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { StyledRuler } from "./styled";
import { DURATION_PIXEL_RATIO } from "../../_components/styled/variable";

const NUMBER_OF_SMALL_MARKS = 2;

function Ruler({ id, duration, children, scale, onSeek }) {
  const rulerRef = useRef(null);

  const [durationToRender, setDurationToRender] = useState(0);

  const integerPart = Math.floor(durationToRender);

  const updateRulerData = () => {
    if (rulerRef.current) {
      const currentWidth = rulerRef.current.offsetWidth;
      const currentDivDuration = (currentWidth / DURATION_PIXEL_RATIO) * scale;
      setDurationToRender(currentDivDuration - 0.3);
    }
  };

  useEffect(() => {
    const rulerEl = rulerRef.current;
    updateRulerData();
  }, []);

  useEffect(() => {
    updateRulerData();
    return () => {};
  }, [scale, duration]);

  return (
    <StyledRuler id={id} ref={rulerRef}>
      <div
        style={{
          position: "relative",
          width: 0,
          display: "flex",
        }}
      >
        <span className="big-mark">0s</span>
      </div>
      {integerPart &&
        [...Array(integerPart).keys()].map((_, idx) => {
          return (
            <div
              key={idx}
              onClick={() => {
                onSeek(idx + 1);
              }}
              style={{
                position: "relative",
                width: DURATION_PIXEL_RATIO * scale,
                display: "flex",
                cursor: idx + 1 < duration ? "pointer" : "not-allowed",
              }}
            >
              <span className="big-mark">{idx + 1}s</span>
              {[...Array(NUMBER_OF_SMALL_MARKS).keys()].map((_, cIdx) => (
                <div key={cIdx} className="small-mark"></div>
              ))}
            </div>
          );
        })}
    </StyledRuler>
  );
}

Ruler.defaultProps = {
  padding: 0,
  scale: 1,
};

Ruler.propTypes = {
  duration: PropTypes.number,
  padding: PropTypes.number,
  scale: PropTypes.number,
  onSeek: PropTypes.func.isRequired,
};

export default Ruler;
