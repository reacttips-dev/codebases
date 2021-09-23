import React, { useState } from 'react';
import Button from 'react-bootstrap/lib/Button';
import { Spinner } from 'shared/Spinner';
import AvatarEditor from 'react-avatar-editor';
import {
  IMAGE_FILE_SIZE_LIMIT,
  IMAGE_FILE_SIZE_LIMIT_VIOLATED_MESSAGE,
} from 'helpers/constants';
import events from './events';

export type ImageCropperProps = {
  screen: string;
  onCancel: () => void;
  imageFile: File;
  onImageCropError: (errorMessage: string) => void;
  onImageCrop: (croppedBlob: Blob) => Promise<void>;
};

const ImageCropper = (props: ImageCropperProps) => {
  const { screen, onCancel, imageFile, onImageCropError, onImageCrop } = props;

  const [isSaving, setIsSaving] = useState(false);
  const [scale, setScale] = useState(1.0);
  const avatarEditorElement = React.useRef<AvatarEditor>(null);

  const handleClickSaveImage = () => {
    setIsSaving(true);

    if (avatarEditorElement.current) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.

      const canvas = avatarEditorElement.current.getImage();
      if (!canvas.toBlob) {
        setIsSaving(false);
        return;
      }
      canvas.toBlob((imageBlob: Blob | null) => {
        if (imageBlob) {
          if (imageBlob.size > IMAGE_FILE_SIZE_LIMIT) {
            onImageCropError(IMAGE_FILE_SIZE_LIMIT_VIOLATED_MESSAGE);
            setIsSaving(false);
          } else {
            onImageCrop(imageBlob).then(() => {
              events.newImageSaved({ location: screen });
            });
          }
        }
      });
    } else {
      setIsSaving(false);
    }
  };

  const handleChangeScale = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(event.target.value));
  };

  return (
    <React.Fragment>
      <AvatarEditor
        image={imageFile}
        width={400}
        height={400}
        color={[255, 255, 255, 0.2]} // RGBA
        ref={avatarEditorElement}
        scale={scale}
      />
      <label>
        <h6>Zoom</h6>
        <input
          type="range"
          onChange={handleChangeScale}
          min={1}
          step={0.1}
          max={4}
          value={scale}
        />
      </label>
      <p>
        <Button
          data-cy="saveImageCrop"
          bsStyle="primary"
          disabled={isSaving}
          onClick={handleClickSaveImage}
        >
          {isSaving ? <Spinner size={24} /> : 'Save'}
        </Button>
        <Button bsStyle="link" onClick={onCancel}>
          Cancel
        </Button>
      </p>
    </React.Fragment>
  );
};

export { ImageCropper };
