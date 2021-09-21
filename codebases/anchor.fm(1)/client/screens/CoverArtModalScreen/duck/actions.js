import types from './types';

const resetState = () => ({
  type: types.RESET_STATE,
});

const setIsShowing = isShowing => ({
  type: types.SET_IS_SHOWING,
  payload: {
    isShowing,
  },
});

const setIsHidingNavigateBackButtonOnChooseScene = isHidingNavigateBackButtonOnChooseScene => ({
  type: types.SET_IS_HIDING_NAVIGATE_BACK_BUTTON_ON_CHOOSE_SCENE,
  payload: {
    isHidingNavigateBackButtonOnChooseScene,
  },
});

const setScene = scene => ({
  type: types.SET_SCENE,
  payload: {
    scene,
  },
});

const setSearchText = searchText => ({
  type: types.SET_SEARCH_TEXT,
  payload: {
    searchText,
  },
});

const setIsFetching = isFetching => ({
  type: types.SET_IS_FETCHING,
  payload: {
    isFetching,
  },
});

const setIsLoadingImageToCrop = isLoadingImageToCrop => ({
  type: types.SET_IS_LOADING_IMAGE_TO_CROP,
  payload: {
    isLoadingImageToCrop,
  },
});

const setIsTextImageLoading = isTextImageLoading => ({
  type: types.SET_IS_TEXT_IMAGE_LOADING,
  payload: {
    isTextImageLoading,
  },
});

const setIsTextColorLoading = isTextColorLoading => ({
  type: types.SET_IS_TEXT_COLOR_LOADING,
  payload: {
    isTextColorLoading,
  },
});

const setIsColorPickerShowing = isColorPickerShowing => ({
  type: types.SET_IS_COLOR_PICKER_SHOWING,
  payload: {
    isColorPickerShowing,
  },
});

const setImageChoices = imageChoices => ({
  type: types.SET_IMAGE_CHOICES,
  payload: {
    imageChoices,
  },
});

const setZoomLevel = zoomLevel => ({
  type: types.SET_ZOOM_LEVEL,
  payload: {
    zoomLevel,
  },
});

const setCropXAxis = cropXAxis => ({
  type: types.SET_CROP_X_AXIS,
  payload: {
    cropXAxis,
  },
});

const setCropYAxis = cropYAxis => ({
  type: types.SET_CROP_Y_AXIS,
  payload: {
    cropYAxis,
  },
});

const setCroppedImagePixels = croppedImagePixels => ({
  type: types.SET_CROPPED_IMAGE_PIXELS,
  payload: {
    croppedImagePixels,
  },
});

const addImageChoices = imageChoices => ({
  type: types.ADD_IMAGE_CHOICES,
  payload: {
    imageChoices,
  },
});

const fetchImageChoicesStart = () => ({
  type: types.FETCH_IMAGE_CHOICES_START,
});

const fetchImageChoicesSucceeded = () => ({
  type: types.FETCH_IMAGE_CHOICES_SUCCEEDED,
});

const fetchImageChoicesFailure = error => ({
  type: types.FETCH_IMAGE_CHOICES_FAILURE,
  payload: {
    error,
  },
});

const fetchCroppedImageStart = () => ({
  type: types.FETCH_CROPPED_IMAGE_START,
});

const fetchCroppedImageSucceeded = () => ({
  type: types.FETCH_CROPPED_IMAGE_SUCCEEDED,
});

const fetchCroppedImageFailure = imageErrorText => ({
  type: types.FETCH_CROPPED_IMAGE_FAILURE,
  payload: {
    imageErrorText,
  },
});

const setJustification = justification => ({
  type: types.SET_JUSTIFICATION,
  payload: {
    justification,
  },
});

const setAlignment = alignment => ({
  type: types.SET_ALIGNMENT,
  payload: {
    alignment,
  },
});

const setTextColor = textColor => ({
  type: types.SET_TEXT_COLOR,
  payload: {
    textColor,
  },
});
const setFont = font => ({
  type: types.SET_FONT,
  payload: {
    font,
  },
});

const fetchTextOverlayImagesStart = () => ({
  type: types.FETCH_TEXT_OVERLAY_IMAGES_START,
});

const fetchTextOverlayImagesSucceeded = () => ({
  type: types.FETCH_TEXT_OVERLAY_IMAGES_SUCCEEDED,
});

const fetchTextOverlayImagesFailure = () => ({
  type: types.FETCH_TEXT_OVERLAY_IMAGES_FAILURE,
});

const setTextOverlayImages = textOverlayImages => ({
  type: types.SET_TEXT_OVERLAY_IMAGES,
  payload: {
    textOverlayImages,
  },
});

const fetchFinalCoverArtImageStart = () => ({
  type: types.FETCH_FINAL_COVER_ART_IMAGE_START,
});

const fetchFinalCoverArtImageSucceeded = () => ({
  type: types.FETCH_FINAL_COVER_ART_IMAGE_SUCCEEDED,
});

const fetchFinalCoverArtImageFailure = () => ({
  type: types.FETCH_FINAL_COVER_ART_IMAGE_FAILURE,
});

const setIsTextShowing = isTextShowing => ({
  type: types.SET_IS_TEXT_SHOWING,
  payload: {
    isTextShowing,
  },
});

const setIsHidingImageSearch = isHidingImageSearch => ({
  type: types.SET_IS_HIDING_IMAGE_SEARCH,
  payload: {
    isHidingImageSearch,
  },
});

const setCoverArt = coverArt => ({
  type: types.SET_COVER_ART,
  payload: {
    coverArt,
  },
});

export default {
  resetState,
  setIsShowing,
  setScene,
  setSearchText,
  setCoverArt,
  setIsHidingNavigateBackButtonOnChooseScene,
  setIsFetching,
  setIsHidingImageSearch,
  addImageChoices,
  setImageChoices,
  setZoomLevel,
  setCropXAxis,
  setCropYAxis,
  setIsLoadingImageToCrop,
  setFont,
  setCroppedImagePixels,
  setIsColorPickerShowing,
  setIsTextColorLoading,
  setIsTextImageLoading,
  fetchImageChoicesStart,
  fetchImageChoicesSucceeded,
  fetchImageChoicesFailure,
  fetchCroppedImageStart,
  fetchCroppedImageSucceeded,
  fetchCroppedImageFailure,
  setJustification,
  setAlignment,
  setTextColor,
  fetchTextOverlayImagesStart,
  fetchTextOverlayImagesSucceeded,
  fetchTextOverlayImagesFailure,
  setTextOverlayImages,
  fetchFinalCoverArtImageStart,
  fetchFinalCoverArtImageSucceeded,
  fetchFinalCoverArtImageFailure,
  setIsTextShowing,
};
