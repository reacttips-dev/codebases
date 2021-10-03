import SuperHandler from "./SuperHandler";
import { fabric } from "fabric";
import {
  WORKAREA_LAYOUT_FIXED,
  WORKAREA_LAYOUT_RESPONSIVE,
} from "../../../_utils/constants";

export default class StaticHandler extends SuperHandler {
  constructor(options) {
    super(options);
    this.handlerName = "StaticHandler";
    this.initialize(options);
  }

  initialize = (options) => {
    this.initOption(options);
    this.initCallback(options);
    this.initHandler();
  };

  initOption = (options) => {};

  initCallback = (options) => {};

  initHandler = () => {};

  // /**
  //  * Import json
  //  * @param {*} json
  //  * @param {(canvas: FabricCanvas) => void} [callback]
  //  */
  importJSON = async (json, callback) => {
    if (!json) {
      return;
    }
    if (typeof json === "string") {
      json = JSON.parse(json);
    }
    let prevLeft = 0;
    let prevTop = 0;
    this.canvas.setBackgroundColor(
      this.canvasOption.backgroundColor,
      this.canvas.renderAll.bind(this.canvas)
    );

    this.canvas.on({
      "object:render:finished": this.objectRenderFinish,
    });

    const workareaExist = json.filter((obj) => obj.id === "workarea");
    if (!this.workarea) {
      this.workareaHandler.initialize();
    }
    if (!workareaExist.length) {
      this.canvas.centerObject(this.workarea);
      this.workarea.setCoords();
      prevLeft = this.workarea.left;
      prevTop = this.workarea.top;
    } else {
      const workarea = workareaExist[0];
      prevLeft = workarea.left;
      prevTop = workarea.top;
      this.workarea.set(workarea);
      if (this.workarea.fill && this.workarea.fill.type === "pattern") {
        await this.workareaHandler.setImagePattern(workarea, false);
      } else if (
        this.workarea.fill &&
        (this.workarea.fill.type === "linear" ||
          this.workarea.fill.type === "radial")
      ) {
        this.workareaHandler.backgroundGradientColor(
          workarea.fill,
          "commit",
          false
        );
      }
      this.workarea.setCoords();
    }
    json.forEach((obj) => {
      if (obj.id === "workarea") {
        return;
      }
      const canvasWidth = this.canvas.getWidth();
      const canvasHeight = this.canvas.getHeight();
      const { width, height, scaleX, scaleY, layout, left, top } =
        this.workarea;
      if (layout === "fullscreen") {
        const leftRatio = canvasWidth / (width * scaleX);
        const topRatio = canvasHeight / (height * scaleY);
        obj.left *= leftRatio;
        obj.top *= topRatio;
        obj.scaleX *= leftRatio;
        obj.scaleY *= topRatio;
      } else {
        const diffLeft = left - prevLeft;
        const diffTop = top - prevTop;
        obj.left += diffLeft;
        obj.top += diffTop;
      }
      if (obj.superType === "element") {
        // obj.id = v4();
      }
      this.add(obj, false, true);
      this.canvas.requestRenderAll();
    });
    this.objects = this.getObjects();
    if (callback) {
      callback(this.canvas);
    }
    return Promise.resolve(this.canvas);
  };

  objectRenderFinish = (event) => {
    const { target } = event;
    // If object is part of group
    if (target?.group) {
      const fGroupObj = target.group;
      fGroupObj.addWithUpdate();
      this.canvas.renderAll();
    }
  };

  resize = (nextWidth, nextHeight) => {
    this.canvas.setWidth(nextWidth).setHeight(nextHeight);

    this.canvas.setBackgroundColor(
      this.canvasOption.backgroundColor,
      this.canvas.renderAll.bind(this.canvas)
    );

    if (!this.workarea) {
      return;
    }

    let workareaOldLeft = this.workarea.left;
    let workareaOldTop = this.workarea.top;

    this.workarea.set({
      scaleX: this.globalScale,
      scaleY: this.globalScale,
    });

    const diffWidth = nextWidth / 2 - this.width / 2;
    const diffHeight = nextHeight / 2 - this.height / 2;

    this.width = nextWidth;
    this.height = nextHeight;
    if (this.workarea.layout === WORKAREA_LAYOUT_FIXED) {
      this.canvas.centerObject(this.workarea);
      this.workarea.setCoords();

      this.canvas.getObjects().forEach((obj) => {
        if (obj.id !== "workarea") {
          const left = (obj.left - workareaOldLeft) * this.globalScale;
          const top = (obj.top - workareaOldTop) * this.globalScale;
          obj.set({
            left,
            top,
          });
          obj.set({
            // left: 0,
            // top: 0,
            scaleX: obj.scaleX * this.globalScale,
            scaleY: obj.scaleY * this.globalScale,
          });
          // PATCH: Object stroke width should affect via globalScale
          if (obj.strokeWidth) {
            obj.set({
              strokeWidth: obj.strokeWidth * this.globalScale,
            });
          }

          obj.setCoords();
          if (obj.superType === "element") {
            const { id } = obj;
            const el = this.elementHandler.findById(id);
            // update the element
            this.elementHandler.setPosition(el, obj);
          }
        }
      });

      this.canvas.requestRenderAll();
      return;
    }
    if (this.workarea.layout === WORKAREA_LAYOUT_RESPONSIVE) {
      const { scaleX } = this.workareaHandler.calculateScale();
      const center = this.canvas.getCenter();
      const deltaPoint = new fabric.Point(diffWidth, diffHeight);
      this.canvas.relativePan(deltaPoint);
      if (this.zoomHandler) {
        this.zoomHandler.zoomToPoint(
          new fabric.Point(center.left, center.top),
          scaleX
        );
      }
      return;
    }
    const scaleX = nextWidth / this.workarea.width;
    const scaleY = nextHeight / this.workarea.height;
    const diffScaleX = nextWidth / (this.workarea.width * this.workarea.scaleX);
    const diffScaleY =
      nextHeight / (this.workarea.height * this.workarea.scaleY);
    this.workarea.set({
      scaleX,
      scaleY,
    });
    this.canvas.getObjects().forEach((obj) => {
      const { id } = obj;
      if (obj.id !== "workarea") {
        const left = obj.left * diffScaleX * this.globalScale;
        const top = obj.top * diffScaleY * this.globalScale;
        const newScaleX = obj.scaleX * diffScaleX * this.globalScale;
        const newScaleY = obj.scaleY * diffScaleY * this.globalScale;
        obj.set({
          scaleX: newScaleX,
          scaleY: newScaleY,
          left,
          top,
        });
        obj.setCoords();
        if (obj.superType === "element") {
          const video = obj;
          const { width, height } = obj;
          const el = this.elementHandler.findById(id);
          this.elementHandler.setSize(el, obj);
          if (video.player) {
            video.player.setPlayerSize(width, height);
          }
          this.elementHandler.setPosition(el, obj);
        }
      }
    });
    this.canvas.renderAll();
  };
}
