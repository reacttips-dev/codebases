import {
  CLOSE_SLIDER,
  GET_IMAGES,
  SEARCH_IMAGES,
  GET_ICONS,
  SEARCH_ICONS,
  GET_GIPHY,
  GET_VIDEOS,
  GET_TEXT_BLOCKS,
  BACK_FROM_STUDIO,
  SET_OR_UPDATE_STYLES,
  OPEN_SIDEBAR,
  CLOSE_SIDEBAR,
  CLOSE_ALL_SLIDERS,
  GET_ASSETS,
  ADD_ASSETS,
  DELETE_ASSET,
  DELETE_TEMPLATE,
  DECREMENT_COUNTER,
  SET_COUNTER,
  RESET_PAGE,
  GET_TEMPLATE_GROUPS,
  RESET_ELEMENTS_VIEW_ALL,
  RESET_SIDEBAR_SLIDER_PAYLOAD,
  SEARCH_GIPHY,
  SEARCH_ELEMENTS,
  SEARCH_ELEMENTS_ALL,
  GET_ELEMENTS_VIEW_ALL,
  CHANGE_IMAGE_SOURCE,
  GET_ICONS_VIEW_ALL,
  SWITCH_MEDIA_TAB,
  OPEN_SLIDER,
  TEMPLATE_PUBLISHED,
  IMAGE_PROVIDER_ERRORS,
  MusicSources,
  GET_MUSIC,
  ImageSources,
  VideoSources,
  IconsSources,
} from "../_actions/types";
import {
  IMAGES_SLIDER_PANEL,
  ICONS_SLIDER_PANEL,
  VIDEO_SLIDER_PANEL,
  MUSIC_SLIDER_PANEL,
} from "../_components/details/constants";

export const TO_OPEN_SLIDER = "open";
export const TO_CLOSE_SLIDER = "close";

export const initialState = {
  isSliderOpen: TO_CLOSE_SLIDER,
  sliderPanelType: "images",
  payload: [],
  loaded: false,
  isActionPanelOpen: false,
  action: null,
  counter: 0,
  page: 1,
  nextPageToken: null,
  searchText: "",
  selectedTab: "",
  hasMore: true,
  imageSource: ImageSources.UNSPLASH,
  videoSource: VideoSources.STORYBLOCKS,
  iconsSource: IconsSources.FLATICON,
  musicSource: MusicSources.STORYBLOCKS,
  closeTemplateModal: false,
  imageProviderErrors: null,
  isSidebarOpen: true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CLOSE_ALL_SLIDERS:
      return { ...initialState };
    case OPEN_SIDEBAR:
      return { ...initialState, isSidebarOpen: true };
    case CLOSE_SIDEBAR:
      return { ...initialState, isSidebarOpen: false };
    case OPEN_SLIDER:
    case SWITCH_MEDIA_TAB:
      return {
        ...state,
        payload: [],
        loaded: false,
        isSliderOpen: TO_OPEN_SLIDER,
        sliderPanelType: action.payload,
        page: 1,
        //searchText: "",
        hasMore: true,
      };
    case CLOSE_SLIDER:
      return {
        ...state,
        payload: [],
        loaded: false,
        isSliderOpen: TO_CLOSE_SLIDER,
        action: null,
        page: 1,
        //searchText: "",
      };
    case GET_ASSETS:
    case GET_TEXT_BLOCKS:
    case GET_IMAGES:
    case SEARCH_IMAGES:
    case GET_ICONS:
    case SEARCH_ICONS:
    case GET_VIDEOS:
    case GET_GIPHY:
    case SEARCH_GIPHY:
    case GET_ELEMENTS_VIEW_ALL:
    case GET_ICONS_VIEW_ALL:
    case SEARCH_ELEMENTS_ALL:
    case GET_MUSIC:
      let payload = action.payload.data.map((element) => ({
        ...element,
        groupKey: action.payload.groupKey,
      }));
      payload =
        state.page >= 1 || state.nextPageToken
          ? state.payload.concat(payload)
          : payload;
      return {
        ...state,
        loaded: true,
        payload: payload,
        page: state.page + 1,
        nextPageToken: action.payload.nextPageToken,
        searchText: action.payload.searchText || "",
        imageSource: action.payload.imagesource || "Unsplash",
        videoSource: action.payload.videosource || "Pixabay",
        iconsSource: action.payload.iconsource || "Flaticon",
        hasMore: action.payload.hasMore ? true : false,
        imageProviderErrors: null,
      };
    case RESET_SIDEBAR_SLIDER_PAYLOAD:
      return {
        ...state,
        payload: [],
        searchText: "",
      };
    case GET_TEMPLATE_GROUPS:
      let templateGroupsPayload =
        state.page === 1
          ? action.payload.data
          : state.payload.concat(action.payload.data);
      return {
        ...state,
        loaded: true,
        payload: templateGroupsPayload,
        searchText: action.payload.searchText || "",
        imageSource: action.payload.imagesource || "Unsplash",
        videoSource: action.payload.videosource || "Pixabay",
        iconsSource: action.payload.iconsource || "Flaticon",
        page: state.page + 1,
        hasMore: action.payload.hasMore ? true : false,
      };
    case SEARCH_ELEMENTS:
      return {
        ...state,
        loaded: true,
        payload: action.payload.data,
        searchText: action.payload.searchText || "",
        imageSource: action.payload.imagesource || "Unsplash",
        videoSource: action.payload.videosource || "Pixabay",
        iconsSource: action.payload.iconsource || "Flaticon",
      };
    case RESET_ELEMENTS_VIEW_ALL:
      return {
        ...state,
        loaded: false,
        payload: [],
        page: 1,
        // searchText: "",
        hasMore: true,
      };
    case RESET_PAGE:
      return {
        ...state,
        loaded: false,
        page: 1,
      };
    case BACK_FROM_STUDIO:
      return initialState;

    case ADD_ASSETS:
      let previousPayload = state.payload.filter(
        (asset) => asset.id !== action.payload.id
      );
      return {
        ...state,
        counter: state.counter - 1,
        loaded: state.counter - 1 === 0,
        payload: [action.payload].concat(previousPayload),
      };
    case DELETE_ASSET:
    case DELETE_TEMPLATE:
      return {
        ...state,
        payload: state.payload.filter((asset) => asset.id !== action.payload),
      };
    case SET_OR_UPDATE_STYLES:
      if (
        state.isSliderOpen &&
        state.loaded &&
        state.sliderPanelType === action.payload.destination
      ) {
        return {
          ...state,
          action: action.payload.action,
        };
      }
      return {
        ...state,
        payload: [],
        loaded: false,
        isSliderOpen: TO_OPEN_SLIDER,
        sliderPanelType: action.payload.destination,
        action: action.payload.action,
      };
    case SET_COUNTER:
      return {
        ...state,
        counter: action.payload,
        loaded: false,
      };
    case DECREMENT_COUNTER:
      return {
        ...state,
        counter: state.counter - 1,
      };
    case CHANGE_IMAGE_SOURCE:
      let sourceKey = "imageSource";
      if (state.sliderPanelType === ICONS_SLIDER_PANEL) {
        sourceKey = "iconsSource";
      } else if (state.sliderPanelType === IMAGES_SLIDER_PANEL) {
        sourceKey = "imageSource";
      } else if (state.sliderPanelType === VIDEO_SLIDER_PANEL) {
        sourceKey = "videoSource";
      } else if (state.sliderPanelType === MUSIC_SLIDER_PANEL) {
        sourceKey = "musicSource";
      }

      return {
        ...state,
        loaded: false,
        page: 0,
        payload: [],
        [sourceKey]: action.payload,
        imageProviderErrors: null,
        iconsSource:
          action.payload === "Brandfetch" ? "Brandfetch" : "Flaticon",
      };
    case TEMPLATE_PUBLISHED:
      return {
        ...state,
        closeTemplateModal: true,
      };

    case IMAGE_PROVIDER_ERRORS:
      return {
        ...state,
        payload: [],
        imageSource: action.payload.imageSource,
        imageProviderErrors: action.payload.errors,
      };
    default:
      return state;
  }
}
