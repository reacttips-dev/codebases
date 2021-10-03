import PropTypes from "prop-types";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { connect } from "react-redux";
import styled from "styled-components";
import { Rnd } from "react-rnd";

import { Duration } from "../../_components/common/statelessView";
import { lightGrey, primary } from "../../_components/styled/variable";

export const StyledResizeHandleComponent = styled.div`
  /* background: ${primary}; */
  height: 100%;
  width: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* border-radius: 4px !important; */
  position: absolute;
  /* bottom: 5px; */
  color: ${lightGrey};
  display: flex;
  align-items: center;
  /* ${(props) => (props.side === "right" ? "left: 2px" : "right: 2px")}; */
`;

export const StyledRnd = styled(Rnd)`
  display: flex !important;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0);
  position: relative !important;
  /* border: 3px solid ${primary}; */
  /* border-radius: 8px; */
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
`;

const TimelineGrabber = (props) => {
  const {
    parentId,
    position,
    size,
    leftTooltipText,
    rightTooltipText,
    minWidth,
    defaults,
    className,
    onDragStart,
    onDrag,
  } = props;

  return (
    <>
      <StyledRnd
        className={className}
        default={defaults}
        onDragStop={(e, d) => props.onDragStop(e, d)}
        onResizeStop={(e, direction, ref, delta, position) =>
          props.onResizeStop(e, direction, ref, delta, position)
        }
        minWidth={minWidth}
        maxWidth={"100%"}
        dragAxis="x"
        size={size}
        position={position}
        enableResizing={false}
        onDragStart={onDragStart}
        onDrag={onDrag}
        resizeHandleComponent={{
          right: (
            <OverlayTrigger
              placement="top"
              trigger={["hover", "focus"]}
              overlay={
                <Tooltip>
                  <Duration
                    type="video_duration"
                    seconds={rightTooltipText}
                  ></Duration>
                </Tooltip>
              }
            >
              <StyledResizeHandleComponent side="right">
                {/* <FontAwesomeIcon icon="grip-lines-vertical" /> */}
              </StyledResizeHandleComponent>
            </OverlayTrigger>
          ),
          left: (
            <OverlayTrigger
              placement="top"
              trigger={["hover", "focus"]}
              overlay={
                <Tooltip>
                  <Duration
                    type="video_duration"
                    seconds={leftTooltipText}
                  ></Duration>
                </Tooltip>
              }
            >
              <StyledResizeHandleComponent side="left">
                {/* <FontAwesomeIcon icon="grip-lines-vertical" /> */}
              </StyledResizeHandleComponent>
            </OverlayTrigger>
          ),
        }}
        bounds={parentId}
      >
        {props.children}
      </StyledRnd>
    </>
  );
};

TimelineGrabber.defaultProps = {
  minWidth: "10%",
};

TimelineGrabber.propTypes = {
  parentId: PropTypes.string.isRequired,
  position: PropTypes.object.isRequired,
  size: PropTypes.object.isRequired,
  minWidth: PropTypes.string,
  onDragStop: PropTypes.func,
  onResizeStop: PropTypes.func,
  onDragStart: PropTypes.func,
  onDrag: PropTypes.func,
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TimelineGrabber);
