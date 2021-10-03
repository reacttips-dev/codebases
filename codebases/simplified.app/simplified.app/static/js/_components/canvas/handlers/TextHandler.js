import { fabric } from "fabric";
import { forOwn, isEmpty } from "lodash";
import { adjustColorOffsets, angleToRect } from "../../../_utils/common";
import {
  FABRIC_ITEXT_ELEMENT,
  FABRIC_TEXTBOX_ELEMENT,
  FABRIC_TEXT_TYPES,
} from "../../details/constants";
var FontFaceObserver = require("fontfaceobserver");

export const CHAR_SPACE_MULTIPLIER = 10;

export default class TextHandler {
  constructor(handler) {
    this.handler = handler;
    this.initialize();
  }

  initialize = () => {};

  getActiveTextElementObject = () => {
    const obj = this.handler.canvas.getActiveObject();
    if (FABRIC_TEXT_TYPES.includes(obj?.type)) {
      return obj;
    }
    return null;
  };

  applyStyleToObject = (object, style) => {
    forOwn(style, (value, key) => {
      object.set(key, value);
    });
  };

  addorUpdateStylesToObject = (obj, style) => {
    let selectionStyles = obj.getSelectionStyles();
    if (
      obj.type === FABRIC_ITEXT_ELEMENT ||
      obj.type === FABRIC_TEXTBOX_ELEMENT
    ) {
      if (selectionStyles.length > 0) {
        obj.setSelectionStyles(style);
      } else {
        obj.selectAll().setSelectionStyles(style);
        this.applyStyleToObject(obj, style);
      }
      if (
        selectionStyles.length > 0 &&
        obj?.text.length === obj.getSelectedText().length
      ) {
        this.applyStyleToObject(obj, style);
      }
    } else {
      this.applyStyleToObject(obj, style);
    }
  };

  applyStyleToSelection = (style) => {
    let obj = this.getActiveTextElementObject();
    if (!obj) {
      return;
    }
    this.addorUpdateStylesToObject(obj, style);
    // this is where the code was added
    fabric.charWidthsCache = {};

    this.handler.canvas.getActiveObject().initDimensions();
    this.handler.canvas.getActiveObject().setCoords();

    this.handler.canvas.requestRenderAll();
    this.handler.canvas.fire("text:changed", { target: obj });
  };

  applyPropertyToSelection = (attribute, value, changesType = "commit") => {
    let obj = this.getActiveTextElementObject();
    if (!obj) {
      return;
    }

    obj[attribute] = value;

    this.handler.canvas.requestRenderAll();
    if (changesType === "push") {
      this.handler.canvas.fire("text:changed", { target: obj });
    }
  };

  getStyleOfTextSelection = () => {
    const obj = this.getActiveTextElementObject();
    if (!obj) {
      return;
    }

    let styles = obj.getSelectionStyles();

    if (isEmpty(styles) && !isEmpty(obj.text)) {
      if (obj.selectionStart === 0 || obj.selectionStart === 1) {
        return obj.getSelectionStyles(0, 1);
      }
      return obj.getSelectionStyles(obj.selectionStart - 1, obj.selectionStart);
      // return obj.toJSON(this.handler.propertiesToInclude);
    } else {
      return styles;
    }
  };

  font = (fontFamily, fontWeight, fontId) => {
    const font = new FontFaceObserver(fontFamily, {
      weight: fontWeight,
    });

    font.load(null, 5000).then(
      () => {
        // Whenever font get change, change its fontweight to regular(400)
        this.applyStyleToSelection({
          fontFamily,
          fontWeight,
          fontId,
        });
        // fabric.util.clearFabricFontCache(fontFamily);
      },
      () => {
        console.error("Font is not available");
      }
    );
  };

  currentFontVariantExists = (fontWeight, variants) => {
    const currentFontVariant =
      fontWeight === 400 ? "regular" : fontWeight.toString();

    return variants.includes(currentFontVariant);
  };

  fontSize = (fontSize) => {
    this.applyStyleToSelection({ fontSize });
  };

  fontWeight = (fontWeight) => {
    this.applyStyleToSelection({ fontWeight });
  };

  bold = (fontWeight) => {
    this.applyStyleToSelection({ fontWeight });
  };

  italic = (value) => {
    this.applyStyleToSelection({ fontStyle: value });
  };

  underline = (underline) => {
    this.applyStyleToSelection({ underline });
  };

  strike = (linethrough) => {
    this.applyStyleToSelection({ linethrough });
  };

  textColor = (color) => {
    this.applyStyleToSelection({ fill: color });
  };

  textHighLightColor = (color) => {
    this.applyStyleToSelection({ textBackgroundColor: color });
  };

  opacity = (opacityValue) => {
    this.applyStyleToSelection({ opacity: opacityValue });
  };

  textAlign = (value) => {
    this.applyPropertyToSelection("textAlign", value, "push");
  };

  textLineHeight = (value, changesType) => {
    this.applyPropertyToSelection("lineHeight", value, changesType);
  };

  textLetterSpace = (value, changesType) => {
    this.applyPropertyToSelection(
      "charSpacing",
      value * CHAR_SPACE_MULTIPLIER,
      changesType
    );
  };

  textGradientColor = (gradientData, method = "commit") => {
    var colorStopsArray = adjustColorOffsets(gradientData.colorStops);
    var gradientCoords;

    let obj = this.getActiveTextElementObject();
    if (!obj) {
      return;
    }

    // remove fill property from obj.styles[0], obj.styles[1], ...
    obj.removeStyle("fill");

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

    obj.set({
      fill: tldrGradient,
      userProperty: {
        gradientAngle: gradientAngle,
      },
    });
    this.handler.canvas.requestRenderAll();

    if (method === "push") {
      this.handler.canvas.fire("text:changed", { target: obj });
    }
  };

  script = (scriptType, method) => {
    let obj = this.getActiveTextElementObject();
    if (!obj) {
      return;
    }

    if (method === "apply") {
      if (scriptType === "super") {
        obj.setSuperscript();
      } else if (scriptType === "sub") {
        obj.setSubscript();
      }
    } else if (method === "remove") {
      obj.setSelectionStyles({
        fontSize: undefined,
        deltaY: undefined,
      });
    }

    this.handler.canvas.requestRenderAll();
    this.handler.canvas.fire("text:changed", { target: obj });
  };

  getStyle = (currentFormat) => {
    const activeObj = this.handler.canvas.getActiveObject();
    if (
      activeObj?.type === FABRIC_TEXTBOX_ELEMENT ||
      activeObj?.type === FABRIC_ITEXT_ELEMENT
    ) {
      const activeSelectionStyle = this.getStyleOfTextSelection();
      if (!isEmpty(activeSelectionStyle)) {
        currentFormat = {
          ...currentFormat,
          ...activeSelectionStyle[0],
        };
      }
    }
    return currentFormat;
  };
}
