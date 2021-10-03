import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col } from "react-bootstrap";
import AdvancedTextEditorToolbar from "../textEditorToolbar/AdvancedTextEditorToolbar";
import AdvancedImageEditorToolbar from "../imageEditorToolbar/AdvancedImageEditorToolbar";
import AdvancedVideoEditorToolbar from "../videoEditorToolbar/AdvancedVideoEditorToolbar";
import AdvancedShapeEditorToolbar from "../shapeEditorToolbar/AdvancedShapeEditorToolbar";
import StudioCommonActions from "../../StudioCommonActions";
import CommonLayerActions from "../../CommonLayerActions";
import TldrLayerStyle from "../../../common/TldrLayerStyle";
import TldrDropShadow from "../../../common/TldrDropShadow";
import TldrStroke from "../../../common/TldrStroke";
import ImageEditorToolbar from "../imageEditorToolbar/ImageEditorToolbar";
import VideoEditorToolbar from "../videoEditorToolbar/VideoEditorToolbar";
import TldrGradientCollapsibleSection from "../../../common/tldrGradients/TldrGradientCollapsibleSection";
import TldrDetails from "../../../common/TldrDetails";
import SlideStyle from "../../advanced/slideLayers/SlideStyle";
import { FABRIC_PHOTOTEXT_ELEMENT } from "../../constants";
import TLDRTextMask from "../textEditorToolbar/TLDRTextMask";

class StudioAdvancedEditor extends Component {
  render() {
    const { editor, canvasRef, artBoardHandler } = this.props;
    const { activeElement } = editor;
    return (
      <>
        <div id="tldr-toolbar">
          <Col>
            <Row>
              <StudioCommonActions
                location="sidebar"
                canvasRef={canvasRef}
                artBoardHandlers={artBoardHandler}
              >
                {activeElement.mime === "image" && (
                  <ImageEditorToolbar
                    canvasRef={canvasRef}
                    location="sidebar"
                  />
                )}

                {activeElement.mime === "video" && (
                  <VideoEditorToolbar canvasRef={canvasRef} />
                )}

                {activeElement.mime === "text" &&
                  activeElement.format?.type === FABRIC_PHOTOTEXT_ELEMENT && (
                    <TLDRTextMask canvasRef={canvasRef} location="sidebar" />
                  )}
              </StudioCommonActions>
            </Row>
            <Row>
              <hr className="tldr-hl mv-12" />
            </Row>
            {activeElement.id === null && (
              <Row>
                <Col className="p-0">
                  <SlideStyle canvasRef={canvasRef} />
                  <TldrGradientCollapsibleSection canvasRef={canvasRef} />
                </Col>
              </Row>
            )}
            <Row>
              <Col className="p-0">
                {activeElement.id !== null && (
                  <>
                    <TldrDetails canvasRef={canvasRef} />
                    <TldrLayerStyle
                      right={-70}
                      width={306}
                      canvasRef={canvasRef}
                    />
                    <CommonLayerActions canvasRef={canvasRef} />
                  </>
                )}
                {activeElement.mime === "text" ? (
                  <AdvancedTextEditorToolbar canvasRef={canvasRef} />
                ) : activeElement.mime === "image" ? (
                  <AdvancedImageEditorToolbar />
                ) : activeElement.mime === "video" ? (
                  <AdvancedVideoEditorToolbar />
                ) : activeElement.mime === "shape" ? (
                  <AdvancedShapeEditorToolbar
                    canvasRef={canvasRef}
                    artBoardHandlers={artBoardHandler}
                  />
                ) : (
                  <></>
                )}
                {activeElement.id !== null && (
                  <>
                    <TldrDropShadow canvasRef={canvasRef} />
                    <TldrStroke canvasRef={canvasRef} />
                  </>
                )}
              </Col>
            </Row>
          </Col>
        </div>
      </>
    );
  }
}

StudioAdvancedEditor.propTypes = {
  editor: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudioAdvancedEditor);
