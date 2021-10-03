import { fabric } from "fabric";
import {
  FABRIC_IMAGE_ELEMENT,
  FABRIC_VIDEO_ELEMENT,
  RATIO_LANDSCAPE,
  RATIO_PORTRAIT,
  RATIO_SQUARE,
  RATIO_STORY,
  RATIO_WIDESCREEN,
} from "../../details/constants";
import { CROP_INTERACTION, defaultCropRect } from "../constants/defaults";

export default class CropHandler {
  constructor(handler) {
    this.handler = handler;
    this.cropRect = null;
    this.cropObject = null;
    this.clipRect = null;
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
    if (
      activeObject.type === FABRIC_IMAGE_ELEMENT ||
      activeObject.type === FABRIC_VIDEO_ELEMENT
    ) {
      return true;
    }
    return false;
  };

  /**
   * Start crop image
   */
  start = () => {
    if (this.validType()) {
      this.handler.interactionMode = CROP_INTERACTION;
      this.cropObject = this.handler.canvas.getActiveObject();
      this.cropRect = this.addCropArea(this.cropObject);

      let target = this.cropObject;
      target.picArea = this.cropRect;

      if (target.cropX || target.cropY) {
        var oldAngle = target.angle;
        var oldLeft = target.picArea.left;
        var oldTop = target.picArea.top;

        this.rotateSelection(target, 360 - oldAngle);

        if (target.cropX)
          target.left = target.picArea.left - target.cropX * target.scaleX;
        if (target.cropY)
          target.top = target.picArea.top - target.cropY * target.scaleY;

        target.scaleX = target.oldScaleX;
        target.scaleY = target.oldScaleY;
        target.width = target.oldWidth;
        target.height = target.oldHeight;

        target.cropX = 0;
        target.cropY = 0;

        this.rotateSelection(target, oldAngle);

        target.left -= target.picArea.left - oldLeft;
        target.top -= target.picArea.top - oldTop;
        target.setCoords();

        target.picArea.left = oldLeft;
        target.picArea.top = oldTop;
        target.picArea.setCoords();
      } else {
        if (target.width < target.oldWidth) target.width = target.oldWidth;
        if (target.height < target.oldHeight) target.height = target.oldHeight;
        target.setCoords();
      }

      this.cropObject = target;

      this.handler.canvas.setActiveObject(this.cropRect);
      this.cropObject.selectable = false;
      this.cropObject.evented = false;
      this.handler.canvas.renderAll();

      if (this.cropObject.clipPath) {
        this.handler.clipHandler.start(this.cropObject.userProperty?.clipShape);
      }
    }
  };

  removeClipRect = () => {
    this.clipRect = this.handler.clipHandler.clipRect;
    this.cropObject.selectable = true;
    this.cropObject.evented = true;

    if (this.clipRect) {
      this.handler.canvas.remove(this.clipRect);
    }
    this.clipRect = null;
    this.handler.canvas.renderAll();
  };

  addCropArea = (picture) => {
    let cropArea = defaultCropRect.payload;
    cropArea = {
      ...cropArea,
      width: picture.width,
      height: picture.height,
      scaleX: picture.scaleX,
      scaleY: picture.scaleY,
      left: picture.left,
      top: picture.top,
      angle: picture.angle,
      hasRotatingPoint: false,
      skewX: picture.skewX,
      skewY: picture.skewY,
    };
    cropArea.custtype = "picArea";

    let cropAreaObj = this.handler.add(cropArea, false, true);
    cropAreaObj.setControlsVisibility({ mtr: false });
    picture.picArea = cropAreaObj;
    this.handler.canvas.renderAll();
    return cropAreaObj;
  };

  changeCropArea = (ratio) => {
    this.removeClipRect();
    if (!this.cropRect) {
      this.cropRect = this.addCropArea(this.cropObject);
      this.handler.canvas.setActiveObject(this.cropRect);
    }

    const activeObject = this.handler.canvas.getActiveObject();
    if (!activeObject || activeObject.id !== "cropRect") {
      return false;
    }

    const { width, height } = this.cropObject;
    var newWidth;
    var newHeight;

    switch (ratio) {
      case RATIO_SQUARE:
        if (height > width) {
          newWidth = width;
          newHeight = width;
        } else {
          newWidth = height;
          newHeight = height;
        }
        this.changeControlVisibility(activeObject, false);
        break;
      case RATIO_WIDESCREEN:
        if (height > width) {
          newWidth = width;
          newHeight = Math.round(width / 1.778);
        } else {
          newWidth = height;
          newHeight = Math.round(height / 1.778);
        }
        this.changeControlVisibility(activeObject, false);
        break;
      case RATIO_STORY:
        if (height > width) {
          newWidth = Math.round(width / 1.778);
          newHeight = width;
        } else {
          newWidth = Math.round(height / 1.778);
          newHeight = height;
        }
        this.changeControlVisibility(activeObject, false);
        break;
      case RATIO_LANDSCAPE:
        if (height > width) {
          newWidth = width;
          newHeight = Math.round(width / 1.333);
        } else {
          newWidth = height;
          newHeight = Math.round(height / 1.333);
        }
        this.changeControlVisibility(activeObject, false);
        break;
      case RATIO_PORTRAIT:
        if (height > width) {
          newWidth = Math.round(width / 1.333);
          newHeight = width;
        } else {
          newWidth = Math.round(height / 1.333);
          newHeight = height;
        }
        this.changeControlVisibility(activeObject, false);
        break;
      default:
        newHeight = height;
        newWidth = width;
        this.changeControlVisibility(activeObject, true);
        break;
    }

    activeObject.set({
      height: newHeight,
      width: newWidth,
    });
    this.handler.canvas.renderAll();
  };

  changeControlVisibility = (obj, ctrlValue) => {
    obj.setControlsVisibility({
      mt: ctrlValue,
      mb: ctrlValue,
      ml: ctrlValue,
      mr: ctrlValue,
    });
    this.handler.canvas.renderAll();
  };

  /**
   * Finish crop image
   */
  finish = () => {
    this.cropImage();
    this.handler.interactionMode = "selection";
    this.handler.canvas.fire("object:modified", {
      target: this.cropObject,
    });
    this.cancel(false);
  };

  /**
   * Cancel crop
   */
  cancel = (isClickedOutside) => {
    this.handler.interactionMode = "selection";
    this.cropObject.selectable = true;
    this.cropObject.evented = true;
    if (this.cropObject) {
      this.handler.canvas.setActiveObject(this.cropObject);
    }
    if (this.cropRect) {
      if (isClickedOutside) {
        this.cropImage();
      }
      this.handler.canvas.remove(this.cropRect);
    }
    if (this.handler.clipHandler.clipRect) {
      this.handler.canvas.remove(this.handler.clipHandler.clipRect);
    }
    this.cropRect = null;
    this.cropObject = null;
    this.handler.clipHandler.clipRect = null;
    this.handler.canvas.renderAll();
  };

  cropImage = () => {
    this.handler.interactionMode = "selection";
    const { canvas } = this.handler;

    if (
      this.cropObject &&
      (this.cropObject.type === "image" ||
        this.cropObject.superType === "image")
    ) {
      this.cropObject.oldScaleX = this.cropObject.scaleX;
      this.cropObject.oldScaleY = this.cropObject.scaleY;

      let oldAngle = this.cropObject.picArea.angle;
      let oldLeft = this.cropObject.picArea.left;
      let oldTop = this.cropObject.picArea.top;

      this.rotateSelection(this.cropObject, 360 - oldAngle);

      this.cropObject.cropX =
        (this.cropRect.left - this.cropObject.left) / this.cropObject.scaleX;
      this.cropObject.cropY =
        (this.cropRect.top - this.cropObject.top) / this.cropObject.scaleY;

      this.cropObject.width =
        (this.cropRect.width * this.cropRect.scaleX) / this.cropObject.scaleX;
      this.cropObject.height =
        (this.cropRect.height * this.cropRect.scaleY) / this.cropObject.scaleY;

      this.cropObject.left = this.cropRect.left;
      this.cropObject.top = this.cropRect.top;

      this.rotateSelection(this.cropObject, oldAngle);

      this.cropObject.left = oldLeft;
      this.cropObject.top = oldTop;
    }

    this.cropObject.setCoords();
    this.cropObject.selectable = true;
    this.cropObject.hasRotatingPoint = true;
    canvas.remove(this.cropRect);
    canvas.discardActiveObject();
    canvas.renderAll();
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
}
