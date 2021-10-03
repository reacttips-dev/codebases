import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { connect } from "react-redux";
import {
  StyledRnd,
  StyledVideoHorizontalResizeHandleComponent,
} from "../styled/styles";
import { Duration } from "./statelessView";

class TldrGrabber extends Component {
  render() {
    const {
      parentId,
      position,
      size,
      leftTooltipText,
      rightTooltipText,
      minWidth,
      defaults,
      className,
      maxWidth,
      rndProps,
    } = this.props;

    return (
      <>
        <StyledRnd
          className={className}
          default={defaults}
          onDragStop={(e, d) => this.props.onDragStop(e, d)}
          onResizeStop={(e, direction, ref, delta, position) =>
            this.props.onResizeStop(e, direction, ref, delta, position)
          }
          minWidth={minWidth}
          maxWidth={maxWidth}
          dragAxis="x"
          size={size}
          position={position}
          enableResizing={{
            top: false,
            bottom: false,
            left: true,
            right: true,
          }}
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
                <StyledVideoHorizontalResizeHandleComponent side="right">
                  <FontAwesomeIcon icon="grip-lines-vertical" />
                </StyledVideoHorizontalResizeHandleComponent>
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
                <StyledVideoHorizontalResizeHandleComponent side="left">
                  <FontAwesomeIcon icon="grip-lines-vertical" />
                </StyledVideoHorizontalResizeHandleComponent>
              </OverlayTrigger>
            ),
          }}
          bounds={parentId}
          {...rndProps}
        ></StyledRnd>
      </>
    );
  }
}

TldrGrabber.defaultProps = {
  minWidth: "10%",
  maxWidth: "100%",
  rndProps: {},
};

TldrGrabber.propTypes = {
  parentId: PropTypes.string.isRequired,
  position: PropTypes.object.isRequired,
  size: PropTypes.object.isRequired,
  minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rndProps: PropTypes.object,
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TldrGrabber);
