import { fabric } from "fabric";
import { defaultMaskImage, MASK_INTERACTION } from "../constants/defaults";
import { FABRIC_TEXT_TYPES } from "../../details/constants";
import { isURL } from "../../../_utils/common";
import * as Sentry from "@sentry/react";

export default class MaskHandler {
  constructor(handler) {
    this.handler = handler;
    this.maskObject = null;
    this.maskImage = null;
    this.fillPattern = null;
  }

  getActiveTextElementObject = () => {
    const obj = this.handler.canvas.getActiveObject();
    if (FABRIC_TEXT_TYPES.includes(obj?.type)) {
      return obj;
    }
    return null;
  };

  validType = () => {
    const activeObject = this.handler.canvas.getActiveObject();
    if (!activeObject) {
      return false;
    }
    if (FABRIC_TEXT_TYPES.includes(activeObject?.type)) {
      return true;
    }
    return false;
  };

  start = async () => {
    if (this.validType()) {
      this.handler.interactionMode = MASK_INTERACTION;
      this.maskObject = this.getActiveTextElementObject();
      this.fillPattern = this.maskObject.fill;
      this.maskImage = await this.addMaskImage(this.maskObject);

      let target = this.maskObject;
      target.set({ fill: "rgba(0,0,0,1)" });
      this.maskObject = target;

      this.handler.canvas.setActiveObject(this.maskImage);
      this.maskObject.selectable = false;
      this.maskObject.evented = false;
      this.handler.canvas.renderAll();
    }
  };

  replaceMaskImage = (obj, imageData, offsetPoints, method = "commit") => {
    if (!obj) {
      return;
    }
    if (!isURL(imageData?.payload?.src)) {
      return;
    }

    obj
      .loadPhotoTextPatternImage(imageData?.payload?.src, offsetPoints)
      .then((photoTextObject) => {
        photoTextObject.set({
          userProperty: {
            source_id: imageData?.content?.source_id,
          },
        });
        if (method === "push") {
          this.handler.canvas.fire("text:changed", {
            target: photoTextObject,
            message: { content: { ...imageData?.content } },
          });
        }
      });
  };

  addMaskImage = async (textbox) => {
    let maskImage = defaultMaskImage.payload;
    maskImage = {
      ...maskImage,
      left: textbox.left,
      top: textbox.top,
      angle: textbox.angle,
      hasRotatingPoint: false,
      skewX: textbox.skewX,
      skewY: textbox.skewY,
      src: textbox.fill?.src,
      userProperty: {
        source_id: textbox?.userProperty?.source_id,
      },
    };
    maskImage.custtype = "maskImage";

    return new Promise((resolve) => {
      fabric.Image.fromURL(
        textbox.fill?.src,
        (img, isError) => {
          if (isError) {
            // Provided src is invalid. So replace with blank image object to avoid application crash. And report issue to get to know which image URL is broken.
            Sentry.captureMessage(
              `Invalid photo text pattern data or invalid image src: ${textbox.fill?.src}`
            );
            const image = new Image();
            img = new fabric.Image(image, {
              width: textbox.width,
              height: textbox.height,
            });
          }

          img.set({
            ...maskImage,
          });

          // Textbox size
          let width = textbox.width * textbox.scaleX;
          let height = textbox.height * textbox.scaleY;
          let textboxAspectRatio = width / height;

          // Image size
          let imageHeight = img.height;
          let imageWidth = img.width;
          let imageAspectRatio = imageWidth / imageHeight;

          if (textboxAspectRatio > imageAspectRatio) {
            img.scaleToWidth(width);
          } else if (textboxAspectRatio < imageAspectRatio) {
            img.scaleToHeight(height);
          } else {
            img.scaleToWidth(width);
          }

          let maskImageObj = this.handler.add(img, false, true);
          maskImageObj.hasControls = false;
          this.handler.canvas.renderAll();
          resolve(maskImageObj);
        },
        {
          crossOrigin: "anonymous",
        }
      );
    });
  };

  removeMaskImage = () => {
    this.maskImage = this.handler.maskHandler.maskImage;
    this.maskObject.selectable = true;
    this.maskObject.evented = true;

    if (this.maskObject) {
      this.handler.canvas.setActiveObject(this.maskObject);
    }

    if (this.maskImage) {
      this.handler.canvas.remove(this.maskImage);
    }
    this.maskImage = null;
    this.handler.canvas.renderAll();
  };

  finish = () => {
    this.handler.interactionMode = "selection";
    let image = this.maskImage;
    let target = this.maskObject;

    if (!target) {
      return;
    }

    this.fillPattern.offsetX = (image.left - target.left) / target.scaleX;
    this.fillPattern.offsetY = (image.top - target.top) / target.scaleY;

    target.set({
      fill: this.fillPattern,
      oldFillPatternOffsetX: (image.left - target.left) / target.scaleX,
      oldFillPatternOffsetY: (image.top - target.top) / target.scaleY,
    });

    this.handler.canvas.fire("object:modified", { target: target });
    this.removeMaskImage();
  };

  cancel = () => {
    this.handler.interactionMode = "selection";
    let image = this.maskImage;
    let target = this.maskObject;

    if (!target) {
      return;
    }

    const imageData = {
      payload: {
        ...image,
      },
      content: {
        source_id: image?.userProperty?.source_id,
      },
    };

    this.replaceMaskImage(
      target,
      imageData,
      { offsetX: 0, offsetY: 0 },
      "commit"
    );
    this.removeMaskImage();
  };

  delete = () => {
    this.handler.interactionMode = "selection";
    let target = this.maskObject;

    if (!target) {
      return;
    }

    target.set({ fill: "rgba(0,0,0,1)" });
    this.handler.canvas.fire("text:changed", { target: target });

    this.removeMaskImage();
  };
}
