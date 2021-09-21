import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { duckOperations as podcastOperations } from '../../store/global/podcast';

import CoverArtModalScreen from './CoverArtModalScreen';

import { duckOperations } from './duck';
import { setHasAnchorBranding } from '../../store/global/podcast/actions';

const noop = () => null;

const getTextOverlayImageUrlForAlignments = (
  horizontalAlignment,
  verticalAlignment,
  overlays
) => {
  const overlay = overlays.find(
    overlay =>
      overlay.horizontalAlignment === horizontalAlignment &&
      overlay.verticalAlignment === verticalAlignment
  );
  return overlay ? overlay.previewUrl : '';
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const {
    onFinishSubmitCoverArt,
    onWillClose,
    onDidPressNavigateFromChooseScene,
  } = ownProps;
  return {
    onComponentDidMount: () => {
      dispatch(duckOperations.setupStore());
    },
    onClickClose: () => {
      onWillClose();
    },
    onPressNavigateBack: currentScene => {
      switch (currentScene) {
        case 'choose_path':
          onDidPressNavigateFromChooseScene();
          return null;
        case 'image_search':
          dispatch(duckOperations.resetLocalAndUnsplashImageSource());
          dispatch(duckOperations.setIsHidingImageSearch(false));
          dispatch(duckOperations.setScene('choose_path'));
          return null;
        case 'text_edit':
          dispatch(duckOperations.setScene('image_search'));
          return null;
        case 'finalize':
          dispatch(duckOperations.setScene('text_edit'));
          return null;
        default:
          return null;
        // TODO: What should go here?
      }
    },
    onSearchTextChange: textValue => {
      dispatch(duckOperations.setSearchTextAndFetchImages(textValue));
    },
    onRequestMoreItems: () => {
      dispatch(duckOperations.fetchAnotherBatchOfImages());
    },
    onChangeZoomLevel: value => {
      dispatch(duckOperations.setZoomLevel(value));
    },
    onCropPositionChange: cords => {
      const { x, y } = cords;
      dispatch(duckOperations.setCropXAxis(x));
      dispatch(duckOperations.setCropYAxis(y));
    },
    onCropComplete: (croppedArea, croppedAreaPixels) => {
      dispatch(duckOperations.setCroppedImagePixels(croppedAreaPixels));
    },
    onSubmitCroppedPhoto: () => {
      dispatch(duckOperations.fetchCroppedImage()).then(cropResult => {
        if (cropResult) {
          dispatch(duckOperations.setScene('text_edit'));
          dispatch(setHasAnchorBranding(true));
          dispatch(podcastOperations.fetchPodcastAndSet()).then(() => {
            const defaultFont = 'DMSans-Bold';
            dispatch(duckOperations.setFont(defaultFont));
            dispatch(duckOperations.fetchTextOverlayImages(defaultFont));
          });
        } else {
          dispatch(duckOperations.resetLocalAndUnsplashImageSource());
          dispatch(duckOperations.setIsHidingImageSearch(false));
          dispatch(duckOperations.setScene('choose_path'));
        }
      });
    },
    onSelectImage: unsplashImage => {
      dispatch(duckOperations.selectUnsplashImage(unsplashImage));
      dispatch(duckOperations.resetZoomAndCropPositions());
    },
    onToggleApplyText: () => {
      dispatch(duckOperations.toggleIsTextShowing());
    },
    setHasAnchorBranding: hasAnchorBranding => {
      dispatch(setHasAnchorBranding(hasAnchorBranding));
    },
    onSelectFont: font => {
      dispatch(duckOperations.setCoverArtImageUrlToFont(font.id));
      dispatch(duckOperations.setFont(font.id));
    },
    onClickColorPickerHide: () => {
      dispatch(duckOperations.setIsColorPickerShowing(false));
    },
    onClickColorPickerShow: () => {
      dispatch(duckOperations.setIsColorPickerShowing(true));
    },
    onSelectJustification: justification => {
      dispatch(duckOperations.setJustification(justification));
    },
    onSelectAlignment: alignment => {
      dispatch(duckOperations.setAlignment(alignment));
    },
    onSelectColor: hexColor => {
      dispatch(duckOperations.setTextColor(hexColor));
    },
    onChooseSearchPath: () => {
      dispatch(duckOperations.setCoverArtImageSourceToARandomImageChoice());
      dispatch(duckOperations.setScene('image_search'));
    },
    onChooseUploadPath: fileObj => {
      const localImageUrl = window.URL.createObjectURL(fileObj);
      dispatch(
        duckOperations.setCoverArtSourceImage({
          maybeHttpImageUrl: null,
          maybeLocalImageBlobUrl: localImageUrl,
          maybeUnsplashImage: null,
        })
      );
      dispatch(duckOperations.setIsHidingImageSearch(true));
      dispatch(duckOperations.setScene('image_search'));
    },
    onChooseRandomPath: () => {
      dispatch(duckOperations.setCoverArtImageSourceToARandomImageChoice());
      dispatch(duckOperations.setScene('image_search'));
      dispatch(duckOperations.setIsHidingImageSearch(true));
    },
    onSubmitCoverArt: () => {
      dispatch(
        duckOperations.createFinalCoverArtAndLoad(onFinishSubmitCoverArt)
      );
    },
    onCloseModal: () => {
      dispatch(duckOperations.closeAndResetState());
    },
  };
};
const mapStateToProps = ({ coverArtModalScreen, global }, ownProps) => {
  const { podcast } = global.podcast;
  const { metadata } = podcast;
  const { podcastName, hasAnchorBranding } = metadata;
  const {
    isShowing,
    isFetching,
    zoomLevel,
    cropXAxis,
    cropYAxis,
    scene,
    coverArt,
    imageChoices,
    isTextColorLoading,
    searchText,
    justification,
    alignment,
    textOverlayImages,
    // 'https://s3.amazonaws.com/anchor-tmp-images/tmp-images/left-top-Raleway-Bold-r3aqfn7i9bo.png',
    textColor,
    isTextShowing,
    isHidingImageSearch,
    isHidingNavigateBackButtonOnChooseScene,
    // TODO: this shold change when we change the data structure for selectedCoverArt
    font,
    isLoadingImageToCrop,
    isTextImageLoading,
    isColorPickerShowing,
    imageErrorText,
  } = coverArtModalScreen;
  return {
    podcastName,
    isShowing,
    isAnchorWatermarkShowing: hasAnchorBranding,
    isHidingNavigateBackButtonOnChooseScene,
    isFetching,
    zoomLevel,
    xCropPosition: cropXAxis,
    yCropPosition: cropYAxis,
    scene,
    isTextColorLoading,
    coverArt,
    unsplashImages: imageChoices,
    searchText,
    textImageUrl: getTextOverlayImageUrlForAlignments(
      justification,
      alignment,
      textOverlayImages
    ),
    textColor,
    textHex: textColor,
    isTextShowing,
    isHidingImageSearch,
    isLoadingImageToCrop,
    justification,
    alignment,
    maybeSelectedFontId: font,
    isTextImageLoading,
    isColorPickerShowing,
    imageErrorText,
  };
};

class CoverArtModalScreenStateful extends Component {
  componentDidMount() {
    const { onComponentDidMount } = this.props;
    onComponentDidMount();
  }

  render() {
    return <CoverArtModalScreen {...this.props} />;
  }
}

const CoverArtModalScreenContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CoverArtModalScreenStateful);

CoverArtModalScreenStateful.propTypes = {
  onComponentDidMount: PropTypes.func,
};

CoverArtModalScreenStateful.defaultProps = {
  onComponentDidMount: noop,
};

CoverArtModalScreenContainer.propTypes = {
  onWillClose: PropTypes.func, // Takes an function that continues the process
  onFinishSubmitCoverArt: PropTypes.func,
  onDidPressNavigateFromChooseScene: PropTypes.func,
};

CoverArtModalScreenContainer.defaultProps = {
  onWillClose: noop,
  onFinishSubmitCoverArt: noop,
  onDidPressNavigateFromChooseScene: noop,
};

export default CoverArtModalScreenContainer;
