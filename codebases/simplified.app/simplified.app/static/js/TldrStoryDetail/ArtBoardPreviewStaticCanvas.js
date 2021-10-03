import ere from "element-resize-event";
import { fabric } from "fabric";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import CanvasObject from "../_components/canvas/CanvasObject";
import { defaultCanvasOption } from "../_components/canvas/constants/defaults";
import StaticHandler from "../_components/canvas/handlers/StaticHandler";
import { StyledArtBoardStaticCanvasWrapper } from "../_components/styled/details/styleArtBoardEditor";
import { isWhiteColor } from "../_utils/common";
import { WORKAREA_LAYOUT_FIXED } from "../_utils/constants";
import { isEmpty } from "lodash";
import { prepareJSONDataForImport } from "./utils/ArtboardUtils";

class ArtBoardPreviewStaticCanvas extends Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  render() {
    const { page } = this.props;

    return (
      <StyledArtBoardStaticCanvasWrapper ref={this.container}>
        <canvas
          id={`preview_${page.id}`}
          style={{ border: "1px solid" }}
        ></canvas>
      </StyledArtBoardStaticCanvasWrapper>
    );
  }

  componentDidMount() {
    const { page } = this.props;
    const { payload } = page;

    // Create canvas board
    this.staticCanvas = new fabric.StaticCanvas(`preview_${page.id}`);

    // It requires to calculate multiplier in headless mode
    this.staticCanvas.actualWidth = payload.width;
    this.staticCanvas.actualHeight = payload.height;

    document.getElementById(`preview_${page.id}`).staticCanvas =
      this.staticCanvas;

    // Create handler to manage objects on the canvas
    this.staticHandler = new StaticHandler({
      id: page.id,
      canvas: this.staticCanvas,
      container: this.container.current,
      workareaOption: { ...payload, layout: WORKAREA_LAYOUT_FIXED },
      width: payload.width,
      height: payload.height,
      canvasOption: Object.assign({}, defaultCanvasOption, {
        backgroundColor: null,
      }),
      fabricObjects: CanvasObject,
      globalScale: 1,
    });

    document.getElementById(`preview_${page.id}`).staticCanvas.staticHandler =
      this.staticHandler;

    this.renderLayersOnCanvas();
  }

  componentWillUnmount() {
    // // Clear canvas to re-initiate on CDU
    this.staticCanvas.clear();
  }

  renderLayersOnCanvas = () => {
    const {
      page,
      layers,
      fonts: storeFontList,
      transparentBackground,
    } = this.props;

    // [Backward Compatibility] To support workarea layout responsive for all existing templates
    const storyPage = Object.assign({}, page);
    if (storyPage?.payload) {
      storyPage.payload = {
        ...storyPage.payload,
        layout: WORKAREA_LAYOUT_FIXED,
        backgroundColor:
          transparentBackground &&
          isWhiteColor(storyPage.payload.backgroundColor)
            ? null
            : storyPage.payload.backgroundColor,
      };

      // When artboard get exported as SVG,
      // It consider fill property only. It should consider backgroundColor property as well
      // Update fill property with background color whenever there is no gradient/image and have backgroundColor
      if (
        isEmpty(storyPage.payload?.fill) &&
        !isEmpty(storyPage.payload?.backgroundColor)
      ) {
        storyPage.payload = {
          ...storyPage.payload,
          fill: storyPage.payload.backgroundColor,
        };
      }
    }

    const canvasJSON = prepareJSONDataForImport(
      storyPage,
      layers,
      storeFontList
    );

    this.staticHandler.importJSON(canvasJSON.objects).then(() => {
      this.resizeStaticCanvasArea(this.container.current);

      // Once text element get render
      // It requires to update its fonts
      this.staticHandler.fontHandler.setOptions({
        clearCache: true,
      });

      this.staticHandler.fontHandler.addFonts(canvasJSON.pageFonts);
    });
  };

  createObserver = () => {
    ere(this.container.current, () => {
      this.resizeStaticCanvasArea(this.container.current);
    });
  };

  resizeStaticCanvasArea = (elementRef) => {
    if (!elementRef) {
      return;
    }

    const { page } = this.props;
    const { payload } = page;
    const { width: canvasOrignalWidth, height: canvasOrignalHeight } = payload;

    let canvasOrignalAspectRatio = canvasOrignalWidth / canvasOrignalHeight;

    let containerWidth = elementRef.offsetWidth;
    let containerHeight = elementRef.offsetHeight;
    let containerAspectRatio = containerWidth / containerHeight;

    let canvasWidth = containerWidth;
    let canvasHeight = containerHeight;

    if (containerAspectRatio > canvasOrignalAspectRatio) {
      canvasWidth = canvasOrignalAspectRatio * canvasHeight;
    } else if (containerAspectRatio < canvasOrignalAspectRatio) {
      canvasHeight = canvasWidth / canvasOrignalAspectRatio;
    }

    // Or : this.staticHandler.globalScale = canvasHeight / this.staticHandler.workareaHandler.height;
    this.staticHandler.globalScale =
      canvasWidth / this.staticHandler.workarea.width;
    this.staticHandler.resize(canvasWidth, canvasHeight);
  };
}

ArtBoardPreviewStaticCanvas.propTypes = {
  page: PropTypes.object.isRequired,
  transparentBackground: PropTypes.bool,
};

ArtBoardPreviewStaticCanvas.defaultProps = {
  transparentBackground: false,
};

const mapStateToProps = (state) => ({
  layers: state.layerstore.layers,
  fonts: state.app.fonts,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArtBoardPreviewStaticCanvas);
