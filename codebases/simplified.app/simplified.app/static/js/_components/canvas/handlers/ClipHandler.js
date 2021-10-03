import { fabric } from "fabric";
import {
  CLIP_SHAPE_CHEVRON,
  CLIP_SHAPE_CIRCLE,
  CLIP_SHAPE_CROSS,
  CLIP_SHAPE_DIAMOND,
  CLIP_SHAPE_ELLIPSE,
  CLIP_SHAPE_HEART,
  CLIP_SHAPE_HEXAGON,
  CLIP_SHAPE_KITE,
  CLIP_SHAPE_OCTAGON,
  CLIP_SHAPE_PARALLELOGRAM,
  CLIP_SHAPE_PENTAGON,
  CLIP_SHAPE_SQUARE,
  CLIP_SHAPE_STAR6,
  CLIP_SHAPE_TRAPEZIUM,
  CLIP_SHAPE_TRIANGLE,
  FABRIC_CIRCLE_ELEMENT,
  FABRIC_ELLIPSE_ELEMENT,
  FABRIC_POLYGON_ELEMENT,
  FABRIC_RECT_ELEMENT,
  FABRIC_TRIANGLE_ELEMENT,
} from "../../details/constants";
import { CROP_INTERACTION, defaultClipRect } from "../constants/defaults";
import { isEmpty } from "lodash";

export default class ClipHandler {
  constructor(handler) {
    this.handler = handler;
    this.clipRect = null;
    this.cropRect = null;
    this.clipObject = null;
  }

  /**
   * Validate crop type
   * @returns
   */
  validType = () => {
    const activeObject = this.handler.canvas.getActiveObject();
    if (!activeObject) {
      return false;
    }
    if (activeObject.id === "cropRect") {
      return true;
    }
    return false;
  };

  /**
   * Start clipping image
   */
  start = (selectedClipShape) => {
    if (this.validType()) {
      this.clipObject = this.handler.cropHandler.cropObject;
      this.removeCropRect();

      this.handler.interactionMode = CROP_INTERACTION;
      // remove previously selected clip shape
      if (this.validType()) {
        const activeObject = this.handler.canvas.getActiveObject();
        this.handler.canvas.remove(activeObject);
      }
      // add new clip shape
      this.clipRect = this.addClipArea(selectedClipShape);

      let target = this.clipObject;
      target.picArea = this.clipRect;

      if (target.clipPath) {
        var oldLeft = target.picArea.left;
        var oldTop = target.picArea.top;

        target.clipPath = null;

        target.left -= target.picArea.left - oldLeft;
        target.top -= target.picArea.top - oldTop;
        target.setCoords();

        target.picArea.left = oldLeft;
        target.picArea.top = oldTop;
        target.picArea.setCoords();
      }

      this.clipObject = target;
      if (this.clipRect) {
        this.handler.canvas.setActiveObject(this.clipRect);
      }
      this.handler.canvas.renderAll();
    }
  };

  removeCropRect = () => {
    this.cropRect = this.handler.cropHandler.cropRect;
    this.clipObject.selectable = true;
    this.clipObject.evented = true;

    if (this.cropRect) {
      this.handler.canvas.remove(this.cropRect);
    }
    this.cropRect = null;
    this.handler.cropHandler.cropRect = null;
    this.handler.canvas.renderAll();
  };

  addClipArea = (selectedClipShape) => {
    let clipArea = defaultClipRect.payload;
    let picture = this.clipObject;

    clipArea = {
      left: this.clipRect ? this.clipRect.left : picture.left,
      top: this.clipRect ? this.clipRect.top : picture.top,
      angle: picture.angle,
      hasRotatingPoint: false,
      scaleX: picture.scaleX,
      scaleY: picture.scaleY,
      skewX: picture.skewX,
      skewY: picture.skewY,
      userProperty: {
        clipShape: selectedClipShape,
      },
      ...clipArea,
    };

    clipArea = this.addClippingShape(clipArea, selectedClipShape);
    clipArea.custtype = "picArea";

    let clipAreaObj = this.handler.add(clipArea, false, true);
    clipAreaObj.setControlsVisibility({ mtr: false });
    picture.picArea = clipAreaObj;
    this.handler.canvas.renderAll();
    return clipAreaObj;
  };

  addClippingShape = (clipArea, shape) => {
    var picture = this.clipObject;
    var smallestSide =
      picture.height > picture.width ? picture.width : picture.height;

    switch (shape) {
      case CLIP_SHAPE_SQUARE:
        Object.assign(clipArea, {
          type: FABRIC_RECT_ELEMENT,
          height: smallestSide,
          width: smallestSide,
          rx: 100,
          ry: 100,
        });
        break;
      case CLIP_SHAPE_CIRCLE:
        Object.assign(clipArea, {
          type: FABRIC_CIRCLE_ELEMENT,
          radius: smallestSide / 2,
        });
        break;
      case CLIP_SHAPE_TRIANGLE:
        Object.assign(clipArea, {
          type: FABRIC_TRIANGLE_ELEMENT,
          height: smallestSide,
          width: smallestSide,
        });
        break;
      case CLIP_SHAPE_ELLIPSE:
        Object.assign(clipArea, {
          type: FABRIC_ELLIPSE_ELEMENT,
          rx: picture.width / 2,
          ry: picture.height / 2,
        });
        break;
      case CLIP_SHAPE_TRAPEZIUM:
        Object.assign(clipArea, {
          type: FABRIC_POLYGON_ELEMENT,
          points: [
            { x: 100, y: 0 },
            { x: 200, y: 0 },
            { x: 300, y: 200 },
            { x: 0, y: 200 },
          ],
          scaleX: 0.6,
          scaleY: 0.6,
        });
        break;
      case CLIP_SHAPE_STAR6:
        Object.assign(clipArea, {
          type: FABRIC_POLYGON_ELEMENT,
          points: [
            { x: 100, y: 0 },
            { x: 140, y: 50 },
            { x: 200, y: 50 },
            { x: 150, y: 100 },
            { x: 200, y: 150 },
            { x: 140, y: 150 },
            { x: 100, y: 200 },
            { x: 150, y: 150 },
            { x: 100, y: 200 },
            { x: 60, y: 150 },
            { x: 0, y: 150 },
            { x: 50, y: 100 },
            { x: 0, y: 50 },
            { x: 60, y: 50 },
          ],
          scaleX: 1,
          scaleY: 1,
        });
        break;
      case CLIP_SHAPE_PENTAGON:
        Object.assign(clipArea, {
          type: FABRIC_POLYGON_ELEMENT,
          points: [
            { x: 100, y: 0 },
            { x: 200, y: 100 },
            { x: 150, y: 200 },
            { x: 50, y: 200 },
            { x: 0, y: 100 },
          ],
          scaleX: 1,
          scaleY: 1,
        });
        break;
      case CLIP_SHAPE_HEXAGON:
        Object.assign(clipArea, {
          type: FABRIC_POLYGON_ELEMENT,
          points: [
            { x: 100, y: 0 },
            { x: 200, y: 0 },
            { x: 250, y: 100 },
            { x: 200, y: 200 },
            { x: 100, y: 200 },
            { x: 50, y: 100 },
          ],
          scaleX: 1,
          scaleY: 1,
        });
        break;
      case CLIP_SHAPE_OCTAGON:
        Object.assign(clipArea, {
          type: FABRIC_POLYGON_ELEMENT,
          points: [
            { x: 100, y: 0 },
            { x: 200, y: 0 },
            { x: 250, y: 50 },
            { x: 250, y: 125 },
            { x: 200, y: 175 },
            { x: 100, y: 175 },
            { x: 50, y: 125 },
            { x: 50, y: 50 },
          ],
          scaleX: 1,
          scaleY: 1,
        });
        break;
      case CLIP_SHAPE_DIAMOND:
        Object.assign(clipArea, {
          type: FABRIC_POLYGON_ELEMENT,
          points: [
            { x: 100, y: 0 },
            { x: 200, y: 0 },
            { x: 250, y: 50 },
            { x: 150, y: 150 },
            { x: 50, y: 50 },
          ],
          scaleX: 1,
          scaleY: 1,
        });
        break;
      case CLIP_SHAPE_KITE:
        Object.assign(clipArea, {
          type: FABRIC_POLYGON_ELEMENT,
          points: [
            { x: 100, y: 0 },
            { x: 200, y: 100 },
            { x: 100, y: 200 },
            { x: 0, y: 100 },
          ],
          scaleX: 1,
          scaleY: 1,
        });
        break;
      case CLIP_SHAPE_PARALLELOGRAM:
        Object.assign(clipArea, {
          type: FABRIC_POLYGON_ELEMENT,
          points: [
            { x: 100, y: 0 },
            { x: 250, y: 0 },
            { x: 200, y: 100 },
            { x: 50, y: 100 },
          ],
          scaleX: 1,
          scaleY: 1,
        });
        break;
      case CLIP_SHAPE_CHEVRON:
        Object.assign(clipArea, {
          type: FABRIC_POLYGON_ELEMENT,
          points: [
            { x: 0, y: 0 },
            { x: 150, y: 0 },
            { x: 200, y: 100 },
            { x: 150, y: 200 },
            { x: 0, y: 200 },
            { x: 50, y: 100 },
          ],
          scaleX: 1,
          scaleY: 1,
        });
        break;
      case CLIP_SHAPE_CROSS:
        Object.assign(clipArea, {
          type: FABRIC_POLYGON_ELEMENT,
          points: [
            { x: 50, y: 0 },
            { x: 100, y: 0 },
            { x: 100, y: 50 },
            { x: 150, y: 50 },
            { x: 150, y: 100 },
            { x: 100, y: 100 },
            { x: 100, y: 150 },
            { x: 50, y: 150 },
            { x: 50, y: 100 },
            { x: 0, y: 100 },
            { x: 0, y: 50 },
            { x: 50, y: 50 },
          ],
          scaleX: 1,
          scaleY: 1,
        });
        break;
      default:
        return clipArea;
    }

    return clipArea;
  };

  /**
   * Finish clipping image
   */
  finish = () => {
    this.clipImage();
    this.handler.interactionMode = "selection";
    this.handler.canvas.fire("object:modified", {
      target: this.clipObject,
    });
    this.cancel();
  };

  /**
   * Cancel clipping
   */
  cancel = (isClickedOutside) => {
    this.handler.interactionMode = "selection";
    this.clipObject.selectable = true;
    this.clipObject.evented = true;
    if (this.clipObject) {
      this.handler.canvas.setActiveObject(this.clipObject);
    }
    if (this.clipRect) {
      if (isClickedOutside) {
        this.clipImage();
      }
      this.handler.canvas.remove(this.clipRect);
    }
    if (this.handler.cropHandler.cropRect) {
      this.handler.canvas.remove(this.handler.cropHandler.cropRect);
    }
    this.clipRect = null;
    this.clipObject = null;
    this.handler.cropHandler.cropRect = null;
    this.handler.canvas.renderAll();
  };

  clipImage = () => {
    this.handler.interactionMode = "selection";
    const { canvas } = this.handler;

    if (
      this.clipObject &&
      (this.clipObject.type === "image" ||
        this.clipObject.superType === "image")
    ) {
      this.clipObject.oldScaleX = this.clipObject.scaleX;
      this.clipObject.oldScaleY = this.clipObject.scaleY;

      let oldAngle = this.clipObject.picArea.angle;
      let oldLeft = this.clipObject.picArea.left;
      let oldTop = this.clipObject.picArea.top;

      this.rotateSelection(this.clipObject, 360 - oldAngle);

      // crop image to clipRect
      this.clipObject.cropX =
        (this.clipRect.left - this.clipObject.left) / this.clipObject.scaleX;
      this.clipObject.cropY =
        (this.clipRect.top - this.clipObject.top) / this.clipObject.scaleY;

      this.clipObject.width =
        (this.clipRect.width * this.clipRect.scaleX) / this.clipObject.scaleX;
      this.clipObject.height =
        (this.clipRect.height * this.clipRect.scaleY) / this.clipObject.scaleY;

      this.clipObject.left = this.clipRect.left;
      this.clipObject.top = this.clipRect.top;

      this.rotateSelection(this.clipObject, oldAngle);

      this.clipObject.left = oldLeft;
      this.clipObject.top = oldTop;

      // adjust the properties
      this.adjustClipRect();

      // apply clipPath
      this.clipObject.clipPath = this.clipRect;
      if (this.clipObject?.userProperty) {
        this.clipObject.userProperty["clipShape"] =
          this.clipRect.userProperty?.clipShape;
      } else {
        this.clipObject.userProperty = {
          clipShape: this.clipRect.userProperty?.clipShape,
        };
      }
    }

    this.clipObject.setCoords();
    this.clipObject.selectable = true;
    this.clipObject.hasRotatingPoint = true;
    canvas.remove(this.clipRect);
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  adjustClipRect = () => {
    this.clipRect.left = 0;
    this.clipRect.top = 0;
    this.clipRect.skewX = 0;
    this.clipRect.skewY = 0;
    if (this.clipObject.angle < -2 || this.clipObject.angle > 2) {
      this.clipRect.angle = 0;
    }
    this.clipRect.originX = "center";
    this.clipRect.originY = "center";
    this.clipRect.scaleX = this.clipObject.width / this.clipRect.width;
    this.clipRect.scaleY = this.clipObject.height / this.clipRect.height;
    this.handler.canvas.requestRenderAll();
  };

  rotateSelection = (picture, angle) => {
    this.handler.canvas.discardActiveObject();
    var sel = new fabric.ActiveSelection([picture, picture.picArea], {
      canvas: this.handler.canvas,
    });
    this.handler.canvas.setActiveObject(sel);
    sel.rotate(angle);
    this.handler.canvas.requestRenderAll();

    //unselect
    this.handler.canvas.discardActiveObject();
    this.handler.canvas.requestRenderAll();
  };

  getFClipPath = (obj) => {
    let clippedPath;

    const { clipPath } = obj;
    let { userProperty = {} } = obj;
    if (isEmpty(userProperty?.clipShape)) {
      userProperty.clipShape = clipPath.type;
    }

    switch (userProperty?.clipShape) {
      case CLIP_SHAPE_SQUARE:
        clippedPath = new fabric.Rect({
          ...clipPath,
          rx: 100,
          ry: 100,
        });
        break;
      case CLIP_SHAPE_CIRCLE:
        clippedPath = new fabric.Circle({
          ...clipPath,
        });
        break;
      case CLIP_SHAPE_TRIANGLE:
        clippedPath = new fabric.Triangle({
          ...clipPath,
        });
        break;
      case CLIP_SHAPE_ELLIPSE:
        clippedPath = new fabric.Ellipse({
          ...clipPath,
        });
        break;
      case CLIP_SHAPE_TRAPEZIUM:
      case CLIP_SHAPE_STAR6:
      case CLIP_SHAPE_PENTAGON:
      case CLIP_SHAPE_HEXAGON:
      case CLIP_SHAPE_OCTAGON:
      case CLIP_SHAPE_DIAMOND:
      case CLIP_SHAPE_KITE:
      case CLIP_SHAPE_PARALLELOGRAM:
      case CLIP_SHAPE_CHEVRON:
      case CLIP_SHAPE_CROSS:
        const { points, ...otherProps } = clipPath;
        clippedPath = new fabric.Polygon(points, {
          ...otherProps,
        });
        break;
      case CLIP_SHAPE_HEART:
        break;
      default:
        return false;
    }
    return clippedPath;
  };
}
