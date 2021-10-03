import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const StyledTrimArea = styled.div`
  height: 100%;
  width: 100%;
  position: relative;

  .duration-display {
    position: absolute;
    bottom: 0;
    transform: translate(-50%, 100%);
    left: 50%;
    font-size: 12px;
  }
`;

const StyledDragDurationTooltip = styled.div`
  z-index: 10000 !important;
  position: fixed;
  top: -10px;
  transform: translate(-50%, -100%);
  left: 0;
  background-color: rgba(0, 0, 0, 0.9);
  padding: 5px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 400;

  :before {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    border-top: 5px solid black;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
  }
`;

function TrimArea({ start, end, isDragging, seekDuration }) {
  const duration = Number((end - start).toFixed(2));

  return (
    <OverlayTrigger
      placement="top"
      show={isDragging ? false : undefined}
      overlay={<Tooltip>Clip duration:{duration}s</Tooltip>}
    >
      <StyledTrimArea>
        {isDragging && (
          <StyledDragDurationTooltip>
            <span>
              {dayjs.duration(seekDuration, "seconds").format("mm:ss")}
            </span>
          </StyledDragDurationTooltip>
        )}
      </StyledTrimArea>
    </OverlayTrigger>
  );
}

TrimArea.propTypes = {
  start: PropTypes.number,
  end: PropTypes.number,
  seekDuration: PropTypes.number,
  isDragging: PropTypes.bool,
};

export default TrimArea;
