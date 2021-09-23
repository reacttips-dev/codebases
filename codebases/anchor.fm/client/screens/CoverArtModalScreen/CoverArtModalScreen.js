import React from 'react';
import PropTypes from 'prop-types';
import { EditTextScene } from './components/EditTextScene';
import ImageSearchScene from './components/ImageSearchScene';
import ChoosePathScene from './components/ChoosePathScene';
import Box from '../../shared/Box';
import Icon from '../../shared/Icon';
import Pressable from '../../shared/Pressable';
import Hoverable from '../../shared/Hoverable';
import If from '../../shared/If';
import { Modal } from '../../shared/Modal';
import styles from './CoverArtModalScreen.sass';

const noop = () => null;

const getSourceImageUrlToCropFromSourceImage = sourceImage => {
  if (sourceImage.maybeLocalImageBlobUrl) {
    return sourceImage.maybeLocalImageBlobUrl;
  }
  if (sourceImage.maybeHttpImageUrl) {
    return sourceImage.maybeHttpImageUrl;
  }
};

const CoverArtModalScreen = ({
  podcastName,
  isShowing,
  onClickOutside,
  isFetching,
  coverArt,
  onPressNavigateBack,
  isHidingNavigateBackButtonOnChooseScene,
  scene,
  onChooseSearchPath,
  onChooseUploadPath,
  onChooseRandomPath,
  //
  isHidingImageSearch,
  unsplashImages,
  searchText,
  onSearchTextChange,
  onRequestMoreItems,
  onChangeZoomLevel,
  zoomLevel,
  xCropPosition,
  yCropPosition,
  onCropPositionChange,
  onSelectImage,
  isLoadingImageToCrop,
  onCropComplete,
  onSubmitCroppedPhoto,
  onClickClose,
  onToggleApplyText,
  isColorPickerShowing,
  onClickColorPickerHide,
  onClickColorPickerShow,
  textImageUrl,
  maybeSelectedFontId,
  isTextImageLoading,
  textHex,
  isTextShowing,
  isTextColorLoading,
  onSelectFont,
  onSelectJustification,
  justification,
  onSelectAlignment,
  alignment,
  onSelectColor,
  //
  onSubmitCoverArt,
  isAnchorWatermarkShowing,
  setHasAnchorBranding,
  imageErrorText,
}) => {
  const isShowingBackButton =
    scene !== 'choose_path' ||
    (!isHidingNavigateBackButtonOnChooseScene && scene === 'choose_path');
  return (
    <div className={styles.root}>
      <Modal
        isShowing={isShowing}
        onClickOutside={onClickOutside}
        contentClassName={styles.modalContent}
        dialogClassName={styles.modalDialog}
        // className={styles.modal}
        renderContent={() => (
          <Box color="white" height="100%" overflow="scrollY" width="100%">
            <Box
              position="relative"
              marginTop={30}
              marginBottom={30}
              smMarginLeft={0}
              smMarginRight={0}
              mdMarginLeft={40}
              mdMarginRight={40}
              lgMarginLeft={40}
              lgMarginRight={40}
              height="100%"
              display="flex"
              minHeight="min-content"
              justifyContent="center"
              alignItems="center"
            >
              <Box width="100%">
                <If
                  condition={scene === 'choose_path'}
                  ifRender={() => (
                    <ChoosePathScene
                      imageErrorText={imageErrorText}
                      coverArtImageUrl={getSourceImageUrlToCropFromSourceImage(
                        coverArt.sourceImage
                      )}
                      onChooseSearchPath={() => onChooseSearchPath(podcastName)}
                      onChooseRandomPath={() => onChooseRandomPath(podcastName)}
                      onChooseUploadPath={onChooseUploadPath}
                    />
                  )}
                />
                <If
                  condition={scene === 'image_search'}
                  ifRender={() => (
                    <ImageSearchScene
                      coverArt={coverArt}
                      unsplashImages={unsplashImages}
                      searchText={searchText}
                      onSearchTextChange={onSearchTextChange}
                      onRequestMoreItems={onRequestMoreItems}
                      onChangeZoomLevel={onChangeZoomLevel}
                      zoomLevel={zoomLevel}
                      onSubmitCroppedPhoto={onSubmitCroppedPhoto}
                      xCropPosition={xCropPosition}
                      yCropPosition={yCropPosition}
                      onCropPositionChange={onCropPositionChange}
                      onSelectImage={onSelectImage}
                      onCropComplete={onCropComplete}
                      isHidingImageSearch={isHidingImageSearch}
                      isLoadingImageToCrop={isLoadingImageToCrop}
                      isButtonDisabled={isFetching}
                      isButtonProcessing={isFetching}
                    />
                  )}
                />
                <If
                  condition={scene === 'text_edit'}
                  ifRender={() => (
                    <EditTextScene
                      croppedCoverArtImageUrl={
                        coverArt.maybeCroppedImageUrl || ''
                      }
                      onToggleApplyText={onToggleApplyText}
                      textImageUrl={textImageUrl}
                      textHex={textHex}
                      isTextShowing={isTextShowing}
                      onSelectFont={onSelectFont}
                      onSelectJustification={onSelectJustification}
                      isColorPickerShowing={isColorPickerShowing}
                      onClickColorPickerHide={onClickColorPickerHide}
                      onClickColorPickerShow={onClickColorPickerShow}
                      justification={justification}
                      onSelectAlignment={onSelectAlignment}
                      alignment={alignment}
                      maybeSelectedFontId={maybeSelectedFontId}
                      isTextImageLoading={isTextImageLoading}
                      onSelectColor={onSelectColor}
                      onSubmitCoverArt={onSubmitCoverArt}
                      isButtonDisabled={isFetching}
                      isButtonProcessing={isFetching}
                      isAnchorWatermarkShowing={isAnchorWatermarkShowing}
                      setHasAnchorBranding={setHasAnchorBranding}
                      isTextColorLoading={isTextColorLoading}
                    />
                  )}
                />
              </Box>
            </Box>
            <If
              condition={!isShowingBackButton && scene === 'choose_path'}
              ifRender={() => (
                <Box
                  position="absolute"
                  top
                  left
                  smMarginLeft={10}
                  smMarginTop={10}
                  mdMarginLeft={61}
                  mdMarginTop={35}
                  lgMarginLeft={61}
                  lgMarginTop={35}
                >
                  <Pressable
                    onPress={() => {
                      onClickClose();
                    }}
                  >
                    {({ isPressed }) => (
                      <Hoverable>
                        {({ isHovering }) => (
                          <Box
                            shape="circle"
                            width={35}
                            height={35}
                            borderColor={isHovering ? '#dfe0e1' : '#dfe0e1'}
                            padding={8}
                          >
                            <Icon type="x" fillColor="#979797" />
                          </Box>
                        )}
                      </Hoverable>
                    )}
                  </Pressable>
                </Box>
              )}
            />
            <If
              condition={isShowingBackButton}
              ifRender={() => (
                <Box
                  position="absolute"
                  top
                  left
                  smMarginLeft={10}
                  smMarginTop={10}
                  mdMarginLeft={61}
                  mdMarginTop={35}
                  lgMarginLeft={61}
                  lgMarginTop={35}
                >
                  <Pressable
                    onPress={() => {
                      onPressNavigateBack(scene);
                    }}
                  >
                    {({ isPressed }) => (
                      <Hoverable>
                        {({ isHovering }) => (
                          <Box
                            shape="circle"
                            width={30}
                            height={30}
                            color={
                              isPressed
                                ? '#dfe0e1'
                                : isHovering
                                ? '#f2f2f3'
                                : 'transparent'
                            }
                            borderColor={isHovering ? '#dfe0e1' : '#dfe0e1'}
                            padding={5}
                          >
                            <Icon type="left_arrow" fillColor="#979797" />
                          </Box>
                        )}
                      </Hoverable>
                    )}
                  </Pressable>
                </Box>
              )}
            />
          </Box>
        )}
      />
    </div>
  );
};

const unSplashImagePropType = PropTypes.shape({
  thumbnailUrl: PropTypes.string.isRequired,
  fullResUrl: PropTypes.string.isRequired,
  id: PropTypes.string,
  authorName: PropTypes.string,
});

const coverArtPropType = PropTypes.shape({
  maybeCroppedImageUrl: PropTypes.string,
  maybeFinalImageUrl: PropTypes.string,
  sourceImage: PropTypes.shape({
    maybeUnsplashImage: unSplashImagePropType,
    maybeLocalImageBlobUrl: PropTypes.string,
    maybeHttpImageUrl: PropTypes.string,
  }),
});

CoverArtModalScreen.defaultProps = {
  podcastName: null,
  isShowing: false,
  scene: 'image_search',
  //
  onChooseSearchPath: noop,
  onChooseUploadPath: noop,
  onChooseRandomPath: noop,
  //
  croppedCoverArtImageUrl: '',
  onToggleApplyText: noop,
  textImageUrl: '',
  textHex: '#ffffff',
  isTextShowing: true,
  onSelectFont: noop,
  onSelectJustification: noop,
  justification: 'center',
  onSelectAlignment: noop,
  alignment: 'top',
  onSelectColor: noop,
  unsplashImages: [],
  searchText: '',
  zoomLevel: 1,
  onSelectImage: noop,
  selectedImageUrl: '',
  xCropPosition: 0,
  yCropPosition: 0,
  isTextColorLoading: false,
  onSearchTextChange: noop,
  onRequestMoreItems: noop,
  onChangeZoomLevel: noop,
  onSubmitCroppedPhoto: noop,
  onCropPositionChange: noop,
  onCropComplete: noop,
  imageErrorText: null,
  //
  onSubmitCoverArt: noop,
  finalizedCoverArtImageUrl: '',
  isHidingImageSearch: false,
  isLoadingImageToCrop: false,
  isFetching: false,
  maybeSelectedFontId: null,
  isTextImageLoading: false,
  onPressNavigateBack: noop,
  isHidingNavigateBackButtonOnChooseScene: false,
  isColorPickerShowing: false,
  isAnchorWatermarkShowing: false,
  onClickColorPickerHide: noop,
  onClickColorPickerShow: noop,
  onClickClose: noop,
};

CoverArtModalScreen.propTypes = {
  podcastName: PropTypes.string,
  isShowing: PropTypes.bool,
  scene: PropTypes.oneOf(['text_edit', 'image_search', 'choose_path']),
  //
  onChooseSearchPath: PropTypes.func,
  onChooseUploadPath: PropTypes.func,
  onChooseRandomPath: PropTypes.func,
  //
  coverArt: coverArtPropType.isRequired,
  croppedCoverArtImageUrl: PropTypes.string,
  textImageUrl: PropTypes.string,
  textHex: PropTypes.string,
  isTextShowing: PropTypes.bool,
  onSelectFont: PropTypes.func,
  onToggleApplyText: PropTypes.func,
  onSelectJustification: PropTypes.func,
  justification: PropTypes.oneOf(['left', 'center', 'right']),
  onSelectAlignment: PropTypes.func,
  alignment: PropTypes.oneOf(['top', 'center', 'bottom']),
  onSelectColor: PropTypes.func,
  isTextColorLoading: PropTypes.bool,
  unsplashImages: PropTypes.arrayOf(unSplashImagePropType),
  searchText: PropTypes.string,
  onSearchTextChange: PropTypes.func,
  onRequestMoreItems: PropTypes.func,
  onChangeZoomLevel: PropTypes.func,
  zoomLevel: PropTypes.number,
  onSelectImage: PropTypes.func,
  selectedImageUrl: PropTypes.string,
  xCropPosition: PropTypes.number,
  yCropPosition: PropTypes.number,
  onSubmitCroppedPhoto: PropTypes.func,
  onCropPositionChange: PropTypes.func,
  onCropComplete: PropTypes.func,
  isHidingImageSearch: PropTypes.bool,
  imageErrorText: PropTypes.string,
  //
  onSubmitCoverArt: PropTypes.func,
  finalizedCoverArtImageUrl: PropTypes.string,
  isLoadingImageToCrop: PropTypes.bool,
  isFetching: PropTypes.bool,
  maybeSelectedFontId: PropTypes.string,
  isTextImageLoading: PropTypes.bool,
  onPressNavigateBack: PropTypes.func,
  isHidingNavigateBackButtonOnChooseScene: PropTypes.bool,
  isColorPickerShowing: PropTypes.bool,
  isAnchorWatermarkShowing: PropTypes.bool,
  onClickColorPickerHide: PropTypes.func,
  onClickColorPickerShow: PropTypes.func,
  onClickClose: PropTypes.func,
};

export default CoverArtModalScreen;
