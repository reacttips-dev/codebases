import React from 'react';
import styled from '@emotion/styled';
import { css } from 'emotion';
import Box from 'shared/Box';
import Image from 'shared/Image';
import Input from 'shared/Input';
import { LinkText } from 'shared/Link';
import Text from 'shared/Text';
import Icon from 'shared/Icon';
import Mask from 'shared/Mask';
import Slider from 'shared/Slider';
import { Button } from 'shared/Button/NewButton';
import { Spinner } from 'shared/Spinner';
import Pressable from 'shared/Pressable';
import Hoverable from 'shared/Hoverable';
import InfiniteScroll from 'shared/InfiniteScroll';
import ImageResizerAndCropper from 'shared/ImageResizerAndCropper';
import SceneHeading from '../SceneHeading';

import NoResultsSection from './components/NoResultsSection';

const noop = () => null;

const getImageUrlToCropFromSourceImage = (sourceImage: SourceImage) => {
  if (sourceImage.maybeUnsplashImage) {
    return sourceImage.maybeUnsplashImage.fullResUrl;
  }
  if (sourceImage.maybeLocalImageBlobUrl) {
    return sourceImage.maybeLocalImageBlobUrl;
  }
  if (sourceImage.maybeHttpImageUrl) {
    return sourceImage.maybeHttpImageUrl;
  }
  return undefined;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 383px;
  min-width: 300px;
`;

const ImageSearchScene = (props: ImageSearchSceneProps) => {
  const {
    unsplashImages,
    coverArt,
    searchText,
    onSearchTextChange,
    onRequestMoreItems,
    onChangeZoomLevel,
    zoomLevel,
    xCropPosition,
    yCropPosition,
    onSubmitCroppedPhoto,
    onCropPositionChange,
    onSelectImage,
    onCropComplete,
    isHidingImageSearch,
    isLoadingImageToCrop,
    isButtonDisabled,
    isButtonProcessing,
  } = props;
  return (
    <Box>
      {isHidingImageSearch ? (
        <SceneHeading title="Crop your photo" subtitle="" />
      ) : (
        <SceneHeading
          title="Search for a photo"
          subtitle="This search is powered by Unsplash, which offers beautiful images completely free!"
        />
      )}
      <Container>
        <Box
          position="relative"
          smMarginLeft={20}
          smMarginRight={20}
          mdMarginLeft={40}
          mdMarginRight={40}
          lgMarginLeft={40}
          lgMarginRight={40}
          width={300}
        >
          <Box width="100%" height={300} shape="rounded">
            <Mask shape="rounded">
              {isLoadingImageToCrop ? (
                <Box
                  width="100%"
                  height="100%"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  color="#F4F4F5"
                >
                  <Spinner size={60} color="#B3B3B4" />
                </Box>
              ) : (
                <ImageResizerAndCropper
                  imageUrl={getImageUrlToCropFromSourceImage(
                    coverArt.sourceImage
                  )}
                  xPosition={xCropPosition}
                  yPosition={yCropPosition}
                  onPositionChange={onCropPositionChange}
                  width={300}
                  height={300}
                  scale={zoomLevel}
                  onCropComplete={onCropComplete}
                  shape="rounded"
                />
              )}
            </Mask>
          </Box>
          {!isLoadingImageToCrop &&
            coverArt.sourceImage.maybeUnsplashImage?.attributionName && (
              <Box>
                <Box padding={5}>
                  <Text align="center" size="sm" color="#7f8287">
                    Photo by{' '}
                    <LinkText
                      isInline
                      to={
                        coverArt.sourceImage.maybeUnsplashImage
                          ?.attributionUrl || '/'
                      }
                    >
                      <Text isInline isBold size="sm" color="#7f8287">
                        {coverArt.sourceImage.maybeUnsplashImage &&
                          coverArt.sourceImage.maybeUnsplashImage
                            .attributionName}
                      </Text>{' '}
                    </LinkText>
                    on Unsplash
                  </Text>
                </Box>
              </Box>
            )}
          {!isLoadingImageToCrop && (
            <Box marginTop={10} marginBottom={10}>
              <Slider
                minValue={1}
                maxValue={10}
                step={0.01}
                value={zoomLevel}
                onChange={onChangeZoomLevel}
                disabled={isLoadingImageToCrop}
              />
            </Box>
          )}
          {isHidingImageSearch && (
            <Box display="flex" justifyContent="end">
              <Button
                className={css`
                  margin-top: 50px;
                  width: 300px;
                  align-self: center;
                  > div {
                    margin-left: 10px;
                  }
                `}
                isDisabled={isButtonDisabled}
                color="purple"
                onClick={onSubmitCroppedPhoto}
              >
                Continue{isButtonProcessing && <Spinner size={20} />}
              </Button>
            </Box>
          )}
        </Box>
        {!isHidingImageSearch && (
          <PickerContainer>
            <Box>
              <Input
                backgroundColor="#dfe0e1"
                shape="pill"
                value={searchText}
                onChange={onSearchTextChange}
                placeholder="Search for any keyword or phrase"
                renderPrepend={() => (
                  <Box width={12.6} height={12.9}>
                    <Icon type="magnifying_glass" />
                  </Box>
                )}
              />
            </Box>
            <Box height={270}>
              {unsplashImages?.length === 0 ? (
                <Box height={270}>
                  <NoResultsSection />
                </Box>
              ) : (
                <InfiniteScroll
                  items={unsplashImages}
                  onRequestMore={onRequestMoreItems}
                  renderInfiniteScrollContent={(images: UnSplashImage[]) => (
                    <Box display="flex" justifyContent="center" wrap>
                      {/* TODO https://anchorfm.atlassian.net/browse/WHEEL-804: Replace Existing Infinite Scroll Box Component with Loop Component */}
                      {images.map(unsplashImage => (
                        <Pressable
                          key={`${unsplashImage.thumbnailUrl}`}
                          onPress={() => onSelectImage?.(unsplashImage)}
                        >
                          {({ isPressed }) => (
                            <Hoverable>
                              {({ isHovering }) => (
                                <Box
                                  position="relative"
                                  width={63}
                                  height={63}
                                  margin={5}
                                >
                                  <Box>
                                    <Mask shape="rounded">
                                      <Image
                                        renderLoadingPlaceholder={() => (
                                          <Box
                                            color="#F4F4F5"
                                            width="100%"
                                            height="100%"
                                          />
                                        )}
                                        height={63}
                                        width={63}
                                        imageUrl={unsplashImage.thumbnailUrl}
                                        objectFit="cover"
                                      />
                                    </Mask>
                                  </Box>
                                  {(isHovering || isPressed) && (
                                    <Box
                                      position="absolute"
                                      top
                                      left
                                      width="100%"
                                      height="100%"
                                      display="flex"
                                      justifyContent="center"
                                      alignItems="center"
                                      color={`rgba(41,47,54, ${
                                        isPressed
                                          ? '.20'
                                          : isHovering
                                          ? '.15'
                                          : '.0'
                                      })`}
                                      shape="rounded"
                                    />
                                  )}
                                  {coverArt.sourceImage.maybeUnsplashImage &&
                                    coverArt.sourceImage.maybeUnsplashImage
                                      ?.thirdPartyId ===
                                      unsplashImage.thirdPartyId && (
                                      <Box
                                        position="absolute"
                                        top
                                        left
                                        width="100%"
                                        height="100%"
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                      >
                                        <Box
                                          height={37}
                                          width={37}
                                          display="flex"
                                          justifyContent="center"
                                          alignItems="center"
                                        >
                                          <Box width={24}>
                                            <Icon
                                              type="checkmark"
                                              fillColor="white"
                                            />
                                          </Box>
                                        </Box>
                                      </Box>
                                    )}
                                </Box>
                              )}
                            </Hoverable>
                          )}
                        </Pressable>
                      ))}
                    </Box>
                  )}
                />
              )}

              {unsplashImages?.length !== 0 && (
                <div
                  style={{
                    width: '100%',
                    height: 2.7,
                    opacity: 0.1,
                    backgroundImage:
                      'linear-gradient(to right, #ffffff, #000000 49%, #ffffff)',
                  }}
                />
              )}
            </Box>
            <Button
              className={css`
                margin-top: 104px;
                width: 300px;
                align-self: center;
                > div {
                  margin-left: 10px;
                }
              `}
              onClick={onSubmitCroppedPhoto}
              isDisabled={isButtonDisabled}
              color="purple"
            >
              Continue{isButtonProcessing && <Spinner size={20} />}
            </Button>
          </PickerContainer>
        )}
      </Container>
    </Box>
  );
};

type UnSplashImage = {
  thumbnailUrl: string;
  fullResUrl: string;
  id?: string;
  authorName?: string;
  attributionName?: string;
  attributionUrl?: string;
  thirdPartyId?: string;
};

type SourceImage = {
  maybeUnsplashImage: UnSplashImage;
  maybeLocalImageBlobUrl: string;
  maybeHttpImageUrl: string;
};

type CoverArtProp = {
  maybeCroppedImageUrl?: string;
  maybeFinalImageUrl: string;
  sourceImage: SourceImage;
};

type ImageSearchSceneProps = {
  unsplashImages?: UnSplashImage[];
  searchText?: '';
  onSearchTextChange?: (text: string) => void;
  onRequestMoreItems?: () => void;
  onChangeZoomLevel?: (value: number) => void;
  zoomLevel?: number;
  xCropPosition?: number;
  yCropPosition?: number;
  onSubmitCroppedPhoto?: () => void;
  onCropPositionChange?: (coords: { x: number; y: number }) => void;
  onSelectImage?: (image: UnSplashImage) => void;
  coverArt: CoverArtProp;
  onCropComplete?: (croppedArea: any, croppedAreaPixels: any) => void;
  isHidingImageSearch?: boolean;
  isLoadingImageToCrop?: boolean;
  isButtonDisabled?: boolean;
  isButtonProcessing?: boolean;
};

ImageSearchScene.defaultProps = {
  unsplashImages: [],
  searchText: '',
  zoomLevel: 1,
  xCropPosition: 0,
  yCropPosition: 0,
  onSearchTextChange: noop,
  onRequestMoreItems: noop,
  onChangeZoomLevel: noop,
  onSubmitCroppedPhoto: noop,
  onCropPositionChange: noop,
  onSelectImage: noop,
  onCropComplete: noop,
  isHidingImageSearch: false,
  isLoadingImageToCrop: false,
  isButtonDisabled: false,
  isButtonProcessing: false,
};

export default ImageSearchScene;
