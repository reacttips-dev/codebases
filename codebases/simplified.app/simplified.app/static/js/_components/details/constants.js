import React from "react";
import { fabric } from "fabric";
import {
  faCaretDown,
  faCaretLeft,
  faCaretRight,
  faCaretUp,
  faFolderOpen,
  faCrown,
  faFont,
  faImage,
  faPlay,
  faEgg,
  faPuzzlePiece,
  faRedo,
  faEye,
  faDownload,
  faUserPlus,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BrandLogo from "../common/BrandLogo";

export const comboKey1 =
  window.navigator.appVersion.indexOf("Win") !== -1 ||
  window.navigator.appVersion.indexOf("X11") !== -1 ||
  window.navigator.appVersion.indexOf("Linux") !== -1
    ? "Ctrl"
    : "⌘";
export const comboKey2 =
  window.navigator.appVersion.indexOf("Win") !== -1 ||
  window.navigator.appVersion.indexOf("X11") !== -1 ||
  window.navigator.appVersion.indexOf("Linux") !== -1
    ? "Alt"
    : "⌥";

export const ADVANCED_ANIMATION_PANEL = "animations";
export const ADVANCED_COMMENTS_PANEL = "comments";
export const ADVANCED_EDITOR_PANEL = "editor";
export const ADVANCED_EDITOR_EDIT = "edit";
export const ADVANCED_EDITOR_EFFECTS = "effects";
export const ADVANCED_EDITOR_RESIZE = "resize";
export const ADVANCED_EDITOR_LAYERS = "layers";
export const ADVANCED_EDITOR_CLIP = "clip";

export const TEMPLATES_SLIDER_PANEL = "templates";
export const ASSETS_SLIDER_PANEL = "assets";
export const IMAGES_SLIDER_PANEL = "images";
export const GIPHY_SLIDER_PANEL = "giphy";
export const TEXT_SLIDER_PANEL = "text";
export const ICONS_SLIDER_PANEL = "icons";
export const VIDEO_SLIDER_PANEL = "video";
export const MUSIC_SLIDER_PANEL = "music";
export const ELEMENTS_SLIDER_PANEL = "elements";
export const ACTION_SLIDER_PANEL = "action";
export const FILTER_IN_DRAFT = "0";
export const FILTER_PUBLISHED = "1";
export const FILTER_ARCHIVED = "2";
export const ACTIVATE = "activate";
export const CHANGE = "change";
export const TAB_MY_STORIES = "stories";
export const TAB_TEMPLATES = "templates";
export const ABORT_FETCH_REQUEST_MESSAGE = "AbortError";
export const ABORT_AXIOS_REQUEST_MESSAGE = "The user aborted a request.";
export const AXIOS_NETWORK_ERROR = "Network Error";
export const FAILED_FETCH = "Failed to execute 'fetch' on 'Window'";
export const FAILED_TO_FETCH = "Failed to fetch";
export const FAILED_TO_FETCH_DATA =
  "Oops! Something went wrong while fetching data. Please check your network connection.";
export const FAILED_TO_FETCH_DATA_API =
  "Failed to fetch data. Please contact support.";
export const SET_OR_REPLACE_IMAGE = "image";
export const KEYBOARD_SHORTCUTS_PANEL = "keyboard";

export const TEMPLATE_PAGES = 0;
export const TEMPLATE_LAYERS = 1;
export const TEMPLATE_TEXT_BLOCK = 2;
export const TEMPLATE_STORY = 3;
export const TEMPLATE_POST = 4;
export const TEMPLATE_SHAPE = 5;
export const TEMPLATE_COVER = 6;
export const TEMPLATE_BANNER = 7;
export const TEMPLATE_BUSINESS_CARD = 8;
export const TEMPLATE_AD = 9;

export const ASSET_IMAGE = 0;
export const ASSET_VIDEO = 1;
export const ASSET_FONT = 2;
export const ASSET_GIF = 3;
export const ASSET_TEXT = 4;

export const DEFAULT_COLOR_PRESETS = [
  "TRANSPARENT",
  "#F5A623",
  "#F8E71C",
  "#8B572A",
  "#7ED321",
  "#417505",
  "#BD10E0",
  "#9013FE",
  "#4A90E2",
  "#50E3C2",
  "#B8E986",
  "#000000",
  "#4A4A4A",
  "#9B9B9B",
  "#FFFFFF",
];

export const DEFAULT_DROP_SHADOW_VALUES = {
  distance: 15,
  rotation: 15,
  blur: 10,
  color: "rgba(245, 166, 35, 1)",
};

export const STORY_BODY_NODE_ID = "slide-body-{0}";
export const ACTIVE_SELECTION = "activeSelection";
export const ACTIVE_GROUP = "group";

export const SELECTION = "selection";

export const PLACEHOLDER_IMAGE_SIZE = {
  story: {
    width: "108px",
    height: "192px",
  },
  cover: {
    width: "205px",
    height: "78px",
  },
  post: {
    width: "151px",
    height: "151px",
  },
  ad: {
    width: "240px",
    height: "125.6px",
  },
  app_ad: {
    width: "45px",
    height: "45px",
  },
  header_cover: {
    width: "205px",
    height: "78px",
  },
};

export const REMOTE_COLLOBORATION_BROADCAST_TEXT_CURSOR = "text_cursor";
export const REMOTE_COLLOBORATION_BROADCAST_MOUSE_POINTER = "mouse_pointer";
export const REMOTE_COLLOBORATION_BROADCAST_ACTION = "action";

export const ALIGN_LEFT = "left";
export const ALIGN_MIDDLE = "middle";
export const ALIGN_RIGHT = "right";
export const ALIGN_TOP = "top";
export const FLIPH = "flipX";
export const FLIPV = "flipY";
export const ALIGN_CENTER = "center";
export const ALIGN_BOTTOM = "bottom";

export const HEX_COLOR_REGEX = /^#[0-9a-f]{3,6}$/i; // this would match #abc, #abcd, #abcde, #abcdef
export const SLIDER_VALUE_REGEX = /^[-+]?\d+(\.\d+)?$/;

export const DOMAIN_0_TO_100 = [0, 100];
export const DOMAIN_0_TO_360 = [0, 360];
export const DOMAIN_NEG100_TO_100 = [-100, 100];
export const DOMAIN_0_TO_5 = [0, 5];
export const DOMAIN_0_TO_6000 = [0, 6000];
export const DOMAIN_1_TO_5 = [1, 5];
export const DOMAIN_0_TO_30 = [0, 30];
export const DOMAIN_NEG50_TO_50 = [-50, 50];
export const DOMAIN_0_TO_20 = [0, 20];

export const SLIDE = "slide";
export const STILL = "still";

export const FLY_IN = "fly_in";
export const FLY_OUT = "fly_out";
export const FLY_IN_TOP = `${FLY_IN}_top`;
export const FLY_IN_BOTTOM = `${FLY_IN}_bottom`;
export const FLY_IN_LEFT = `${FLY_IN}_left`;
export const FLY_IN_RIGHT = `${FLY_IN}_right`;
export const FLY_OUT_TOP = `${FLY_OUT}_top`;
export const FLY_OUT_BOTTOM = `${FLY_OUT}_bottom`;
export const FLY_OUT_LEFT = `${FLY_OUT}_left`;
export const FLY_OUT_RIGHT = `${FLY_OUT}_right`;

export const SHIFT = "shift";
export const SHIFT_TOP = `${SHIFT}_top`;
export const SHIFT_BOTTOM = `${SHIFT}_bottom`;
export const SHIFT_LEFT = `${SHIFT}_left`;
export const SHIFT_RIGHT = `${SHIFT}_right`;

export const WIPE_IN = "wipe_in";
export const WIPE_OUT = "wipe_out";
export const WIPE_IN_TOP = `${WIPE_IN}_top`;
export const WIPE_IN_BOTTOM = `${WIPE_IN}_bottom`;
export const WIPE_IN_LEFT = `${WIPE_IN}_left`;
export const WIPE_IN_RIGHT = `${WIPE_IN}_right`;
export const WIPE_OUT_TOP = `${WIPE_OUT}_top`;
export const WIPE_OUT_BOTTOM = `${WIPE_OUT}_bottom`;
export const WIPE_OUT_LEFT = `${WIPE_OUT}_left`;
export const WIPE_OUT_RIGHT = `${WIPE_OUT}_right`;

export const SLIDE_TOP = `${SLIDE}_top`;
export const SLIDE_BOTTOM = `${SLIDE}_bottom`;
export const SLIDE_LEFT = `${SLIDE}_left`;
export const SLIDE_RIGHT = `${SLIDE}_right`;

export const FADE_IN = "fade_in";
export const FADE_OUT = "fade_out";

export const BLOCK_REVEAL_IN = "block_in";
export const BLOCK_REVEAL_OUT = "block_out";
export const BLOCK_REVEAL_IN_TOP = `${BLOCK_REVEAL_IN}_top`;
export const BLOCK_REVEAL_IN_BOTTOM = `${BLOCK_REVEAL_IN}_bottom`;
export const BLOCK_REVEAL_IN_LEFT = `${BLOCK_REVEAL_IN}_left`;
export const BLOCK_REVEAL_IN_RIGHT = `${BLOCK_REVEAL_IN}_right`;
export const BLOCK_REVEAL_OUT_TOP = `${BLOCK_REVEAL_OUT}_top`;
export const BLOCK_REVEAL_OUT_BOTTOM = `${BLOCK_REVEAL_OUT}_bottom`;
export const BLOCK_REVEAL_OUT_LEFT = `${BLOCK_REVEAL_OUT}_left`;
export const BLOCK_REVEAL_OUT_RIGHT = `${BLOCK_REVEAL_OUT}_right`;

export const REVEAL_IN = "reveal_in";
export const REVEAL_OUT = "reveal_out";
export const REVEAL_IN_TOP = `${REVEAL_IN}_top`;
export const REVEAL_IN_BOTTOM = `${REVEAL_IN}_bottom`;
export const REVEAL_IN_LEFT = `${REVEAL_IN}_left`;
export const REVEAL_IN_RIGHT = `${REVEAL_IN}_right`;
export const REVEAL_OUT_TOP = `${REVEAL_OUT}_top`;
export const REVEAL_OUT_BOTTOM = `${REVEAL_OUT}_bottom`;
export const REVEAL_OUT_LEFT = `${REVEAL_OUT}_left`;
export const REVEAL_OUT_RIGHT = `${REVEAL_OUT}_right`;

export const FLICKER = "flicker";
export const PULSE = "pulse";
export const ZOOM_IN = "zoom_in";
export const ZOOM_OUT = "zoom_out";
export const ZOOM_IN_BOUNCE = `${ZOOM_IN}_bounce`;
export const ZOOM_OUT_BOUNCE = `${ZOOM_OUT}_bounce`;
export const STOMP = "stomp";
export const BREATHE = "breathe";
export const DISCO = "disco";
export const GLITCH = "glitch";
export const GREAT_THINKER = "great_thinker";
export const SUNNY_MORNINGS = "sunny_mornings";
export const RISING_STRONG_IN = "rising_strong_in";
export const RISING_STRONG_OUT = "rising_strong_out";
export const MADE_WITH_LOVE = "made_with_love";
export const BEAUTIFUL_QUESTIONS = "beautiful_questions";
export const DOMINO_DREAMS = "domino_dreams";
export const FIND_YOUR_ELEMENT = "find_your_element";
export const THURSDAY = "thursday";
export const HELLO_GOODBYE = "hello_goodbye";
export const COFFEE_MORNINGS = "coffee_mornings";
export const A_NEW_PRODUCTION_IN = "a_new_production_in";
export const A_NEW_PRODUCTION_OUT = "a_new_production_out";
export const SIGNALS_NOISES = "signals_noises";

export const DEFAULT_STORY_MUSIC_ELEMENT_ID = "story";

export const GROUP_LEVEL_ANIMATIONS = [
  FLY_IN_TOP,
  FLY_IN_BOTTOM,
  FLY_IN_LEFT,
  FLY_IN_RIGHT,
  FLY_OUT_TOP,
  FLY_OUT_BOTTOM,
  FLY_OUT_LEFT,
  FLY_OUT_RIGHT,
  SHIFT_LEFT,
  SHIFT_RIGHT,
  SHIFT_TOP,
  SHIFT_BOTTOM,
  WIPE_IN_TOP,
  WIPE_IN_BOTTOM,
  WIPE_IN_LEFT,
  WIPE_IN_RIGHT,
  WIPE_OUT_TOP,
  WIPE_OUT_BOTTOM,
  WIPE_OUT_LEFT,
  WIPE_OUT_RIGHT,
  REVEAL_IN_TOP,
  REVEAL_IN_BOTTOM,
  REVEAL_IN_LEFT,
  REVEAL_IN_RIGHT,
  REVEAL_OUT_TOP,
  REVEAL_OUT_BOTTOM,
  REVEAL_OUT_LEFT,
  REVEAL_OUT_RIGHT,
  BLOCK_REVEAL_IN_TOP,
  BLOCK_REVEAL_IN_BOTTOM,
  BLOCK_REVEAL_IN_LEFT,
  BLOCK_REVEAL_IN_RIGHT,
  BLOCK_REVEAL_OUT_TOP,
  BLOCK_REVEAL_OUT_BOTTOM,
  BLOCK_REVEAL_OUT_LEFT,
  BLOCK_REVEAL_OUT_RIGHT,
  PULSE,
  FLICKER,
  ZOOM_IN,
  ZOOM_OUT,
  ZOOM_IN_BOUNCE,
  ZOOM_OUT_BOUNCE,
  STOMP,
  BREATHE,
  FADE_IN,
  FADE_OUT,
  STILL,
];

export const CHARACTER_LEVEL_ANIMATIONS = [
  GLITCH,
  DISCO,
  GREAT_THINKER,
  SUNNY_MORNINGS,
  RISING_STRONG_IN,
  RISING_STRONG_OUT,
  MADE_WITH_LOVE,
  BEAUTIFUL_QUESTIONS,
  DOMINO_DREAMS,
  FIND_YOUR_ELEMENT,
  THURSDAY,
  HELLO_GOODBYE,
  COFFEE_MORNINGS,
  A_NEW_PRODUCTION_IN,
  A_NEW_PRODUCTION_OUT,
  SIGNALS_NOISES,
];

export const NUM_FRACTION_DIGITS = fabric.Object.NUM_FRACTION_DIGITS;

export const NEW_ARTBOARD = "new_artboard";
export const ADD_HEADING_TEXT = "heading_text";
export const ADD_BODY_TEXT = "body_text";
export const ADD_BACKGROUND_IMAGE = "background_image";
export const ADD_SHAPE_CIRCLE = "shape_circle";
export const ADD_SHAPE_RECT = "shape_rect";
export const SHOW_KBD_SHORTCUTS = "kbd_shortcuts";
export const OPEN_CONTACT_US = "contact_us";

const COMMAND_K_OPEN_OPTIONS = [
  {
    value: TEXT_SLIDER_PANEL,
    label: "Text",
    hotkey: ["T"],
    prefixIcon: "font",
    type: "open",
  },
  {
    value: ELEMENTS_SLIDER_PANEL,
    label: "Components",
    hotkey: ["C"],
    prefixIcon: "shapes",
    type: "open",
  },
  {
    value: IMAGES_SLIDER_PANEL,
    label: "Images",
    hotkey: ["I"],
    prefixIcon: "image",
    type: "open",
  },
  {
    value: ICONS_SLIDER_PANEL,
    label: "Visuals",
    hotkey: ["V"],
    prefixIcon: "icons",
    type: "open",
  },
  {
    value: VIDEO_SLIDER_PANEL,
    label: "Media",
    hotkey: ["M"],
    prefixIcon: "video",
    type: "open",
  },
];

const COMMAND_K_ADD_OPTIONS = [
  {
    value: NEW_ARTBOARD,
    label: "New Artboard",
    prefixIcon: "plus",
    type: "add",
  },
  {
    value: ADD_HEADING_TEXT,
    label: "Heading text",
    prefixIcon: "heading",
    type: "add",
  },
  {
    value: ADD_BODY_TEXT,
    label: "Normal text",
    prefixIcon: "font",
    type: "add",
  },
  {
    value: ADD_BACKGROUND_IMAGE,
    label: "Background Image",
    prefixIcon: "image",
    type: "add",
  },
  {
    value: ADD_SHAPE_CIRCLE,
    label: "Circle",
    prefixIcon: "shapes",
    type: "add",
  },
  {
    value: ADD_SHAPE_RECT,
    label: "Rectangle",
    prefixIcon: "shapes",
    type: "add",
  },
];

const COMMAND_K_DOWNLOAD_OPTIONS = [
  {
    value: "jpeg",
    label: "Export",
    type: "export",
    prefixIcon: "file-download",
    hotkey: [comboKey1, "Shift", "E"],
  },
];

const COMMAND_K_HELP_OPTIONS = [
  // { value: SHOW_KBD_SHORTCUTS, label: "Keyboard Shortcuts", prefixIcon: "keyboard" },
  {
    value: OPEN_CONTACT_US,
    label: "Help / Contact Us",
    prefixIcon: "question-circle",
  },
];

export const COMMAND_K_GROUPED_OPTIONS = [
  { label: "Open Library", options: COMMAND_K_OPEN_OPTIONS },
  { label: "Add", options: COMMAND_K_ADD_OPTIONS },
  { label: "Save", options: COMMAND_K_DOWNLOAD_OPTIONS },
  { label: "Help", options: COMMAND_K_HELP_OPTIONS },
];

export const FABRIC_TEXT_ELEMENT = "text";
export const FABRIC_ITEXT_ELEMENT = "i-text";
export const FABRIC_TEXTBOX_ELEMENT = "textbox";
export const FABRIC_RECT_ELEMENT = "rect";
export const FABRIC_CIRCLE_ELEMENT = "circle";
export const FABRIC_TRIANGLE_ELEMENT = "triangle";
export const FABRIC_POLYGON_ELEMENT = "polygon";
export const FABRIC_ELLIPSE_ELEMENT = "ellipse";
export const FABRIC_IMAGE_ELEMENT = "image";
export const FABRIC_VIDEO_ELEMENT = "video";
export const FABRIC_SVG_ELEMENT = "svg";
export const FABRIC_GIF_ELEMENT = "gif";
export const FABRIC_GROUP_ELEMENT = "group";
export const FABRIC_PHOTOTEXT_ELEMENT = "photo-text";

export const FABRIC_TEXT_TYPES = [
  FABRIC_TEXT_ELEMENT,
  FABRIC_ITEXT_ELEMENT,
  FABRIC_TEXTBOX_ELEMENT,
  FABRIC_PHOTOTEXT_ELEMENT,
];

export const FONT_REGULAR_WEIGHT = 400;
export const FONT_BOLD_WEIGHT = 600;

export const KEYBOARD_SHORTCUTS_LIST = [
  {
    title: "Basics",
    shortcuts: [
      {
        title: "Open Global Search",
        keys: [comboKey1, "K"],
      },
      {
        title: "Undo",
        keys: [comboKey1, "Z"],
      },
      {
        title: "Redo",
        keys: [comboKey1, "Y"],
      },
      {
        title: "Export as JPEG",
        keys: [comboKey1, "Shift", "E"],
      },
    ],
  },
  {
    title: "Panels",
    shortcuts: [
      {
        title: "Toggle Text Panel",
        keys: ["T"],
      },
      {
        title: "Toggle Components Panel",
        keys: ["C"],
      },
      {
        title: "Toggle Images Panel",
        keys: ["I"],
      },
      {
        title: "Toggle Visuals Panel",
        keys: ["V"],
      },
      {
        title: "Toggle Media Panel",
        keys: ["M"],
      },
    ],
  },
  {
    title: "Artboard",
    shortcuts: [
      {
        title: "Zoom In",
        keys: ["+"],
      },
      {
        title: "Zoom Out",
        keys: ["-"],
      },
      {
        title: "Zoom 1:1",
        keys: ["O"],
      },
      {
        title: "Zoom to Fit",
        keys: ["P"],
      },
      {
        title: "Grab Mode",
        keys: ["Space", "Drag"],
      },
      {
        title: "Clone",
        keys: [comboKey1, "D"],
      },
      {
        title: "Delete",
        keys: ["Delete"],
      },
      {
        title: "Change Artboard",
        keys: [
          <FontAwesomeIcon icon={faCaretLeft} />,
          <FontAwesomeIcon icon={faCaretRight} />,
        ],
      },
    ],
  },
  {
    title: "Layer",
    shortcuts: [
      {
        title: "Copy",
        keys: [comboKey1, "C"],
      },
      {
        title: "Paste",
        keys: [comboKey1, "V"],
      },
      {
        title: "Lock",
        keys: [comboKey1, "Shift", "L"],
      },
      {
        title: "Clone",
        keys: [comboKey1, "D"],
      },
      {
        title: "Group",
        keys: [comboKey1, "G"],
      },
      {
        title: "Ungroup",
        keys: [comboKey1, "Shift", "G"],
      },
      {
        title: "Delete",
        keys: ["Delete"],
      },
      {
        title: "Select Top Layer",
        keys: [comboKey2, "."],
      },
      {
        title: "Select Bottom Layer",
        keys: [comboKey2, ","],
      },
      {
        title: "Move 1 unit",
        keys: [
          <FontAwesomeIcon icon={faCaretLeft} />,
          <FontAwesomeIcon icon={faCaretUp} />,
          <FontAwesomeIcon icon={faCaretRight} />,
          <FontAwesomeIcon icon={faCaretDown} />,
        ],
      },
      {
        title: "Move 10 units",
        keys: [
          "Shift",
          <FontAwesomeIcon icon={faCaretLeft} />,
          <FontAwesomeIcon icon={faCaretUp} />,
          <FontAwesomeIcon icon={faCaretRight} />,
          <FontAwesomeIcon icon={faCaretDown} />,
        ],
      },
      {
        title: "Move 100 units",
        keys: [
          comboKey1,
          <FontAwesomeIcon icon={faCaretLeft} />,
          <FontAwesomeIcon icon={faCaretUp} />,
          <FontAwesomeIcon icon={faCaretRight} />,
          <FontAwesomeIcon icon={faCaretDown} />,
        ],
      },
    ],
  },
  {
    title: "Text",
    shortcuts: [
      {
        title: "Bold",
        keys: [comboKey1, "B"],
      },
      {
        title: "Italic",
        keys: [comboKey1, "I"],
      },
      {
        title: "Underline",
        keys: [comboKey1, "U"],
      },
      {
        title: "Strikethrough",
        keys: [comboKey1, "Shift", "X"],
      },
    ],
  },
];

export const IMAGE_URL_SUFFIXES = ["png", "jpg", "gif"];
export const MUSIC_URL_SUFFIXES = ["mp3", "wav"];
export const PASTED_URL_SUFFIXES = [
  ...IMAGE_URL_SUFFIXES,
  ...MUSIC_URL_SUFFIXES,
];

export const RATIO_SQUARE = "1:1";
export const RATIO_STORY = "9:16";
export const RATIO_WIDESCREEN = "16:9";
export const RATIO_LANDSCAPE = "4:3";
export const RATIO_PORTRAIT = "3:4";

const CROP_RATIO_SQUARE = {
  title: "Square",
  subtitle: RATIO_SQUARE,
};

const CROP_RATIO_STORY = {
  title: "Story",
  subtitle: RATIO_STORY,
};

const CROP_RATIO_WIDESCREEN = {
  title: "Widescreen",
  subtitle: RATIO_WIDESCREEN,
};

const CROP_RATIO_LANDSCAPE = {
  title: "Landscape",
  subtitle: RATIO_LANDSCAPE,
};

const CROP_RATIO_PORTRAIT = {
  title: "Portrait",
  subtitle: RATIO_PORTRAIT,
};

const CROP_RATIO_CUSTOM = {
  title: "Custom",
};

export const AVAILABLE_RATIOS_FOR_CROP = [
  CROP_RATIO_SQUARE,
  CROP_RATIO_STORY,
  CROP_RATIO_WIDESCREEN,
  CROP_RATIO_LANDSCAPE,
  CROP_RATIO_PORTRAIT,
  CROP_RATIO_CUSTOM,
];

export const CLIP_SHAPE_SQUARE = "square";
export const CLIP_SHAPE_CIRCLE = "circle";
export const CLIP_SHAPE_TRIANGLE = "triangle";
export const CLIP_SHAPE_ELLIPSE = "ellipse";
export const CLIP_SHAPE_TRAPEZIUM = "trapezium";
export const CLIP_SHAPE_STAR6 = "star6";
export const CLIP_SHAPE_PENTAGON = "pentagon";
export const CLIP_SHAPE_HEXAGON = "hexagon";
export const CLIP_SHAPE_OCTAGON = "octagon";
export const CLIP_SHAPE_HEART = "heart";
export const CLIP_SHAPE_DIAMOND = "diamond";
export const CLIP_SHAPE_KITE = "kite";
export const CLIP_SHAPE_PARALLELOGRAM = "parallelogram";
export const CLIP_SHAPE_CHEVRON = "chevron";
export const CLIP_SHAPE_CROSS = "cross";

export const AVAILABLE_SHAPES_FOR_CLIP = [
  CLIP_SHAPE_SQUARE,
  CLIP_SHAPE_CIRCLE,
  CLIP_SHAPE_TRIANGLE,
  CLIP_SHAPE_ELLIPSE,
  CLIP_SHAPE_TRAPEZIUM,
  CLIP_SHAPE_STAR6,
  CLIP_SHAPE_PENTAGON,
  CLIP_SHAPE_HEXAGON,
  CLIP_SHAPE_OCTAGON,
  // CLIP_SHAPE_HEART,
  CLIP_SHAPE_DIAMOND,
  CLIP_SHAPE_KITE,
  CLIP_SHAPE_PARALLELOGRAM,
  CLIP_SHAPE_CHEVRON,
  CLIP_SHAPE_CROSS,
];

// Category constants
export const CATEGORY_TEMPLATE = 0;
export const CATEGORY_COMPONENTS = 1;
export const CATEGORY_COPY = 2;
export const CATEGORY_FORMAT = 3;

export const fontSizes = [
  6, 8, 10, 12, 14, 16, 18, 21, 24, 28, 32, 36, 42, 48, 56, 64, 72, 80, 88, 96,
  104, 120, 144,
];

// It keeps track of loaded font in application
export let FONT_CACHE = {};

export const EDITOR_SIDEBAR_MENU = [
  {
    type: "item",
    icon: faFolderOpen,
    label: "My Assets",
    classes: `tldr-nav-item menu-item option-label text-center menu-item-label`,
    iconClasses: "menu-icon",
    extraData: {
      panel: ASSETS_SLIDER_PANEL,
    },
  },
  {
    type: "item",
    icon: faEgg,
    label: "Templates",
    classes: "tldr-nav-item menu-item option-label text-center menu-item-label",
    iconClasses: "menu-icon",
    extraData: {
      panel: TEMPLATES_SLIDER_PANEL,
    },
  },
  {
    type: "item",
    icon: faPuzzlePiece,
    label: "Components",
    classes: "tldr-nav-item menu-item option-label text-center menu-item-label",
    iconClasses: "menu-icon",
    extraData: {
      panel: ELEMENTS_SLIDER_PANEL,
    },
  },
  { type: "divider", classes: "tldr-sidebar-hl-story" },
  {
    type: "item",
    icon: faFont,
    label: "Text",
    classes: "tldr-nav-item menu-item option-label text-center menu-item-label",
    iconClasses: "menu-icon",
    extraData: {
      panel: TEXT_SLIDER_PANEL,
    },
  },
  {
    type: "item",
    icon: faImage,
    label: "Images",
    classes: "tldr-nav-item menu-item option-label text-center menu-item-label",
    iconClasses: "menu-icon",
    extraData: {
      panel: IMAGES_SLIDER_PANEL,
    },
  },
  {
    type: "item",
    icon: faCrown,
    label: "Visuals",
    classes: "tldr-nav-item menu-item option-label text-center menu-item-label",
    iconClasses: "menu-icon",
    extraData: {
      panel: ICONS_SLIDER_PANEL,
    },
  },
  {
    type: "item",
    icon: faPlay,
    label: "Media",
    classes: `tldr-nav-item menu-item option-label text-center menu-item-label`,
    iconClasses: "menu-icon",
    extraData: {
      panel: VIDEO_SLIDER_PANEL,
    },
  },
];

export const subscriptionFeaturesList = [
  {
    context: "For your creativity in one place",
    additional_feature: "Everything you need to get started.",
    color: "#FFFBBD",
    features: [
      "Unlimited design projects",
      "1000+ Google Fonts, Millions of Free photos, icons",
      "Thousands of free design template",
      "Instant publishing to social media",
      "Collaboration, Preview and sharing",
      "1GB of workspace storage",
    ],
  },
  {
    context: "For teams just getting started and looking to do more with less",
    additional_feature: "Everything in Free Forever plan, plus:",
    color: "#68D5FF",
    features: [
      "Premium templates",
      "1M+ Premium images, video, audio tracks",
      "Custom fonts",
      "Video editing (beta)",
      "10 Background remover credits",
      "30+ copy writing teamplates",
      "10 GB of cloud storage",
    ],
  },
  {
    context: "For teams who want to work together in one place",
    additional_feature: "Everything in Small Teams plan, plus:",
    color: "#85DE55",
    features: [
      "Brandkits",
      "Write 50k+ words using AI",
      "25 Background remover credits",
      "Unlimited AI copy writing credits",
      "Unlimited video exports (beta)",
      "Advanced permission & workflows",
    ],
  },
];

// billing dates format
export const BILLING_AND_PRICING_DATE_FORMAT = "MMM D, YYYY";

// subscription feature codes
export const USER_ASSETS = "user_assets";
export const USE_BRANDKIT = "use_brandkit";
export const INVITE_MEMBERS = "invite_members";
export const EDITOR_BOTTOM_MENU = [
  {
    type: "fa",
    icon: faFolderOpen,
    label: "My Assets",
    classes: `tldr-nav-item menu-item option-label text-center menu-item-label`,
    iconClasses: "menu-icon align-self-center",
    iconWrap: "icon-wrap",
    extraData: {
      panel: ASSETS_SLIDER_PANEL,
    },
  },
  {
    type: "fa",
    icon: faEgg,
    label: "Templates",
    classes: "tldr-nav-item menu-item option-label text-center menu-item-label",
    iconClasses: "menu-icon align-self-center",
    iconWrap: "icon-wrap",
    extraData: {
      panel: TEMPLATES_SLIDER_PANEL,
    },
  },
  {
    type: "fa",
    icon: faPuzzlePiece,
    label: "Text",
    classes: "tldr-nav-item menu-item option-label text-center menu-item-label",
    iconClasses: "menu-icon align-self-center",
    iconWrap: "icon-wrap",
    extraData: {
      panel: ELEMENTS_SLIDER_PANEL,
    },
  },
  {
    type: "fa",
    icon: faFont,
    label: "Text",
    classes: "tldr-nav-item menu-item option-label text-center menu-item-label",
    iconClasses: "menu-icon align-self-center",
    iconWrap: "icon-wrap",
    extraData: {
      panel: TEXT_SLIDER_PANEL,
    },
  },
  {
    type: "fa",
    icon: faImage,
    label: "Images",
    classes: "tldr-nav-item menu-item option-label text-center menu-item-label",
    iconClasses: "menu-icon align-self-center",
    iconWrap: "icon-wrap",
    extraData: {
      panel: IMAGES_SLIDER_PANEL,
    },
  },
  {
    type: "fa",
    icon: faCrown,
    label: "Visuals",
    classes: "tldr-nav-item menu-item option-label text-center menu-item-label",
    iconClasses: "menu-icon align-self-center",
    iconWrap: "icon-wrap",
    extraData: {
      panel: ICONS_SLIDER_PANEL,
    },
  },
  {
    type: "fa",
    icon: faPlay,
    label: "Media",
    classes: `tldr-nav-item menu-item option-label text-center menu-item-label`,
    iconClasses: "menu-icon align-self-center",
    iconWrap: "icon-wrap",
    extraData: {
      panel: VIDEO_SLIDER_PANEL,
    },
  },
];

export const TOP_EDITOR = [
  {
    type: "item",
    icon: BrandLogo,
    classes: `custom-tab brand-logo icon-wrap`,
    iconClasses: "align-self-center brand-logo icon-wrap",
    extraData: {
      action: "Dashboard",
    },
  },
  {
    type: "dropdown",
    icon: faRedo,
    classes: `tldr-nav-item menu-item option-label text-center menu-item-label`,
    iconClasses: "menu-icon align-self-center",
    options: [
      { label: "Undo", icon: faUndo },
      { label: "Redo", icon: faRedo },
    ],
    extraData: {},
  },
  {
    type: "fa",
    icon: faEye,
    classes: "tldr-nav-item menu-item option-label text-center menu-item-label",
    iconClasses: "menu-icon align-self-center",
    extraData: {},
  },
  {
    type: "fa",
    icon: faDownload,
    classes: "tldr-nav-item menu-item option-label text-center menu-item-label",
    iconClasses: "menu-icon align-self-center",
    extraData: {},
  },
  {
    type: "fa",
    icon: faUserPlus,
    classes: "tldr-nav-item menu-item option-label text-center menu-item-label",
    iconClasses: "menu-icon align-self-center",
    extraData: {},
  },
];
