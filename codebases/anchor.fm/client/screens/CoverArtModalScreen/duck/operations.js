import {
  IMAGE_FILE_SIZE_LIMIT,
  IMAGE_FILE_SIZE_LIMIT_VIOLATED_MESSAGE,
  IMAGE_FILE_FAILED_TO_UPLOAD_MESSAGE,
} from 'helpers/constants';
import actions from './actions';
import { duckOperations as podcastOperations } from '../../../store/global/podcast';
import AnchorAPI from '../../../modules/AnchorAPI';
import getCroppedImageAsBlob from '../getCroppedImageAsBlob';

const setCoverArtSourceImage = coverArtSourceImage => (dispatch, getState) => {
  const { coverArtModalScreen } = getState();
  const { coverArt } = coverArtModalScreen;
  dispatch(
    actions.setCoverArt({
      ...coverArt,
      sourceImage: coverArtSourceImage,
    })
  );
};

// return a promise that resolves with a File instance
const urlToFile = (url, filename, mimeType) =>
  fetch(url)
    .then(res => res.arrayBuffer())
    .then(
      buf => new File([buf], filename, mimeType ? { type: mimeType } : null)
    );

// Note: result can include the min and max numbers
const randomIntFromInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const fetchImageChoices = (searchText, offset) => dispatch => {
  dispatch(actions.fetchImageChoicesStart());

  AnchorAPI.fetchCoverArtImageChoices(searchText, offset)
    .then(imageChoices => {
      dispatch(actions.fetchImageChoicesSucceeded());
      dispatch(actions.setImageChoices(imageChoices));
    })
    .catch(() => {
      dispatch(actions.fetchImageChoicesFailure());
    });
};

const setCoverArtImageSourceToARandomImageChoice = () => (
  dispatch,
  getState
) => {
  const { coverArtModalScreen } = getState();
  const { imageChoices } = coverArtModalScreen;
  const randomImageChoiceIndex = randomIntFromInterval(
    0,
    imageChoices.length - 1
  );
  const randomImageChoice = imageChoices[randomImageChoiceIndex];
  dispatch(
    setCoverArtSourceImage({
      maybeLocalImageBlobUrl: null,
      maybeHttpImageUrl: null,
      maybeUnsplashImage: randomImageChoice,
    })
  );
};

const setCoverArtSourceToPodcastImage = () => (dispatch, getState) => {
  const { global, coverArtModalScreen } = getState();
  const { coverArt } = coverArtModalScreen;
  const { podcast } = global.podcast;
  const { metadata } = podcast;
  const { podcastImageFull } = metadata;
  dispatch(
    actions.setCoverArt({
      ...coverArt,
      sourceImage: {
        maybeHttpImageUrl: podcastImageFull || '',
        maybeLocalImageBlobUrl: null,
        maybeUnsplashImage: null,
      },
    })
  );
};

const setSearchTextAndFetchImages = searchText => dispatch => {
  dispatch(actions.setSearchText(searchText));
  dispatch(fetchImageChoices(searchText, 0));
};

const fetchAnotherBatchOfImages = () => (dispatch, getState) => {
  const { coverArtModalScreen } = getState();
  const { searchText, imageChoices } = coverArtModalScreen;
  const offset = imageChoices.length;
  dispatch(actions.fetchImageChoicesStart());
  AnchorAPI.fetchCoverArtImageChoices(searchText, offset)
    .then(imageChoicesJSON => {
      dispatch(actions.fetchImageChoicesSucceeded());
      dispatch(actions.addImageChoices(imageChoicesJSON));
    })
    .catch(() => {
      dispatch(actions.fetchImageChoicesFailure());
    });
};

const fetchTextOverlayImages = fontName => (dispatch, getState) => {
  const { global } = getState();
  const { podcast } = global.podcast;
  const { metadata, webStationId } = podcast;
  const { podcastName } = metadata;
  dispatch(actions.fetchTextOverlayImagesStart());

  AnchorAPI.fetchCoverArtTextOverlay({ podcastName, fontName, webStationId })
    .then(overlays => {
      dispatch(actions.fetchTextOverlayImagesSucceeded());
      dispatch(actions.setTextOverlayImages(overlays));
    })
    .catch(err => {
      dispatch(actions.fetchTextOverlayImagesFailure(err));
    });
};

const fetchCroppedImage = () => (dispatch, getState) => {
  const { coverArtModalScreen } = getState();
  const { croppedImagePixels, coverArt } = coverArtModalScreen;
  const { x, y, width, height } = croppedImagePixels;
  dispatch(actions.fetchCroppedImageStart());
  if (coverArt.sourceImage.maybeLocalImageBlobUrl) {
    // client-side crop with canvas
    return getCroppedImageAsBlob(
      coverArt.sourceImage.maybeLocalImageBlobUrl,
      croppedImagePixels
    )
      .then(blob => {
        if (blob.size > IMAGE_FILE_SIZE_LIMIT) {
          dispatch(
            actions.fetchCroppedImageFailure(
              IMAGE_FILE_SIZE_LIMIT_VIOLATED_MESSAGE
            )
          );
          return false;
        }
        const blobUrl = URL.createObjectURL(blob);
        dispatch(actions.fetchCroppedImageSucceeded());
        dispatch(
          actions.setCoverArt({
            ...coverArt,
            maybeCroppedImageUrl: blobUrl,
          })
        );
        return true;
      })
      .catch(err => {
        dispatch(
          actions.fetchCroppedImageFailure(IMAGE_FILE_FAILED_TO_UPLOAD_MESSAGE)
        );
        return false;
      });
  }
  if (coverArt.sourceImage.maybeHttpImageUrl) {
    return AnchorAPI.fetchCroppedImage({
      imageUrl: coverArt.sourceImage.maybeHttpImageUrl,
      x,
      y,
      width,
      height,
    })
      .then(responseJSON => {
        dispatch(actions.fetchCroppedImageSucceeded());
        // dispatch(actions.setCroppedCoverArtImageUrl(responseJSON.previewUrl));
        dispatch(
          actions.setCoverArt({
            ...coverArt,
            maybeCroppedImageUrl: responseJSON.previewUrl,
          })
        );
        return true;
      })
      .catch(err => {
        dispatch(
          actions.fetchCroppedImageFailure(IMAGE_FILE_FAILED_TO_UPLOAD_MESSAGE)
        );
        return false;
      });
  }
  if (coverArt.sourceImage.maybeUnsplashImage) {
    return AnchorAPI.fetchCroppedImage({
      imageUrl: coverArt.sourceImage.maybeUnsplashImage.fullResUrl,
      x,
      y,
      width,
      height,
    })
      .then(responseJSON => {
        dispatch(actions.fetchCroppedImageSucceeded());
        dispatch(
          actions.setCoverArt({
            ...coverArt,
            maybeCroppedImageUrl: responseJSON.previewUrl,
          })
        );
        return true;
      })
      .catch(err => {
        dispatch(
          actions.fetchCroppedImageFailure(IMAGE_FILE_FAILED_TO_UPLOAD_MESSAGE)
        );
        return false;
      });
  }
  return true;
};

// TODO: this should change selectedCoverArt as the fucntion name implies, not coverARtImageUrl
const setSelectedImageUrl = thumbnailUrl => (dispatch, getState) => {
  const { coverArtModalScreen } = getState();
  const { imageChoices } = coverArtModalScreen;
  const selectedImage = imageChoices.find(
    imageChoice => imageChoice.thumbnailUrl === thumbnailUrl
  );
  const { fullResUrl } = selectedImage;
  dispatch(actions.setCoverArtImageUrl(fullResUrl));
};

const setCoverArtImageUrlToFont = fontName => (dispatch, getState) => {
  dispatch(fetchTextOverlayImages(fontName));
};

const createFinalCoverArtAndLoad = onFinishSubmitCoverArt => (
  dispatch,
  getState
) => {
  const { coverArtModalScreen, global } = getState();
  const { podcast } = global.podcast;
  const { metadata } = podcast;
  const { podcastName, hasAnchorBranding } = metadata;
  const {
    croppedImagePixels,
    font,
    justification,
    alignment,
    textColor,
    isTextShowing,
    coverArt,
  } = coverArtModalScreen;
  dispatch(actions.fetchFinalCoverArtImageStart());
  const fetchFinalCoverArtImage = (imageUrl, { x, y, width, height }) => {
    AnchorAPI.fetchFinalCoverArtImage({
      imageUrl,
      podcastName,
      fontName: font,
      x,
      y,
      width,
      height,
      fillHex: textColor,
      horizontalAlignment: justification,
      verticalAlignment: alignment,
      text: isTextShowing ? podcastName || '' : '',
    })
      .then(coverArtJson => {
        AnchorAPI.createAnchorImagesFromImageUrl(coverArtJson.url, {
          hasAnchorBranding,
          doOverrideSize: true,
        }).then(uploadImageJson => {
          const { image, image400 } = uploadImageJson;
          return Promise.all([
            AnchorAPI.updatePodcastMetadataDeprecated({
              podcastImage: image,
              podcastImage400: image400, // TODO: We should actually add the correct size
              hasAnchorBranding,
            }),
          ])
            .then(() => {})
            .finally(() => {
              dispatch(actions.setScene('choose_path'));
              onFinishSubmitCoverArt({ image400, image });
            });
        });
      })
      .catch(err => {
        console.log(err);
        dispatch(actions.fetchFinalCoverArtImageFailure());
      });
  };
  dispatch(actions.fetchCroppedImageStart());
  if (coverArt.sourceImage.maybeLocalImageBlobUrl) {
    urlToFile(coverArt.maybeCroppedImageUrl, 'hello.txt')
      .then(imageFile => AnchorAPI.uploadImage({ imageBlob: imageFile }))
      .then(responseJSON =>
        fetchFinalCoverArtImage(
          responseJSON && responseJSON.json && responseJSON.json.image,
          {
            // crop happened client-side; override to a full cover art size
            x: 0,
            y: 0,
            width: 3000,
            height: 3000,
          }
        )
      );
  } else if (coverArt.sourceImage.maybeHttpImageUrl) {
    fetchFinalCoverArtImage(
      coverArt.sourceImage.maybeHttpImageUrl,
      croppedImagePixels
    );
  } else if (coverArt.sourceImage.maybeUnsplashImage) {
    fetchFinalCoverArtImage(
      coverArt.sourceImage.maybeUnsplashImage.fullResUrl,
      croppedImagePixels
    );
  }
};

const selectUnsplashImage = unsplashImage => (dispatch, getState) => {
  dispatch(actions.setIsLoadingImageToCrop(true));
  setTimeout(() => {
    dispatch(actions.setIsLoadingImageToCrop(false));
  }, 1000);
  dispatch(
    setCoverArtSourceImage({
      maybeHttpImageUrl: null,
      maybeLocalImageBlobUrl: null,
      maybeUnsplashImage: unsplashImage,
    })
  );
};

const toggleIsTextShowing = () => (dispatch, getState) => {
  const { coverArtModalScreen } = getState();
  const { isTextShowing } = coverArtModalScreen;
  dispatch(actions.setIsTextShowing(!isTextShowing));
};

const resetLocalAndUnsplashImageSource = () => (dispatch, getState) => {
  const { global } = getState();
  const { podcast } = global.podcast;
  const { metadata } = podcast;
  const { podcastImageFull } = metadata;
  dispatch(
    setCoverArtSourceImage({
      maybeHttpImageUrl: podcastImageFull || null,
      maybeLocalImageBlobUrl: null,
      maybeUnsplashImage: null,
    })
  );
};

const resetZoomAndCropPositions = () => dispatch => {
  dispatch(actions.setZoomLevel(1));
  dispatch(actions.setCropXAxis(0));
  dispatch(actions.setCropYAxis(0));
};

const closeAndResetState = () => dispatch => {
  dispatch(actions.setIsShowing(false));
  // We want to make sure the modal is not visible before reseting the state
  // TODO: Use promises or non-arbitrary timeout
  setTimeout(() => {
    dispatch(actions.resetState());
  }, 200);
};

const resetState = () => dispatch => {
  dispatch(actions.resetState());
};

const setupStore = () => dispatch => {
  dispatch(setCoverArtSourceToPodcastImage());
  dispatch(fetchImageChoices('', 0));
  dispatch(podcastOperations.fetchPodcastAndSet()).then(() => {
    dispatch(setCoverArtSourceToPodcastImage());
  });
};

const openAndSetupStore = () => dispatch => {
  dispatch(actions.setIsShowing(true));
  dispatch(setupStore());
};

const {
  setIsShowing,
  setZoomLevel,
  setCropXAxis,
  setCropYAxis,
  setScene,
  setIsFetching,
  setJustification,
  setAlignment,
  setTextColor,
  setCroppedImagePixels,
  setFont,
  setIsTextShowing,
  setIsHidingImageSearch,
  setIsLoadingImageToCrop,
  setIsColorPickerShowing,
  setIsTextColorLoading,
  setIsHidingNavigateBackButtonOnChooseScene,
} = actions;

export default {
  resetState,
  setupStore,
  openAndSetupStore,
  setIsHidingNavigateBackButtonOnChooseScene,
  closeAndResetState,
  resetZoomAndCropPositions,
  setIsShowing,
  selectUnsplashImage,
  setScene,
  setIsLoadingImageToCrop,
  setIsHidingImageSearch,
  setIsColorPickerShowing,
  setCoverArtSourceToPodcastImage,
  setCoverArtSourceImage,
  setCoverArtImageSourceToARandomImageChoice,
  fetchImageChoices,
  setZoomLevel,
  setCropXAxis,
  setCropYAxis,
  setIsTextColorLoading,
  setFont,
  setIsFetching,
  setCroppedImagePixels,
  setSearchTextAndFetchImages,
  fetchAnotherBatchOfImages,
  resetLocalAndUnsplashImageSource,
  fetchCroppedImage,
  setJustification,
  setAlignment,
  setTextColor,
  fetchTextOverlayImages,
  setCoverArtImageUrlToFont,
  createFinalCoverArtAndLoad,
  setIsTextShowing,
  toggleIsTextShowing,
};
