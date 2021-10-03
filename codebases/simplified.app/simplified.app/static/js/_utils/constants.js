import React from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import {
  PROJECTS,
  MY_ASSETS,
  MY_TEMPLATES,
  MY_COMPONENTS,
  QUICK_START,
  ROOT,
  MY_FOLDERS,
  BRANDKIT,
  MY_WORKSPACE,
  MY_APPS,
  MAGICAL,
  TEMPLATES_SCREEN,
  BILLING_AND_PAYMENT,
  BILLING_PLANS,
  MY_ACCOUNT,
  DOCUMENTS,
  FAVORITES,
} from "./routes";
import BrandLogo from "../_components/common/BrandLogo";
import NewProject from "../_components/home/NewProject";
import TldrOrgDropdown from "../_components/common/TldrOrgDropdown";

export const FONT_WEIGHTS = {
  100: { fontWeight: 100, label: "Thin" },
  "100italic": { fontWeight: 100, label: "Thin italic", style: "italic" },
  200: { fontWeight: 200, label: "Extra-light" },
  "200italic": {
    fontWeight: 200,
    label: "Extra-light italic",
    style: "italic",
  },
  250: { fontWeight: 250, label: "Extra-light" },
  "250italic": {
    fontWeight: 250,
    label: "Extra-light",
    style: "italic",
  },
  300: { fontWeight: 300, label: "Light" },
  350: { fontWeight: 300, label: "Light" },
  "300italic": { fontWeight: 300, label: "Light italic", style: "italic" },
  regular: { fontWeight: 400, label: "Regular" },
  italic: { fontWeight: 400, label: "Regular italic", style: "italic" },
  500: { fontWeight: 500, label: "Medium" },
  "500italic": { fontWeight: 500, label: "Medium italic", style: "italic" },
  600: { fontWeight: 600, label: "Semi-bold" },
  "600italic": { fontWeight: 600, label: "Semi-bold italic", style: "italic" },
  700: { fontWeight: 700, label: "Bold" },
  750: { fontWeight: 750, label: "Bold" },
  "700italic": { fontWeight: 700, label: "Bold italic", style: "italic" },
  800: { fontWeight: 800, label: "Extra-bold" },
  "800italic": { fontWeight: 800, label: "Extra-bold italic", style: "italic" },
  900: { fontWeight: 900, label: "Black" },
  "900italic": { fontWeight: 900, label: "Black italic", style: "italic" },
};

export const ADD_MORE_FONTS = "+ Add fonts";

export const RND_MIN_WIDTH = "50px";

export const NUMBER_OF_USERS_TO_DISPLAY = 5;

export const EXPORT_IMAGE_ERROR_PAYLOAD = {
  message: "Something went wrong. Please try again after sometimes.",
  heading: "Failed to export image",
  type: "error",
};

export const MAIN_CONTAINER_SCROLLABLE_TARGET_ID =
  "infinite-scroll-main-container";

export const API_DEBOUNCE_TIME =
  process.env.REACT_APP_API_DEBOUNCE_TIME ?? 1000; // API debounce time in ms

// KEYBOARD KEY CODE
export const ARROW_LEFT = 37;
export const ARROW_UP = 38;
export const ARROW_RIGHT = 39;
export const ARROW_DOWN = 40;

export const ARROWS = [ARROW_LEFT, ARROW_UP, ARROW_RIGHT, ARROW_DOWN];

export const DASHBOARD_SIDEBAR_MENU = [
  {
    type: "template",
    template: <NewProject></NewProject>,
  },
  {
    type: "divider",
    classes: "tldr-sidebar-hl mt-2 mb-3 d-none d-sm-none d-md-block",
  },
  {
    type: "template",
    template: (
      <div className="d-block d-sm-block d-md-none">
        <TldrOrgDropdown type="expandable"></TldrOrgDropdown>
      </div>
    ),
  },
  {
    type: "item",
    icon: "th-large",
    label: "Dashboard",
    classes: `quikc-start`,
    iconClasses: "",
    extraData: {
      path: [QUICK_START, ROOT],
    },
  },
  {
    type: "item",
    icon: "egg",
    label: "Templates",
    classes: "",
    iconClasses: "",
    extraData: {
      path: TEMPLATES_SCREEN,
      analyticsTrackLabel: "exploreTemplates",
    },
  },
  {
    type: "item",
    icon: "clock",
    label: "Projects",
    classes: "",
    iconClasses: "",
    extraData: {
      path: PROJECTS,
      // analyticsTrackLabel: 'OpenProjects'
    },
  },
  {
    type: "item",
    icon: "robot",
    label: "AI Assistant",
    tooltip: "Auto generate content",
    classes: "",
    iconClasses: "",
    extraData: {
      path: MAGICAL,
      // analyticsTrackLabel: 'OpenAIAssistant'
    },
  },
  { type: "divider", classes: "tldr-sidebar-hl tldr-sidebar-hl-divider" },
  {
    type: "item",
    icon: "palette",
    label: "Brandkit",
    classes: "",
    iconClasses: "",
    extraData: {
      path: BRANDKIT,
    },
  },
  {
    title: "My Library",
    icon: "folder",
    type: "subMenu",
    menu: [
      {
        type: "item",
        icon: "folder",
        label: "Folders",
        classes: ``,
        iconClasses: "",
        extraData: {
          path: MY_FOLDERS,
        },
      },
      {
        type: "item",
        icon: "palette",
        label: "My Assets",
        classes: ``,
        iconClasses: "",
        extraData: {
          path: MY_ASSETS,
        },
      },
      {
        type: "item",
        icon: "egg",
        label: "Team Templates",
        classes: ``,
        iconClasses: "",
        extraData: {
          path: MY_TEMPLATES,
        },
      },
      {
        type: "item",
        icon: "puzzle-piece",
        label: "Components",
        tooltip: "My Components",
        classes: ``,
        iconClasses: "",
        extraData: {
          path: MY_COMPONENTS,
        },
      },
    ],
  },
  {
    title: "Settings",
    icon: "cog",
    type: "subMenu",
    menu: [
      {
        type: "item",
        icon: "cog",
        label: "Workspace",
        tooltip: "Settings",
        classes: ``,
        iconClasses: "",
        extraData: {
          path: MY_WORKSPACE,
        },
      },
      {
        type: "item",
        icon: "cog",
        label: "Billing",
        tooltip: "Settings",
        classes: ``,
        iconClasses: "",
        extraData: {
          path: BILLING_AND_PAYMENT,
          altPath: BILLING_PLANS,
        },
      },
      {
        type: "item",
        icon: "cog",
        label: "Connected Apps",
        tooltip: "Settings",
        classes: ``,
        iconClasses: "",
        extraData: {
          path: MY_APPS,
        },
      },
    ],
  },
  {
    title: "Help & Support",
    icon: "question-circle",
    type: "subMenu",
    menu: [
      {
        type: "item",
        icon: "cog",
        label: "Academy",
        classes: ``,
        iconClasses: "",
        extraData: {},
      },
      {
        type: "item",
        icon: "cog",
        label: "Join Community",
        classes: ``,
        iconClasses: "",
        extraData: {},
      },
      {
        type: "item",
        icon: "cog",
        label: "Get Help",
        classes: ``,
        iconClasses: "",
        extraData: {},
      },
    ],
  },
];

export const TOP_BAR = [
  {
    type: "fa",
    icon: faBars,
    classes: `custom-tab hamburger-container`,
    iconClasses: "align-self-center hamburger",
    extraData: {
      action: "Toggle",
    },
  },
  {
    type: "item",
    icon: BrandLogo,
    classes: `custom-tab brand-logo icon-wrap strict-center`,
    iconClasses: "align-self-center brand-logo icon-wrap strict-center",
    extraData: {
      action: "Dashboard",
    },
  },
  {
    type: "tldrDropdown",
    classes: ``,
    iconClasses: "",
  },
];

export const BOTTOM_BAR = [
  {
    type: "fa",
    icon: "th-large",
    classes: `custom-tab text-capitalize`,
    iconClasses: `align-self-center`,
    label: "Dashboard",
    extraData: {
      path: [QUICK_START, ROOT],
    },
  },
  {
    type: "fa",
    icon: "egg",
    classes: `custom-tab text-capitalize`,
    iconClasses: `align-self-center`,
    label: "Templates",
    extraData: {
      path: TEMPLATES_SCREEN,
    },
  },
  {
    type: "fa",
    icon: "clock",
    classes: `custom-tab text-capitalize`,
    iconClasses: `align-self-center`,
    label: "Projects",
    extraData: {
      path: PROJECTS,
    },
  },
  {
    type: "fa",
    icon: "robot",
    classes: `custom-tab text-capitalize`,
    iconClasses: `align-self-center`,
    label: "AI",
    extraData: {
      path: MAGICAL,
    },
  },
];

export const AI_TABBAR = [
  { label: "Playground", path: MAGICAL },
  { label: "Documents", path: DOCUMENTS },
  { label: "Favorites", path: FAVORITES },
];

export const SETTINGS_TABBAR = [
  { label: "My account", path: MY_ACCOUNT },
  { label: "My workspace", path: MY_WORKSPACE },
  { label: "Billing", path: BILLING_AND_PAYMENT },
  { label: "Brand Kit", path: BRANDKIT },
  { label: "My Connected Apps", path: MY_APPS },
];
export const SIMPLIFIED_ACADEMY_LINK = "https://simplified.co/academy";
export const SIMPLIFIED_OFFICIAL_COMMUNITY_LINK =
  "https://www.facebook.com/groups/simplifiedcommunity/";
export const SIMPLIFIED_HELP_CENTRE_LINK = "https://help.simplified.co/";

// Application static assets URLs
export const SIMPLIFIED_ASSETS_BASE_URL = "https://assets.simplified.co";
export const DASHBOARD_BANNER = `${SIMPLIFIED_ASSETS_BASE_URL}/images/dashboard-banner.png`;

export const DEFAULT_ARTBOARD_DURATION = 6;
export const StoryTypes = {
  STATIC: 0,
  ANIMATED: 1,
};

export const DEFAULT_AUDIO_VOLUME = 0.5;
export const GLOBAL_TIMELINE_ALLOWED_DELTA = 250; // Miminum timedelta for global timeline if delta is bigger then this then timeline sync

export const WORKAREA_LAYOUT_FIXED = "fixed";
export const WORKAREA_LAYOUT_RESPONSIVE = "responsive";
export const WORKAREA_LAYOUT_FULLSCREEN = "fullscreen";

export const STORY_TYPE_ANIMATED = 1;

// Bottom panel related constants
export const BottomPanelState = {
  CLOSE: "close",
  OPEN: "open",
};
export const BottomPanelViewTypes = {
  PREVIEW_ARTBOARDS: "preview_artboards",
  ARTBOARDS_GRID_VIEW: "artboards_grid_view",
  TRIM_STORY_MUSIC: "trim_story_music",
};
