import React, { Component } from "react";
import { connect } from "react-redux";
import { v4 } from "uuid";
import { fabric } from "fabric";
import axios from "axios";
import {
  defaultActiveSelectionOption,
  defaultCanvasOption,
  defaultGuidelineOption,
  defaultKeyEvent,
  defaultObjectOption,
  defaultPropertiesToExclude,
  propertiesToInclude,
} from "../_components/canvas/constants/defaults";
import Handler from "../_components/canvas/handlers/Handler";
import ere from "element-resize-event";
import { isEqual, forOwn, isEmpty } from "lodash";
import CanvasObject from "../_components/canvas/CanvasObject";
import {
  FABRIC_GROUP_ELEMENT,
  FABRIC_TEXT_TYPES,
  FABRIC_VIDEO_ELEMENT,
} from "../_components/details/constants";
import { prepareJSONDataForImport } from "./utils/ArtboardUtils";
import { WORKAREA_LAYOUT_RESPONSIVE } from "../_utils/constants";
import { fetchStoryFonts } from "../_actions/appActions";

class ArtBoard extends Component {
  signal = axios.CancelToken.source();
  constructor(props) {
    super(props);
    this.container = React.createRef();
  }

  render() {
    const { style } = this.props;
    const { id } = this.props.activePage;
    return (
      <div
        ref={this.container}
        id={id}
        className="tldr-canvas"
        style={{ width: "100%", height: "100%", ...style }}
      >
        <canvas id={`canvas_${id}`} />
      </div>
    );
  }

  componentDidMount() {
    const {
      editable,
      canvasOption,
      responsive,
      artBoardSize = {
        width: 0,
        height: 0,
      },
      ...other
    } = this.props;

    const { width, height } = artBoardSize;

    const { id } = this.props.activePage;

    const mergedCanvasOption = Object.assign(
      {},
      defaultCanvasOption,
      canvasOption,
      {
        width,
        height,
        selection: editable,
      }
    );
    this.canvas = new fabric.Canvas(`canvas_${id}`, mergedCanvasOption);
    this.canvas.selectionBorderColor = "rgb(255, 172, 65)";
    this.canvas.selectionColor = "rgba(255, 172, 65, 0.12)";
    this.canvas.selectionLineWidth = 2;
    this.canvas.setBackgroundColor(
      mergedCanvasOption.backgroundColor,
      this.canvas.renderAll.bind(this.canvas)
    );
    this.canvas.renderAll();
    this.handler = new Handler({
      id,
      width,
      height,
      editable,
      canvas: this.canvas,
      workareaOption: { width, height, layout: WORKAREA_LAYOUT_RESPONSIVE },
      container: this.container.current,
      canvasOption: mergedCanvasOption,
      fabricObjects: CanvasObject,
      guidelineOption: defaultGuidelineOption,
      activeSelectionOption: defaultActiveSelectionOption,
      objectOption: defaultObjectOption,
      propertiesToInclude: propertiesToInclude,
      propertiesToExclude: defaultPropertiesToExclude,
      ...other,
      keyEvent: defaultKeyEvent,
    });

    this.resizePageArea(this.container.current);

    this.createObserver();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextActiveArtboard = nextProps.activePage.id;
    const nextPage = nextProps.pagestore.pages[nextActiveArtboard];
    const currentPage = this.props.pagestore.pages[this.props.activePage.id];
    if (!currentPage && !nextPage) {
      return false;
    }
    if (nextActiveArtboard !== this.props.activePage.id) {
      // Page id's are different
      return true;
    } else if (!isEqual(nextProps.artBoardSize, this.props.artBoardSize)) {
      // Artboard size is changing
      return true;
    } else if (
      nextPage.payload.backgroundColor !== currentPage.payload.backgroundColor
    ) {
      return true;
    } else if (nextPage.payload.src !== currentPage.payload.src) {
      return true;
    } else if (
      nextProps.pagestore.pages[nextActiveArtboard].layers.length !==
      this.props.pagestore.pages[this.props.activePage.id].layers.length
    ) {
      return true;
    } else if (
      this.props.layerstore.lastUpdated < nextProps.layerstore.lastUpdated
    ) {
      return true;
    }
    return false;
  }

  renderLayersOnCanvas = () => {
    const { id } = this.props.activePage;
    const page = this.props.pagestore.pages[id];
    const layers = this.props.layerstore.layers;

    // [Backward Compatibility] To support workarea layout responsive for all existing templates
    const storyPage = Object.assign({}, page);
    if (storyPage?.payload) {
      storyPage.payload = {
        ...storyPage.payload,
        layout: WORKAREA_LAYOUT_RESPONSIVE,
      };
    }

    const canvasJSON = prepareJSONDataForImport(storyPage, layers);
    this.handler.importJSON(canvasJSON.objects).then((canvas) => {
      this.handler.zoomHandler.zoomToFitSafeArea();
    });
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      artBoardSize,
      activePage,
      pagestore,
      layerstore,
      clonedLayerIds,
      storyId,
    } = this.props;

    if (
      isEmpty(prevProps.artBoardSize) ||
      !isEqual(prevProps.artBoardSize, artBoardSize)
    ) {
      // In this case resize the canvas and all the elements in that page.
      this.handlePageResize();
    } else if (
      this.isActivePageChanged(
        prevProps.activePage.id,
        this.props.activePage.id
      )
    ) {
      // User switched artboards.
      this.cleanWorkArea();
      this.renderLayersOnCanvas();
    } else if (
      prevProps.pagestore.pages[prevProps.activePage.id].layers.length !==
      pagestore.pages[activePage.id].layers.length
    ) {
      // if any single layer get deleted/removed from the current artboard
      const layersOnCanvas = this.handler.getObjects();
      const currentArtboardLayerIds = pagestore.pages[activePage.id].layers;
      const deletedLayers = layersOnCanvas.filter(
        (layerOnCanvas) => !currentArtboardLayerIds.includes(layerOnCanvas.id)
      );
      deletedLayers.forEach((deletedLayer) => {
        this.handler.remove(deletedLayer);
      });

      // TODO: Implement active selection
      // If any single layer get added
      // Layer get added or removed from the active artboard
      const { left, top } = this.handler.workarea;
      const activeSelection = [];
      const newlyAddedLayerIds = currentArtboardLayerIds.filter((layerId) =>
        isEmpty(this.handler.objectMap[layerId])
      );
      let isTheryAnyNewTextOrGroupLayer = false;
      newlyAddedLayerIds.forEach((layerId) => {
        const layer = layerstore.layers[layerId];
        layer.payload["id"] = layerId; // Temp fix. @Devang will fix this issue from the backend
        if (
          layer.payload?.type === FABRIC_GROUP_ELEMENT ||
          FABRIC_TEXT_TYPES.includes(layer.payload?.type)
        ) {
          isTheryAnyNewTextOrGroupLayer = true;
        }
        const createdLayerFObj = this.addNewLayer(layer, left, top);
        // If layer is part of clone action then push to active selection
        if (
          createdLayerFObj &&
          clonedLayerIds.indexOf(createdLayerFObj.id) > -1
        ) {
          activeSelection.push(createdLayerFObj);
        }
      });

      if (isTheryAnyNewTextOrGroupLayer) {
        this.props.fetchStoryFonts(storyId, this.signal, this.props);
      }

      if (activeSelection.length > 0) {
        this.handler.createActiveSelection(activeSelection);
      }
    } else if (
      prevProps.layerstore.lastUpdated < this.props.layerstore.lastUpdated
    ) {
      const currentArtboardLayerIds = pagestore.pages[activePage.id].layers;
      let renderCanvas = false;
      currentArtboardLayerIds.forEach((layerId, index) => {
        let canvasfObj = this.handler.objectMap[layerId];
        if (!canvasfObj) {
          return;
        }
        let layer = layerstore.layers[layerId];
        if (canvasfObj.lastUpdated !== layer.payload.lastUpdated) {
          const { left, top } = this.handler.workarea;
          let payload = Object.assign({}, layer.payload);
          payload["left"] += left;
          payload["top"] += top;
          this.handler.update(canvasfObj, payload);
          if (!renderCanvas) {
            renderCanvas = true;
          }
        }
      });
      if (renderCanvas) {
        this.canvas.renderAll();
      }
    }
  }

  isActivePageChanged = (prevActivePageId, currentActivePageId) => {
    return prevActivePageId !== currentActivePageId;
  };

  handlePageResize = () => {
    const { id } = this.props.activePage;
    const page = this.props.pagestore.pages[id];
    let objPayload = page?.payload;

    if (isEmpty(objPayload)) {
      return;
    }
    this.cleanWorkArea();
    this.renderLayersOnCanvas();
  };

  cleanWorkArea = () => {
    // Clear native html elements from the canvas
    let objectWithNativeElements = this.handler.canvas
      .getObjects()
      .filter((obj) => obj.superType === "element");
    forOwn(objectWithNativeElements, (obj, key) => {
      let elementId = obj.element.id;
      document.getElementById(elementId).remove();
    });
    this.handler.workareaHandler.clear();
    this.handler.canvas.clear();
    this.handler.canvas.renderAll();
  };

  addNewLayer = (layer, left, top) => {
    let payload = Object.assign({}, layer.payload);
    let centered = false,
      loaded = true;
    if (payload.top === undefined) {
      // This is a new id'
      centered = true;
      loaded = false;
    } else {
      payload["left"] += left;
      payload["top"] += top;
    }
    payload["id"] = layer.id;
    payload["lastUpdated"] = layer?.last_updated;
    if (payload.type === FABRIC_VIDEO_ELEMENT && !payload.cover) {
      payload["cover"] = layer?.content?.url || "";
    }
    return this.handler.add(payload, centered, loaded);
  };

  createObserver = () => {
    ere(this.container.current, () => {
      // proceed with elements resizing
      this.resizePageArea(this.container.current);
    });
  };

  resizePageArea = (elementRef) => {
    if (!elementRef) {
      return;
    }
    let width = elementRef.offsetWidth;
    let height = elementRef.offsetHeight;
    this.handler.eventHandler.resize(width, height);
  };
}

ArtBoard.propTypes = {};

ArtBoard.defaultProps = {
  id: v4(),
  editable: true,
  zoomEnabled: true,
  minZoom: 5,
  maxZoom: 300,
  responsive: true,
  width: 0,
  height: 0,
};

const mapStateToProps = (state) => {
  const page = state.pagestore?.pages[state.editor.activePage?.id];

  return {
    fonts: state.app.fonts,
    pagestore: state.pagestore,
    layerstore: state.layerstore,
    clonedLayerIds: state.editor.clonedLayerIds || [],
    activePage: state.editor.activePage,
    storyId: state.story?.payload?.id,
    artBoardSize: {
      width: page?.payload.width,
      height: page?.payload.height,
    },
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchStoryFonts: (storyId, cancelToken, props) =>
    dispatch(fetchStoryFonts(storyId, cancelToken, props)),
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(ArtBoard);
