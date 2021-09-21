import { combineReducers } from 'redux';
import types from './types';

/* State Shape
{
    imageErrorText: text,
    isShowing: boolean,
    scene:
    searchText: string,
    imageChoices: array // TODO: change name to 'unsplashImages`
    zoomLevel: number
    cropXAxis: number
    cropYAxis: number
    scene: string
    textColor: string
    isFetching: bool // TODO: change this name to represent prevention of continuing to the next page (button disabled)
    textOverlayImages: array
    croppedImagePixels: {x: number, y: number, width: number, height: number}
    font: string
    isTextShowing: bool
    isTextImageLoading: bool
    coverArt: {
      maybeCroppedImageUrl: PropTypes.string,
      maybeFinalImageUrl: PropTypes.string,
      sourceImage: {
        maybeUnsplashImage: {
          thumbnailUrl: PropTypes.string.isRequired,
          fullResUrl: PropTypes.string.isRequired,
          id: PropTypes.string,
          authorName: PropTypes.string,
          dispatch(duckOperations.setIsFetching(false));
          dispatch(duckOperations.setScene('choose_path'));
          onFinishSubmitCoverArt({ image400, image });
        }
        maybeLocalImageBlobUrl: PropTypes.string,
        maybeHttpImageUrl: PropTypes.string,
      },
    }
}
*/

const initialCoverArt = {
  maybeFinalImageUrl: null,
  maybeCroppedImageUrl: null,
  sourceImage: {
    maybeLocalImageBlobUrl: null,
    maybeHttpImageUrl: null,
    maybeUnsplashImage: null,
  },
};

const initialCroppedImagePixels = { x: 0, y: 0, width: 1000, height: 1000 };

const initialState = {
  isShowing: false,
  scene: 'choose_path',
  coverArt: initialCoverArt,
  isFetching: false,
  isColorPickerShowing: false,
  isTextImageLoading: false,
  searchText: '',
  isTextColorLoading: false,
  isLoadingImageToCrop: false,
  isHidingImageSearch: false,
  font: '',
  imageChoices: [],
  zoomLevel: 1,
  cropXAxis: 0,
  cropYAxis: 0,
  croppedImagePixels: initialCroppedImagePixels,
  justification: 'center',
  alignment: 'center',
  textColor: '#ffffff',
  isTextShowing: true,
  textOverlayImages: [],
  isHidingNavigateBackButtonOnChooseScene: true,
  imageErrorText: null,
};

const isShowingReducer = (state = initialState.isShowing, action) => {
  switch (action.type) {
    case types.SET_IS_SHOWING:
      return action.payload.isShowing;
    case types.RESET_STATE:
      return initialState.isShowing;
    default:
      return state;
  }
};

const sceneReducer = (state = initialState.scene, action) => {
  switch (action.type) {
    case types.SET_SCENE:
      return action.payload.scene;
    case types.RESET_STATE:
      return initialState.scene;
    default:
      return state;
  }
};

const isHidingNavigateBackButtonOnChooseSceneReducer = (
  state = initialState.isHidingNavigateBackButtonOnChooseScene,
  action
) => {
  switch (action.type) {
    case types.SET_IS_HIDING_NAVIGATE_BACK_BUTTON_ON_CHOOSE_SCENE:
      return action.payload.isHidingNavigateBackButtonOnChooseScene;
    case types.RESET_STATE:
      return initialState.isHidingNavigateBackButtonOnChooseScene;
    default:
      return state;
  }
};

const isFetchingReducer = (state = initialState.isFetching, action) => {
  switch (action.type) {
    case types.SET_IS_FETCHING:
      return action.payload.isFetching;
    case types.FETCH_CROPPED_IMAGE_START:
    case types.FETCH_FINAL_COVER_ART_IMAGE_START:
      return true;
    case types.FETCH_CROPPED_IMAGE_SUCCEEDED:
    case types.FETCH_CROPPED_IMAGE_FAILURE:
    case types.FETCH_FINAL_COVER_ART_IMAGE_SUCCEEDED:
    case types.FETCH_FINAL_COVER_ART_IMAGE_FAILURE:
      return false;
    case types.RESET_STATE:
      return initialState.isFetching;
    default:
      return state;
  }
};

const coverArtReducer = (state = initialState.coverArt, action) => {
  switch (action.type) {
    case types.SET_COVER_ART:
      return action.payload.coverArt;
    case types.RESET_STATE:
      return initialState.coverArt;
    default:
      return state;
  }
};

const isColorPickerShowingReducer = (
  state = initialState.isColorPickerShowing,
  action
) => {
  switch (action.type) {
    case types.SET_IS_COLOR_PICKER_SHOWING:
      return action.payload.isColorPickerShowing;
    case types.RESET_STATE:
      return initialState.isColorPickerShowing;
    default:
      return state;
  }
};

const isTextImageLoadingReducer = (
  state = initialState.isTextImageLoading,
  action
) => {
  switch (action.type) {
    case types.SET_IS_TEXT_IMAGE_LOADING:
      return action.payload.isTextImageLoading;
    case types.FETCH_TEXT_OVERLAY_IMAGES_START:
      return true;
    case types.FETCH_TEXT_OVERLAY_IMAGES_SUCCEEDED:
    case types.FETCH_TEXT_OVERLAY_IMAGES_FAILURE:
      return false;
    case types.RESET_STATE:
      return initialState.isTextImageLoading;
    default:
      return state;
  }
};

const searchTextReducer = (state = initialState.searchText, action) => {
  switch (action.type) {
    case types.SET_SEARCH_TEXT:
      return action.payload.searchText;
    case types.RESET_STATE:
      return initialState.searchText;
    default:
      return state;
  }
};

const isTextColorLoadingReducer = (
  state = initialState.isTextColorLoading,
  action
) => {
  switch (action.type) {
    case types.SET_IS_TEXT_COLOR_LOADING:
      return action.payload.isTextColorLoading;
    case types.RESET_STATE:
      return initialState.isTextColorLoading;
    default:
      return state;
  }
};

const isLoadingImageToCropReducer = (
  state = initialState.isLoadingImageToCrop,
  action
) => {
  switch (action.type) {
    case types.SET_IS_LOADING_IMAGE_TO_CROP:
      return action.payload.isLoadingImageToCrop;
    case types.RESET_STATE:
      return initialState.isLoadingImageToCrop;
    default:
      return state;
  }
};

const isHidingImageSearchReducer = (
  state = initialState.isHidingImageSearch,
  action
) => {
  switch (action.type) {
    case types.SET_IS_HIDING_IMAGE_SEARCH:
      return action.payload.isHidingImageSearch;
    case types.RESET_STATE:
      return initialState.isHidingImageSearch;
    default:
      return state;
  }
};

const fontReducer = (state = initialState.font, action) => {
  switch (action.type) {
    case types.SET_FONT:
      return action.payload.font;
    case types.RESET_STATE:
      return initialState.font;
    default:
      return state;
  }
};

const imageChoicesReducer = (state = initialState.imageChoices, action) => {
  switch (action.type) {
    case types.SET_IMAGE_CHOICES:
      return action.payload.imageChoices;
    case types.ADD_IMAGE_CHOICES:
      return [...state, ...action.payload.imageChoices];
    case types.RESET_STATE:
      return initialState.imageChoices;
    default:
      return state;
  }
};

const zoomLevelReducer = (state = initialState.zoomLevel, action) => {
  switch (action.type) {
    case types.SET_ZOOM_LEVEL:
      return action.payload.zoomLevel;
    case types.RESET_STATE:
      return initialState.zoomLevel;
    default:
      return state;
  }
};
const cropXAxisReducer = (state = initialState.cropXAxis, action) => {
  switch (action.type) {
    case types.SET_CROP_X_AXIS:
      return action.payload.cropXAxis;
    case types.RESET_STATE:
      return initialState.cropXAxis;
    default:
      return state;
  }
};
const cropYAxisReducer = (state = initialState.cropYAxis, action) => {
  switch (action.type) {
    case types.SET_CROP_Y_AXIS:
      return action.payload.cropYAxis;
    case types.RESET_STATE:
      return initialState.cropYAxis;
    default:
      return state;
  }
};

const croppedImagePixelsReducer = (
  state = initialState.croppedImagePixels,
  action
) => {
  switch (action.type) {
    case types.SET_CROPPED_IMAGE_PIXELS:
      return action.payload.croppedImagePixels;
    case types.RESET_STATE:
      return initialState.croppedImagePixels;
    default:
      return state;
  }
};

const justificationReducer = (state = initialState.justification, action) => {
  switch (action.type) {
    case types.SET_JUSTIFICATION:
      return action.payload.justification;
    case types.RESET_STATE:
      return initialState.justification;
    default:
      return state;
  }
};

const alignmentReducer = (state = initialState.alignment, action) => {
  switch (action.type) {
    case types.SET_ALIGNMENT:
      return action.payload.alignment;
    case types.RESET_STATE:
      return initialState.alignment;
    default:
      return state;
  }
};

const textColorReducer = (state = initialState.textColor, action) => {
  switch (action.type) {
    case types.SET_TEXT_COLOR:
      return action.payload.textColor;
    case types.RESET_STATE:
      return initialState.textColor;
    default:
      return state;
  }
};

const isTextShowingReducer = (state = initialState.isTextShowing, action) => {
  switch (action.type) {
    case types.SET_IS_TEXT_SHOWING:
      return action.payload.isTextShowing;
    case types.RESET_STATE:
      return initialState.isTextShowing;
    default:
      return state;
  }
};

const textOverlayImagesReducer = (
  state = initialState.textOverlayImages,
  action
) => {
  switch (action.type) {
    case types.SET_TEXT_OVERLAY_IMAGES:
      return action.payload.textOverlayImages;
    case types.RESET_STATE:
      return initialState.textOverlayImages;
    default:
      return state;
  }
};

const imageErrorTextReducer = (state = initialState.imageErrorText, action) => {
  switch (action.type) {
    case types.FETCH_CROPPED_IMAGE_FAILURE:
      return action.payload.imageErrorText;
    case types.FETCH_CROPPED_IMAGE_START:
      return null;
    default:
      return state;
  }
};

const reducer = combineReducers({
  isShowing: isShowingReducer,
  isHidingNavigateBackButtonOnChooseScene: isHidingNavigateBackButtonOnChooseSceneReducer,
  scene: sceneReducer,
  coverArt: coverArtReducer,
  searchText: searchTextReducer,
  isHidingImageSearch: isHidingImageSearchReducer,
  zoomLevel: zoomLevelReducer,
  font: fontReducer,
  cropXAxis: cropXAxisReducer,
  isTextImageLoading: isTextImageLoadingReducer,
  isColorPickerShowing: isColorPickerShowingReducer,
  isFetching: isFetchingReducer,
  isTextColorLoading: isTextColorLoadingReducer,
  cropYAxis: cropYAxisReducer,
  croppedImagePixels: croppedImagePixelsReducer,
  imageChoices: imageChoicesReducer,
  justification: justificationReducer,
  alignment: alignmentReducer,
  textColor: textColorReducer,
  textOverlayImages: textOverlayImagesReducer,
  isTextShowing: isTextShowingReducer,
  isLoadingImageToCrop: isLoadingImageToCropReducer,
  imageErrorText: imageErrorTextReducer,
});

export default reducer;
