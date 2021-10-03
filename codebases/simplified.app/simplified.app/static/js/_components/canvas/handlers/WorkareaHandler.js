import { fabric } from "fabric";
import { isEmpty } from "lodash";
import { adjustColorOffsets, angleToRect } from "../../../_utils/common";
import * as Sentry from "@sentry/react";
import { defaultWorkareaOption } from "../constants/defaults";

class WorkareaHandler {
  constructor(handler) {
    this.handler = handler;
    this.initialize();
  }

  /**
   * Initialize workarea
   *
   */
  initialize = () => {
    const { workareaOption, workarea } = this.handler;
    this.handler.workarea = new fabric.Rect({
      width: workareaOption.width,
      height: workareaOption.height,
      strokeWidth: 0,
      ...workareaOption,
    });

    const { fill, backgroundColor } = this.handler.workarea;

    if (fill && (fill.type === "linear" || fill.type === "radial")) {
      this.backgroundGradientColor(fill, "commit", false);
    } else if (fill && (fill?.type === "pattern" || fill?.src)) {
      this.setImagePattern(this.handler.workarea, false);
    } else if (backgroundColor) {
      this.handler.workarea.set({
        backgroundColor: backgroundColor,
        src: null,
        fill: null,
      });
    }

    if (!workarea) {
      this.handler.canvas.add(this.handler.workarea);
    }
    this.handler.objects = this.handler.getObjects();
    this.handler.canvas.centerObject(this.handler.workarea);
    this.handler.workarea.setCoords();
    this.handler.canvas.renderAll();
  };

  setImagePattern = async (objectPayload, loaded = false) => {
    if (isEmpty(objectPayload)) {
      return;
    }
    const { canvas, workarea } = this.handler;

    const imageFromUrl = (src) => {
      return new Promise((resolve, reject) => {
        fabric.Image.fromURL(
          src,
          (fImageObj, isError) => {
            if (isError) {
              // Provided src is invalid. So replace with blank image object to avoid application crash. And report issue to get to know which image URL is broken.
              Sentry.captureMessage(
                `Invalid background pattern data or invalid image src: ${workarea.toJSON(
                  this.handler.propertiesToInclude,
                  this.handler.propertiesToExclude
                )}`
              );
              const image = new Image();
              fImageObj = new fabric.Image(image, {
                width: workarea.width,
                height: workarea.height,
              });
            }

            // Workarea size
            let width = workarea.width * workarea.scaleX;
            let height = workarea.height * workarea.scaleY;
            let workareaAspectRatio = width / height;

            // Image size
            let imageHeight = fImageObj.height;
            let imageWidth = fImageObj.width;
            let imageAspectRatio = imageWidth / imageHeight;

            if (workareaAspectRatio > imageAspectRatio) {
              fImageObj.scaleToWidth(width);
            } else if (workareaAspectRatio < imageAspectRatio) {
              fImageObj.scaleToHeight(height);
            } else {
              fImageObj.scaleToWidth(width);
            }

            imageWidth = fImageObj.getScaledWidth();
            imageHeight = fImageObj.getScaledHeight();

            if (objectPayload.filters) {
              fImageObj.set({
                filters: this.handler.imageHandler.createFilters(
                  objectPayload.filters
                ),
              });
              fImageObj.applyFilters();
            }

            let patternSourceCanvas = new fabric.StaticCanvas();
            patternSourceCanvas.setDimensions({
              width: imageWidth,
              height: imageHeight,
            });
            // Match lowerCanvasEl size with image size
            patternSourceCanvas.lowerCanvasEl.width = imageWidth;
            patternSourceCanvas.lowerCanvasEl.height = imageHeight;
            patternSourceCanvas.add(fImageObj);
            patternSourceCanvas.centerObject(fImageObj);
            fImageObj.setCoords();
            let patternElement = patternSourceCanvas.getElement();
            patternSourceCanvas.renderAll();

            let imagePattern = null;

            if (loaded && workarea.fill) {
              let { offsetX, offsetY, repeat, crossOrigin, patternTransform } =
                workarea.fill;
              imagePattern = new fabric.Pattern({
                source: patternElement,
                src: src,
                offsetX,
                offsetY,
                repeat,
                crossOrigin,
                patternTransform,
              });
            } else {
              imagePattern = new fabric.Pattern({
                source: patternElement,
                repeat: "no-repeat",
                crossOrigin: "anonymous",
                src: src,
                offsetX: -(patternSourceCanvas.width - width) / 2, // TODO: To move the backgroudn image here and there change offsetX and offsetY or it should be controlable from outside.
                offsetY: -(patternSourceCanvas.height - height) / 2,
              });

              // Set filter and flipX and flipY property to workarea
              workarea.set({
                filters: objectPayload.filters,
                flipX: objectPayload?.flipX,
                flipY: objectPayload?.flipY,
              });
            }

            workarea.set({
              fill: imagePattern,
              backgroundColor: null,
            });

            canvas.centerObject(workarea);
            workarea.setCoords();
            canvas.requestRenderAll();
            resolve(workarea);
          },
          {
            crossOrigin: "anonymous",
          }
        );
      });
    };

    let source = objectPayload.src;
    if (!source && objectPayload.fill && objectPayload.fill.src) {
      source = objectPayload.fill.src;
    }

    return imageFromUrl(source);
  };

  /**
   * Calculate scale to the image
   *
   * @param {FabricImage} [image]
   * @returns
   */
  calculateScale = (image) => {
    const { canvas, workarea } = this.handler;
    const { width: workareaWidth, height: workareaHeight } = workarea;
    const { _element } = image || workarea;
    const width = _element?.width || workareaWidth;
    const height = _element?.height || workareaHeight;
    let scaleX = canvas.getWidth() / width;
    let scaleY = canvas.getHeight() / height;
    if (height >= width) {
      scaleX = scaleY;
      if (canvas.getWidth() < width * scaleX) {
        scaleX = scaleX * (canvas.getWidth() / (width * scaleX));
      }
    } else {
      scaleY = scaleX;
      if (canvas.getHeight() < height * scaleX) {
        scaleX = scaleX * (canvas.getHeight() / (height * scaleX));
      }
    }
    return { scaleX, scaleY };
  };

  backgroundColor = (backgroundColor) => {
    if (this.handler.workarea) {
      this.handler.workarea.set({ backgroundColor, fill: null });
      this.handler.canvas.requestRenderAll();
      this.handler.canvas.fire("object:modified", {
        target: this.handler.workarea,
      });
    }
  };

  backgroundGradientColor = (
    gradientData,
    method = "commit",
    loaded = false
  ) => {
    var colorStopsArray = adjustColorOffsets(gradientData.colorStops);
    var gradientCoords;

    let gradientAngle;
    if (gradientData.degree || gradientData.degree >= 0) {
      gradientAngle = gradientData.degree;
    } else {
      gradientAngle = this.handler.workarea.userProperty["gradientAngle"];
    }

    gradientCoords = {
      start: angleToRect(
        gradientAngle - 90,
        this.handler.workarea.width,
        this.handler.workarea.height
      ),
    };
    gradientCoords["end"] = {
      x: this.handler.workarea.width - gradientCoords.start.x,
      y: this.handler.workarea.height - gradientCoords.start.y,
    };

    if (this.handler.workarea) {
      var tldrGradient = new fabric.Gradient({
        type: "linear",
        coords: {
          x1: gradientCoords.start.x,
          y1: gradientCoords.start.y,
          x2: gradientCoords.end.x,
          y2: gradientCoords.end.y,
        },
        colorStops: colorStopsArray,
      });
      this.handler.workarea.set({
        fill: tldrGradient,
        backgroundColor: null,
      });

      if (loaded) {
        this.handler.workarea.set({
          userProperty: {
            gradientAngle: gradientAngle,
          },
        });
      }
      this.handler.canvas.requestRenderAll();

      if (method === "push") {
        this.handler.canvas.fire("object:modified", {
          target: this.handler.workarea,
        });
      }
    }
  };

  adjustColorOffsets = (colorsData) => {
    var newData = [];
    colorsData.forEach((color) => {
      newData.push({
        ...color,
        offset: color.offset > 1 ? color.offset / 100 : color.offset,
      });
    });

    return newData;
  };

  clear = () => {
    this.handler.workarea = null;
    this.handler.workareaOption = Object.assign({}, defaultWorkareaOption);
  };
}

export default WorkareaHandler;
