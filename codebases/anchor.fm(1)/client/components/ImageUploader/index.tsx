import React, { useState } from 'react';
import { Control, FieldPath } from 'react-hook-form';
import { FileRejection, useDropzone } from 'react-dropzone';
import Modal from 'react-bootstrap/lib/Modal';
import ErrorBanner from 'shared/ErrorBanner';
import { Button } from 'shared/Button/NewButton';
import { IMAGE_FILE_FAILED_TO_UPLOAD_MESSAGE } from 'helpers/constants';
import Icon from 'shared/Icon';
import PodcastSquare from '../PodcastSquare';
import { DEFAULT_IMAGE } from '../../onboarding';
import { ImageCropper } from '../ImageCropper';
import events from './events';
import {
  EditImageContainer,
  ErrorMessage,
  ImageDisplay,
  ImageSquare,
  AnchorIconContainer,
  SubscriptionLabel,
} from './styles';

export type ImageUploaderProps = {
  onImageLocallyUploaded: (imageBlob: Blob) => Promise<void>;
  originalImage: string;
  uploadLinkLabel: string;
  screen: string;
  clickEventName: string;
  altText: string;
  className?: string;
  onShowCropper?: () => void;
  isCropperInline?: boolean;
  isPW?: boolean;
};

export type ControlledImageUploaderProps<T> = {
  control: Control<T>;
  name: FieldPath<T>;
} & Omit<ImageUploaderProps, 'onImageLocallyUploaded' | 'originalImage'>;

export const ImageUploader = (props: ImageUploaderProps) => {
  const {
    onImageLocallyUploaded,
    originalImage: originalImageProp,
    uploadLinkLabel,
    className,
    onShowCropper,
    isCropperInline,
    clickEventName,
    screen,
    altText,
    isPW,
  } = props;
  const [uploadedImage, setUploadedImage] = useState<File | undefined>(
    undefined
  );
  const [showCropper, setShowCropper] = useState(false);
  const [croppedBlobURL, setCroppedBlobURL] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const currentImage = croppedBlobURL || originalImageProp || DEFAULT_IMAGE;
  const isShowingPlaceholderCoverArt = currentImage === DEFAULT_IMAGE;

  const handleImageFileDrop = (
    acceptedFiles: File[],
    rejectedFiles: FileRejection[]
  ) => {
    if (rejectedFiles.length) {
      setErrorText(IMAGE_FILE_FAILED_TO_UPLOAD_MESSAGE);
    } else {
      const newImage = acceptedFiles[0];

      setUploadedImage(newImage);
      setShowCropper(true);
      setErrorText(null);

      if (onShowCropper) {
        onShowCropper();
      }
    }
  };

  const handleImageCrop = async (croppedBlob: Blob) => {
    setCroppedBlobURL(URL.createObjectURL(croppedBlob));
    await onImageLocallyUploaded(croppedBlob);
    setShowCropper(false);
  };

  const handleImageCropError = (errorMessage: string) => {
    setErrorText(errorMessage);
    setShowCropper(false);
  };

  const handleCancelCrop = () => {
    setCroppedBlobURL(null);
    setShowCropper(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleImageFileDrop,
    accept: 'image/*',
    maxFiles: 1,
  });

  const Cropper = isCropperInline ? (
    <ImageCropper
      screen={screen}
      imageFile={uploadedImage as File}
      onCancel={handleCancelCrop}
      onImageCrop={handleImageCrop}
      onImageCropError={handleImageCropError}
    />
  ) : (
    <Modal show onHide={handleCancelCrop}>
      <Modal.Header closeButton />
      <Modal.Body className="text-center">
        <ImageCropper
          screen={screen}
          imageFile={uploadedImage as File}
          onCancel={handleCancelCrop}
          onImageCrop={handleImageCrop}
          onImageCropError={handleImageCropError}
        />
      </Modal.Body>
    </Modal>
  );

  return (
    <>
      {showCropper && uploadedImage && Cropper}
      <input {...getInputProps()} />
      <EditImageContainer
        data-cy="imageUploaderDropzone"
        {...getRootProps({
          className: className || '',
          onClick: () => {
            if (clickEventName && screen)
              events.imageUploaderClicked(clickEventName, {
                location: screen,
              });
          },
        })}
      >
        <ImageDisplay>
          {isShowingPlaceholderCoverArt ? (
            <ImageSquare>
              <AnchorIconContainer>
                <Icon type="anchor_logo" fillColor="white" />
              </AnchorIconContainer>
            </ImageSquare>
          ) : (
            // @ts-ignore
            <PodcastSquare
              borderRadius={10}
              image={currentImage}
              altText={altText}
            />
          )}
          {isPW && <SubscriptionLabel>Subscription</SubscriptionLabel>}
        </ImageDisplay>
        {errorText && (
          <ErrorMessage>
            <ErrorBanner text={errorText} />
          </ErrorMessage>
        )}
        <Button type="button" color="white">
          {uploadLinkLabel || 'Upload a new cover art image'}
        </Button>
      </EditImageContainer>
    </>
  );
};

export { ControlledImageUploader } from './ControlledImageUploader';
