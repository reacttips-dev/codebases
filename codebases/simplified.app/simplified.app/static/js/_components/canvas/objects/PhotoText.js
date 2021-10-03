import { fabric } from "fabric";
import * as Sentry from "@sentry/react";

const PhotoText = fabric.util.createClass(fabric.Textbox, {
  type: "photo-text",
  superType: "textbox",
  options: {},
  initialize(text, options) {
    options = options || {};
    this.options = options || {};

    const { fill, onLoaded, loaded } = options;
    this.callSuper("initialize", text, options);
    this.set({ fill: null });
    const offsetPoints = {
      offsetX: this.oldFillPatternOffsetX ? this.oldFillPatternOffsetX : 0,
      offsetY: this.oldFillPatternOffsetY ? this.oldFillPatternOffsetY : 0,
    };
    this.loadPhotoTextPatternImage(fill?.src, offsetPoints).then(() => {
      if (onLoaded) {
        this.setCustomMiddleLeftRightControlActions();
        onLoaded(this, loaded);
      }
    });
  },
  setPhotoTextFillPattern(url, fImage, offsetPoints, fImageDimensions) {
    const { fImageWidth, fImageHeight } = fImageDimensions;
    const { offsetX, offsetY } = offsetPoints;

    let patternSourceCanvas = new fabric.StaticCanvas();
    patternSourceCanvas.setDimensions({
      width: fImageWidth,
      height: fImageHeight,
    });
    // Match lowerCanvasEl size with image size
    patternSourceCanvas.lowerCanvasEl.width = fImageWidth;
    patternSourceCanvas.lowerCanvasEl.height = fImageHeight;
    patternSourceCanvas.add(fImage);
    fImage.setCoords();
    let patternElement = patternSourceCanvas.getElement();
    patternSourceCanvas.renderAll();

    let imagePattern = new fabric.Pattern({
      source: patternElement,
      repeat: "no-repeat",
      crossOrigin: "anonymous",
      src: url,
      offsetX: offsetX,
      offsetY: offsetY,
      type: "pattern",
    });

    this.set({
      fill: imagePattern,
    });

    this.setCoords();

    if (this.canvas) {
      this.canvas.requestRenderAll();
    }

    return this;
  },
  loadPhotoTextPatternImage(src, offsetPoints) {
    return new Promise((resolve) => {
      fabric.Image.fromURL(
        src,
        (fImage, isError) => {
          if (isError) {
            // Provided src is invalid. So replace with blank image object to avoid application crash. And report issue to get to know which image URL is broken.
            Sentry.captureMessage(
              `Invalid photo text pattern data or invalid image src: ${src}`
            );
            const image = new Image();
            fImage = new fabric.Image(image, {
              width: this.width,
              height: this.height,
            });
          }

          // Textbox size
          let width = this.width;
          let height = this.height;
          let textboxAspectRatio = width / height;

          // Image size
          let imageHeight = fImage.height;
          let imageWidth = fImage.width;
          let imageAspectRatio = imageWidth / imageHeight;

          if (textboxAspectRatio > imageAspectRatio) {
            fImage.scaleToWidth(width);
          } else if (textboxAspectRatio < imageAspectRatio) {
            fImage.scaleToHeight(height);
          } else {
            fImage.scaleToWidth(width);
          }

          imageWidth = fImage.getScaledWidth();
          imageHeight = fImage.getScaledHeight();

          const photoTextObject = this.setPhotoTextFillPattern(
            src,
            fImage,
            offsetPoints,
            {
              fImageWidth: imageWidth,
              fImageHeight: imageHeight,
            }
          );

          resolve(photoTextObject);
        },
        {
          crossOrigin: "anonymous",
        }
      );
    });
  },
  toJSON(propertiesToInclude = [], propertiesToExclude = []) {
    // Override to support exclude properties
    let jsonObject = this.callSuper("toJSON", propertiesToInclude);
    propertiesToExclude.forEach((prop, index) => {
      if (jsonObject?.[prop]) {
        delete jsonObject[prop];
      }
    });
    return jsonObject;
  },
  setCustomMiddleLeftRightControlActions() {
    var photoTextControls = fabric.Textbox.prototype.controls;
    var controlsUtils = fabric.controlsUtils;
    const controlOptions = {
      y: 0,
      actionHandler: controlsUtils.changeWidth,
      cursorStyle: "e-resize",
    };

    photoTextControls.mr = new fabric.Control({
      ...controlOptions,
      x: 0.5,
    });
    photoTextControls.ml = new fabric.Control({
      ...controlOptions,
      x: -0.5,
    });
  },
  _render(ctx) {
    this.callSuper("_render", ctx);
  },
});

PhotoText.fromObject = (options, callback) => {
  return callback(new PhotoText(options));
};

window.fabric.PhotoText = PhotoText;

export default PhotoText;
