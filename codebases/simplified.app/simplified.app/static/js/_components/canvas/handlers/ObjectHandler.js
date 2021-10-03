import { fabric } from "fabric";
import { isEmpty } from "lodash";
import { adjustColorOffsets, angleToRect } from "../../../_utils/common";
import {
  FABRIC_SVG_ELEMENT,
  FABRIC_TEXT_TYPES,
  FABRIC_VIDEO_ELEMENT,
} from "../../details/constants";

export default class ObjectHandler {
  constructor(handler) {
    this.handler = handler;
    this.initialize();
  }

  initialize = () => {};

  dropShadow = (shadow, method) => {
    let obj = this.handler.canvas.getActiveObject();
    if (!obj) {
      return;
    }

    if (shadow.checked) {
      obj.set("shadow", shadow);
    } else {
      obj.set("shadow", null);
    }

    this.handler.canvas.renderAll();
    if (method === "push") {
      this.handler.canvas.fire("object:modified", { target: obj });
    }
  };

  opacity = (opacity, method) => {
    const activeObject = this.handler.canvas.getActiveObject();
    if (activeObject) {
      this.handler.set("opacity", opacity);
      this.handler.canvas.requestRenderAll();

      if (activeObject.superType === "element") {
        activeObject.element.style.opacity = opacity;
      }
    }
  };

  rotation = (angle, method) => {
    const activeObject = this.handler.canvas.getActiveObject();
    if (activeObject) {
      activeObject.rotate(angle);
      this.handler.canvas.requestRenderAll();

      if (method === "push") {
        this.handler.canvas.fire("object:modified", { target: activeObject });
      }
    }
  };

  flipX = (value) => {
    this.handler.set("flipX", value);
  };

  flipY = (value) => {
    this.handler.set("flipY", value);
  };

  backgroundColor = (backgroundColor) => {
    this.handler.set("backgroundColor", backgroundColor);
  };

  strokeColor = (strokeColor, activeElement) => {
    const activeObject = this.handler.canvas.getActiveObject();
    const { textHandler } = this.handler;

    if (activeObject) {
      if (activeObject.type === FABRIC_SVG_ELEMENT) {
        let elementFormat = activeElement.format;
        let svg = elementFormat.svg;
        let objects = activeObject.getObjects();

        objects.forEach((object) => {
          object.set({ stroke: strokeColor });
        });

        activeObject.stroke = strokeColor;

        this.handler.set("objects", objects);
        this.handler.set("svg", svg);
      } else if (FABRIC_TEXT_TYPES.includes(activeObject.type)) {
        if (textHandler) {
          textHandler.applyStyleToSelection({ stroke: strokeColor });
        }
      } else {
        activeObject.set("stroke", strokeColor);
        this.handler.set("stroke", strokeColor);
      }
      this.handler.canvas.requestRenderAll();
    }
  };

  strokeWidth = (value, activeElement) => {
    const activeObject = this.handler.canvas.getActiveObject();
    const { textHandler } = this.handler;

    if (activeObject) {
      if (activeObject.type === FABRIC_SVG_ELEMENT) {
        let elementFormat = activeElement.format;
        let svg = elementFormat.svg;
        let objects = activeObject.getObjects();

        objects.forEach((object) => {
          object.set({ strokeWidth: value });
        });

        activeObject.strokeWidth = value;

        this.handler.set("objects", objects);
        this.handler.set("svg", svg);
      } else if (FABRIC_TEXT_TYPES.includes(activeObject.type)) {
        if (textHandler) {
          textHandler.applyStyleToSelection({ strokeWidth: value });
        }
      } else {
        activeObject.set("strokeWidth", value);
        this.handler.set("strokeWidth", value);
      }
      this.handler.canvas.requestRenderAll();
    }
  };

  alignTop = () => {
    const activeObject = this.handler.canvas.getActiveObject();
    if (activeObject) {
      this.handler.set("top", this.handler.workarea.top);
      this.handler.set();
      this.handler.canvas.requestRenderAll();
    }
  };

  alignMiddle = () => {
    const activeObject = this.handler.canvas.getActiveObject();
    if (activeObject) {
      this.handler.canvas.viewportCenterObjectV(activeObject);
      this.handler.set();
      this.handler.canvas.requestRenderAll();
    }
  };

  alignBottom = () => {
    const activeObject = this.handler.canvas.getActiveObject();
    if (activeObject) {
      this.handler.set(
        "top",
        this.handler.workarea.top +
          (this.handler.workarea.height -
            activeObject.height * activeObject.scaleY)
      );
      this.handler.set();
      this.handler.canvas.requestRenderAll();
    }
  };

  alignLeft = () => {
    const activeObject = this.handler.canvas.getActiveObject();
    if (activeObject) {
      this.handler.set("left", this.handler.workarea.left);
      this.handler.set();
      this.handler.canvas.requestRenderAll();
    }
  };

  alignCenter = () => {
    const activeObject = this.handler.canvas.getActiveObject();
    if (activeObject) {
      this.handler.canvas.centerObjectH(activeObject);
      this.handler.set();
      this.handler.canvas.requestRenderAll();
    }
  };

  alignRight = () => {
    const activeObject = this.handler.canvas.getActiveObject();
    if (activeObject) {
      this.handler.set(
        "left",
        this.handler.workarea.left +
          (-activeObject.width * activeObject.scaleX +
            this.handler.workarea.width)
      );
      this.handler.set();
      this.handler.canvas.requestRenderAll();
    }
  };

  lock = () => {
    const activeObject = this.handler.canvas.getActiveObject();
    if (!activeObject) {
      return;
    }
    this.handler.canvas.discardActiveObject();
    activeObject.set("selectable", false);
    activeObject.set("editable", false);
    this.handler.onModified(activeObject);
    this.handler.onSelect(null);
    this.handler.onActiveLayer(null);
    this.handler.canvas.requestRenderAll();
  };

  unlock = (targetObject) => {
    if (targetObject) {
      this.handler.canvas.discardActiveObject();
      targetObject.set("selectable", true);
      targetObject.set("editable", true);
      this.handler.onModified(targetObject);
      this.handler.canvas.setActiveObject(targetObject);
      this.handler.onSelect(targetObject);
      this.handler.canvas.requestRenderAll();
    }
  };

  applyVideoFilter = (filter) => {
    const activeObject = this.handler.canvas.getActiveObject();
    if (!activeObject || activeObject.type !== FABRIC_VIDEO_ELEMENT) {
      return;
    }

    activeObject.set("style", {
      ...(activeObject.style || {}),
      filters:
        !filter || !filter.filter
          ? {}
          : {
              ...(activeObject.style && activeObject.style.filters
                ? activeObject.style.filters
                : ""),
              [filter.name]: filter,
            },
    });

    this.handler.canvas.fire("object:modified", { target: activeObject });
    this.handler.canvas.requestRenderAll();

    const el = this.handler.elementHandler.findById(activeObject.id);
    this.handler.elementHandler.setFilter(el, activeObject);
  };

  removeVideoFilter = (filter) => {
    const activeObject = this.handler.canvas.getActiveObject();
    if (
      !activeObject ||
      activeObject.type !== FABRIC_VIDEO_ELEMENT ||
      isEmpty(activeObject.style)
    ) {
      return;
    }

    let currentFilters = activeObject.style.filters;
    if (currentFilters[filter.name]) {
      delete currentFilters[filter.name];
    }

    activeObject.set("style", {
      ...(activeObject.style || {}),
      filters: currentFilters,
    });

    this.handler.canvas.fire("object:modified", { target: activeObject });
    this.handler.canvas.requestRenderAll();

    const el = this.handler.elementHandler.findById(activeObject.id);
    this.handler.elementHandler.setFilter(el, activeObject);
  };

  componentGradientColor = (gradientData, method = "commit") => {
    var colorStopsArray = adjustColorOffsets(gradientData.colorStops);
    var gradientCoords;

    let obj = this.handler.canvas.getActiveObject();
    if (!obj) {
      return;
    }

    let gradientAngle;
    if (gradientData.degree || gradientData.degree >= 0) {
      gradientAngle = gradientData.degree;
    } else {
      gradientAngle = obj.userProperty.gradientAngle;
    }

    gradientCoords = {
      start: angleToRect(gradientAngle - 90, obj.width, obj.height),
    };
    gradientCoords["end"] = {
      x: obj.width - gradientCoords.start.x,
      y: obj.height - gradientCoords.start.y,
    };
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

    if (obj.type === FABRIC_SVG_ELEMENT) {
      return tldrGradient;
    }

    obj.set({
      fill: tldrGradient,
      userProperty: {
        gradientAngle: gradientAngle,
      },
    });
    this.handler.canvas.requestRenderAll();

    if (method === "push") {
      this.handler.canvas.fire("object:modified", { target: obj });
    }
  };

  skew = (skewType, value, method) => {
    const activeObject = this.handler.canvas.getActiveObject();
    if (activeObject) {
      activeObject.set(skewType, value);
      this.handler.canvas.requestRenderAll();

      if (method === "push") {
        this.handler.canvas.fire("object:modified", { target: activeObject });
      }
    }
  };
}
