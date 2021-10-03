import React, { Component, createRef } from "react";
import { OverlayTrigger, Tooltip, Overlay } from "react-bootstrap";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faExpand,
  faSearchMinus,
  faSearchPlus,
} from "@fortawesome/free-solid-svg-icons";
import { StyledZoomActionButton } from "../_components/styled/styles";
import {
  StyledFooterButtonGroup,
  StyledVerticalSeparater,
  StyledTooltipWithKBDShortcut,
} from "../_components/styled/details/styleArtBoardEditor";
import {
  grey,
  greyDark,
  lightInactive,
  primary,
} from "../_components/styled/variable";

const ZoomMenu = styled.div`
  background-color: ${greyDark};
  border-radius: 8px;
  margin-bottom: 8px;
  width: 100px;
  padding: 12px;
  font-size: 14px;
`;

const ZoomMenuItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  cursor: pointer;
  color: ${(props) => (props.selected ? lightInactive : grey)};
  font-weight: ${(props) => (props.selected ? 500 : 400)};

  .label {
    transition: all 0.2s;
  }

  .check {
    color: ${primary};
    display: ${(props) => (props.selected ? "unset" : "none")};
  }

  :hover {
    color: ${lightInactive} !important;
    font-weight: 500;
  }
`;

class ArtBoardsRightFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoomOptionsOpen: false,
      interactionMode: "selection",
    };
    this.zoomDropDownRef = createRef(null);
  }

  zoomDropdownOptions = [
    {
      label: "300%",
      value: 300,
    },
    {
      label: "200%",
      value: 200,
    },
    {
      label: "100%",
      value: 100,
    },
    {
      label: "75%",
      value: 75,
    },
    {
      label: "65%",
      value: 65,
    },
    {
      label: "50%",
      value: 50,
    },
    {
      label: "25%",
      value: 25,
    },
    {
      label: "10%",
      value: 10,
    },
    {
      label: "Fit",
      value: "fit",
    },
  ];

  handlers = {
    selectionMode: () => {
      if (this.props.canvasRef.handler.interactionHandler.isDrawingMode()) {
        return;
      }
      this.forceUpdate();
      this.props.canvasRef.handler.interactionHandler.selection();
      this.setState({ interactionMode: "selection" });
    },
    grabMode: () => {
      if (this.props.canvasRef.handler.interactionHandler.isDrawingMode()) {
        return;
      }
      this.forceUpdate();
      this.props.canvasRef.handler.interactionHandler.grab();
      this.setState({ interactionMode: "grab" });
    },
  };

  onClickZoomOption = (zoomVal) => {
    const { canvasRef } = this.props;
    if (zoomVal === "fit") {
      canvasRef.handler.zoomHandler.zoomOneToOne();
    } else {
      canvasRef.handler.zoomHandler.zoomToPercentage(zoomVal);
    }
    this.setState({
      zoomOptionsOpen: false,
    });
  };

  render() {
    const { zoomOptionsOpen, interactionMode } = this.state;
    const { canvasRef, zoomRatio } = this.props;
    const { selectionMode, grabMode } = this.handlers;
    if (!canvasRef) {
      return null;
    }
    const zoomValue = parseInt((zoomRatio * 100).toFixed(2), 10);
    return (
      <div className="my-auto" style={{ flex: "1 1" }}>
        <div className="tldr-editor-rfooter-toolbar" data-click>
          <OverlayTrigger
            key={"selection"}
            placement="top"
            overlay={
              <Tooltip id={`tooltip-selection-mode`}>
                {"Selection Mode"}
              </Tooltip>
            }
          >
            <StyledZoomActionButton
              height={"32px"}
              width={"32px"}
              padding={"0px"}
              justifycontent={"center"}
              type={(interactionMode === "selection").toString()}
              onClick={() => {
                selectionMode();
              }}
            >
              <FontAwesomeIcon icon="mouse-pointer" />
            </StyledZoomActionButton>
          </OverlayTrigger>
          <OverlayTrigger
            key={"grab-mode"}
            placement="top"
            overlay={
              <Tooltip id={`tooltip-grab-mode`}>
                <StyledTooltipWithKBDShortcut>
                  Grab the artboard
                  <div className="hotkeys">
                    <kbd>Space</kbd> & <kbd>Drag</kbd>
                  </div>
                </StyledTooltipWithKBDShortcut>
              </Tooltip>
            }
          >
            <StyledZoomActionButton
              height={"32px"}
              width={"32px"}
              padding={"0px"}
              justifycontent={"center"}
              type={(interactionMode === "grab").toString()}
              onClick={() => {
                grabMode();
              }}
            >
              <FontAwesomeIcon icon="hand-rock" />
            </StyledZoomActionButton>
          </OverlayTrigger>
          <StyledVerticalSeparater />
          <StyledFooterButtonGroup>
            <OverlayTrigger
              key={"zoom-out"}
              placement="top"
              overlay={
                <Tooltip id={`tooltip-zoom-out`}>
                  <StyledTooltipWithKBDShortcut>
                    Zoom out
                    <div className="hotkeys">
                      <kbd>-</kbd>
                    </div>
                  </StyledTooltipWithKBDShortcut>
                </Tooltip>
              }
            >
              <StyledZoomActionButton
                height={"32px"}
                width={"32px"}
                padding={"0px"}
                justifycontent={"center"}
                onClick={() => {
                  canvasRef.handler.zoomHandler.zoomOut();
                }}
              >
                <FontAwesomeIcon icon={faSearchMinus} />
              </StyledZoomActionButton>
            </OverlayTrigger>
            <OverlayTrigger
              key={"zoom-percentage"}
              placement="top"
              overlay={
                <Tooltip id={`tooltip-zoom-in`}>Zoom percentage</Tooltip>
              }
            >
              <StyledZoomActionButton
                ref={this.zoomDropDownRef}
                onClick={() => {
                  this.setState({
                    zoomOptionsOpen: true,
                  });
                  // canvasRef.handler.zoomHandler.zoomOneToOne();
                }}
                justifycontent={"center"}
                style={{ minWidth: "68px" }}
              >
                {`${zoomValue}%`}
              </StyledZoomActionButton>
            </OverlayTrigger>

            <Overlay
              target={this.zoomDropDownRef}
              show={zoomOptionsOpen}
              placement="top"
              onHide={() => {
                this.setState({
                  zoomOptionsOpen: false,
                });
              }}
              rootClose
            >
              {({ placement, arrowProps, show: _show, popper, ...props }) => (
                <ZoomMenu
                  {...props}
                  style={{
                    ...props.style,
                  }}
                >
                  {this.zoomDropdownOptions.map((zoomItem) => {
                    return (
                      <ZoomMenuItem
                        key={zoomItem.value}
                        selected={zoomItem.value === zoomValue}
                        onClick={() => {
                          this.onClickZoomOption(zoomItem.value);
                        }}
                      >
                        <span className="label">{zoomItem.label}</span>
                        <FontAwesomeIcon
                          className="check"
                          icon={faCheck}
                        ></FontAwesomeIcon>
                      </ZoomMenuItem>
                    );
                  })}
                </ZoomMenu>
              )}
            </Overlay>
            <OverlayTrigger
              key={"zoom-in"}
              placement="top"
              overlay={
                <Tooltip id={`tooltip-zoom-in`}>
                  <StyledTooltipWithKBDShortcut>
                    Zoom In
                    <div className="hotkeys">
                      <kbd>+</kbd>
                    </div>
                  </StyledTooltipWithKBDShortcut>
                </Tooltip>
              }
            >
              <StyledZoomActionButton
                height={"32px"}
                width={"32px"}
                padding={"0px"}
                justifycontent={"center"}
                onClick={() => {
                  canvasRef.handler.zoomHandler.zoomIn();
                }}
              >
                <FontAwesomeIcon icon={faSearchPlus} />
              </StyledZoomActionButton>
            </OverlayTrigger>
          </StyledFooterButtonGroup>
          <StyledVerticalSeparater />
          <OverlayTrigger
            key={"fit"}
            placement="top"
            overlay={
              <Tooltip id={`tooltip-fit`}>
                <StyledTooltipWithKBDShortcut>
                  Fit
                  <div className="hotkeys">
                    <kbd>P</kbd>
                  </div>
                </StyledTooltipWithKBDShortcut>
              </Tooltip>
            }
          >
            <StyledZoomActionButton
              height={"32px"}
              width={"32px"}
              padding={"0px"}
              justifycontent={"center"}
              onClick={() => {
                canvasRef.handler.zoomHandler.zoomToFit();
              }}
            >
              <FontAwesomeIcon icon={faExpand} />
            </StyledZoomActionButton>
          </OverlayTrigger>
        </div>
      </div>
    );
  }

  componentDidMount() {}
}

ArtBoardsRightFooter.propTypes = {};

export default ArtBoardsRightFooter;
