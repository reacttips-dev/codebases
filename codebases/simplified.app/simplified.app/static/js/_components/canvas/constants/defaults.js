import {
  DEFAULT_AUDIO_VOLUME,
  WORKAREA_LAYOUT_FIXED,
} from "../../../_utils/constants";
import {
  FABRIC_CIRCLE_ELEMENT,
  FABRIC_IMAGE_ELEMENT,
  FABRIC_PHOTOTEXT_ELEMENT,
  FABRIC_RECT_ELEMENT,
  FABRIC_TEXTBOX_ELEMENT,
} from "../../details/constants";
import { primary } from "../../styled/variable";

export const defaultCanvasOption = {
  preserveObjectStacking: true,
  width: 300,
  height: 150,
  selection: true,
  defaultCursor: "default",
  backgroundColor: "#1e1e1e",
  controlsAboveOverlay: true,
};

export const defaultOption = {
  fill: "rgba(0, 0, 0, 1)",
  resource: {},
  link: {
    enabled: false,
    type: "resource",
    state: "new",
    dashboard: {},
  },
  tooltip: {
    enabled: true,
    type: "resource",
    template: "<div>{{message.name}}</div>",
  },
  userProperty: {},
  trigger: {
    enabled: false,
    type: "alarm",
    script: "return message.value > 0;",
    effect: "style",
  },
};

export const defaultWorkareaOption = {
  width: 800,
  height: 400,
  lockScalingX: true,
  lockScalingY: true,
  scaleX: 1,
  scaleY: 1,
  originX: "left",
  originY: "top",
  backgroundColor: "#fff",
  hasBorders: false,
  hasControls: false,
  selectable: false,
  lockMovementX: true,
  lockMovementY: true,
  hoverCursor: "default",
  name: "",
  id: "workarea",
  type: FABRIC_RECT_ELEMENT,
  layout: WORKAREA_LAYOUT_FIXED, // fixed, responsive, fullscreen
  link: {},
  tooltip: {
    enabled: false,
  },
  isElement: false,
  userProperty: {},
};

export const defaultGridOption = {
  enabled: false,
  grid: 10,
  snapToGrid: false,
  lineColor: "#ebebeb",
  borderColor: "#cccccc",
};

export const defaultTextItem = {
  name: "Text",
  description: "",
  type: "text",
  icon: {
    prefix: "fas",
    name: "font",
  },
  option: {
    originX: "left",
    originY: "top",
    type: FABRIC_TEXTBOX_ELEMENT,
    text: "Hello world!",
    textAlign: "center",
    fontSize: 32,
    fontFamily: "Rubik",
    fontWeight: 400,
    fontStyle: "normal",
    name: "New text",
    lineHeight: 1,
    editingBorderColor: "rgba(255, 172, 65, 0.4)",
  },
};

export const defaultHeaderTextItem = {
  mime: "text",
  content: {},
  payload: {
    originX: "left",
    originY: "top",
    type: FABRIC_TEXTBOX_ELEMENT,
    text: "HEADING TEXT",
    fontSize: 50,
    textAlign: "center",
    name: "New text",
    fontFamily: "Rubik",
    fontWeight: 700,
    fontStyle: "normal",
    fill: "rgba(0, 0, 0, 1)",
    lineHeight: 1,
    editingBorderColor: "rgba(255, 172, 65, 0.4)",
  },
};

export const defaultSubHeadingTextItem = {
  mime: "text",
  content: {},
  payload: {
    originX: "left",
    originY: "top",
    type: FABRIC_TEXTBOX_ELEMENT,
    textAlign: "center",
    text: "Subheading Text",
    fontSize: 30,
    name: "New text",
    fontFamily: "Rubik",
    fontWeight: 500,
    fontStyle: "normal",
    fill: "rgba(0, 0, 0, 1)",
    lineHeight: 1,
    editingBorderColor: "rgba(255, 172, 65, 0.4)",
  },
};

export const addTextItem = {
  mime: "text",
  content: {},
  payload: {
    originX: "left",
    originY: "top",
    id: "addText",
    type: FABRIC_TEXTBOX_ELEMENT,
    text: "+\nAdd Text",
    fontSize: 28,
    name: "addText",
    fontFamily: "Rubik",
    fontWeight: 500,
    fontStyle: "normal",
    selectable: false,
    textAlign: "center",
    fill: "#888888",
    lineHeight: 1,
    editingBorderColor: "rgba(255, 172, 65, 0.4)",
    editable: false,
    width: 500,
  },
};

export const defaultBodyTextItem = {
  mime: "text",
  content: {},
  payload: {
    originX: "left",
    originY: "top",
    type: FABRIC_TEXTBOX_ELEMENT,
    text: "Body Text",
    fontSize: 20,
    name: "New text",
    fontFamily: "Rubik",
    fontWeight: 400,
    lineHeight: 1,
    fontStyle: "normal",
    editingBorderColor: "rgba(255, 172, 65, 0.4)",
  },
};

export const defaultCircleShapeItem = {
  mime: "shape",
  content: {},
  payload: {
    originX: "left",
    originY: "top",
    type: FABRIC_CIRCLE_ELEMENT,
    radius: 256,
    name: "New Shape",
    fill: "rgb(255, 172, 65)",
  },
};

export const defaultRectShapeItem = {
  mime: "shape",
  content: {},
  payload: {
    originX: "left",
    originY: "top",
    type: FABRIC_RECT_ELEMENT,
    height: 256,
    width: 512,
    name: "New Shape",
    fill: "rgb(255, 172, 65)",
  },
};

export const defaultGuidelineOption = {
  enabled: true,
};

export const defaultActiveSelectionOption = {
  hasControls: true,
  cornerStyle: "circle",
  borderColor: "rgb(255, 172, 65)",
  cornerColor: "white",
  cornerStrokeColor: "rgba(57, 76, 96, 0.15)",
  borderScaleFactor: 3,
  borderOpacityWhenMoving: 1,
  transparentCorners: false,
};

export const defaultKeyEvent = {
  move: true,
  all: true,
  copy: true,
  paste: true,
  esc: true,
  del: true,
  clipboard: true,
  transaction: true,
  zoom: true,
  cut: true,
};

export const defaultPropertiesToInclude = [
  "id",
  "name",
  "locked",
  "editable",
  "editingBorderColor",
  "style",
];

export const defaultFontHandlerOption = {
  clearCache: true,
};

export const propertiesToInclude = [
  "id",
  "name",
  "locked",
  "file",
  "src",
  "link",
  "tooltip",
  "animation",
  "layout",
  "workareaWidth",
  "workareaHeight",
  "videoLoadType",
  "autoplay",
  "shadow",
  "muted",
  "loop",
  "code",
  "icon",
  "userProperty",
  "trigger",
  "configuration",
  "superType",
  "points",
  "svg",
  "loadType",
  "cover",
  "oldWidth",
  "oldHeight",
  "oldScaleX",
  "oldScaleY",
  "slideDuration",
  "startTime",
  "endTime",
  "video_src",
  "fillMapping",
  "isReplacement",
  "fontId",
  "oldFillPatternOffsetX",
  "oldFillPatternOffsetY",
];

export const defaultPropertiesToExclude = ["objects"];

export const defaultObjectOption = {
  rotation: 0,
  centeredRotation: true,
  strokeUniform: true,
  editingBorderColor: "rgba(255, 172, 65, 0.4)",
};

export const defaultPagePayload = {
  type: FABRIC_IMAGE_ELEMENT,
  originX: "left",
  originY: "top",
  left: 0,
  top: 0,
  width: 1080,
  height: 1920,
  backgroundColor: "rgba(255,255,255,1)",
};

export const CROP_INTERACTION = "crop";
export const MASK_INTERACTION = "mask";
export const INTERACTION_SELECTION = "selection";
export const INTERACTION_PREVIEW = "preview";

export const defaultCropRect = {
  payload: {
    type: FABRIC_RECT_ELEMENT,
    strokeWidth: 1,
    fill: primary,
    opacity: 0.5,
    selectable: true,
    id: "cropRect",
    hasRotatingPoint: false,
    lockRotation: true,
  },
};

export const defaultClipRect = {
  payload: {
    strokeWidth: 1,
    fill: primary,
    opacity: 0.5,
    selectable: true,
    id: "cropRect",
    hasRotatingPoint: false,
  },
};

export const defaultPhotoTextItem = {
  mime: "text",
  content: {"source":"unsplash", "source_url":"https://images.unsplash.com/photo-1541661538396-53ba2d051eed?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=282&q=80",},
  payload: {
    originX: "left",
    originY: "top",
    type: FABRIC_PHOTOTEXT_ELEMENT,
    text: "PHOTO TEXT",
    fontSize: 50,
    textAlign: "center",
    name: "New photo text",
    fontFamily: "Rubik",
    fontWeight: 700,
    fontStyle: "normal",
    fill: {
      src: "https://images.unsplash.com/photo-1541661538396-53ba2d051eed?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=282&q=80",
    },
    lineHeight: 1,
    editingBorderColor: "rgba(255, 172, 65, 0.4)",
  },
};

export const defaultMaskImage = {
  payload: {
    name: "New Image",
    type: FABRIC_IMAGE_ELEMENT,
    opacity: 0.5,
    selectable: true,
    id: "cropRect",
  },
};

export const defaultMusicPayload = {
  mime: "story_music",
  title: "",
  src: null,
  duration: 0,
  volume: DEFAULT_AUDIO_VOLUME,
  bpm: null, // Optional
  source: null, // Optional
  source_id: null, // Optional
  source_url: null, // Optional
  meta: {}, // Optional
};
