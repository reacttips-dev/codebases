import { fabric } from "fabric";
import { toObject } from "../utils/ObjectUtil";
import { findIndex, isEqual } from "lodash";

const Svg = fabric.util.createClass(fabric.Group, {
  type: "svg",
  initialize(option) {
    const { svg, loadType, onLoaded, loaded } = option;
    this.callSuper("initialize", [], option);
    this.loadSvg(svg, loadType).then(() => {
      if (onLoaded) {
        onLoaded(this, loaded);
      }
    });
  },
  addSvgElements(objects, options, path) {
    // Create object using object path
    const createdObj = fabric.util.groupSVGElements(objects, options, path);
    this.set(options);

    // To maintain color mapping of path's orignal color vs replaced color
    this.fillMapping = this.fillMapping || [];

    if (createdObj.getObjects) {
      let objects = createdObj.getObjects();
      objects.forEach((obj, index) => {
        this.createFillMapping(obj);
        this.add(obj);
      });
    } else {
      createdObj.set({
        originX: "center",
        originY: "center",
      });
      this.createFillMapping(createdObj);
      this.add(createdObj);
    }
    this.setCoords();

    if (this.canvas) {
      this.canvas.requestRenderAll();
    }
  },
  haveObjectFillColorInOrignalFillMapping(object) {
    return findIndex(this.fillMapping, (fillMap) => {
      return fillMap?.orignalFill === object.fill;
    });
  },
  createFillMapping(object) {
    const mappingIndex = this.haveObjectFillColorInOrignalFillMapping(object);
    if (mappingIndex === -1) {
      this.fillMapping.push({
        orignalFill: object.fill,
        replaceFill: object.fill,
      });
      object.orignalFill = object.fill;

      object.stroke = this.stroke;
      object.strokeWidth = this.strokeWidth;
    } else {
      object.fill = this.fillMapping[mappingIndex]?.replaceFill || object.fill;
      object.orignalFill =
        this.fillMapping[mappingIndex]?.orignalFill || object.fill;
      object.stroke = this.stroke;
      object.strokeWidth = this.strokeWidth;
    }
  },
  updateFillMapping(colorMap, color) {
    const index = findIndex(this.fillMapping, (fillMap) =>
      isEqual(fillMap, colorMap)
    );

    if (index > -1) {
      this.fillMapping[index].replaceFill = color;
    }
  },
  loadSvg(svg, loadType) {
    return new Promise((resolve) => {
      if (loadType === "svg") {
        fabric.loadSVGFromString(svg, (objects, options) => {
          resolve(this.addSvgElements(objects, options, svg));
        });
      } else {
        fabric.loadSVGFromURL(svg, (objects, options) => {
          resolve(this.addSvgElements(objects, options, svg));
        });
      }
    });
  },
  toObject(propertiesToInclude = []) {
    return toObject(this, propertiesToInclude, {
      svg: this.get("svg"),
      loadType: this.get("loadType"),
      animation: this.get("animation"),
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
  _render(ctx) {
    this.callSuper("_render", ctx);
  },
});

Svg.fromObject = (option, callback) => {
  return callback(new Svg(option));
};

window.fabric.Svg = Svg;

export default Svg;
