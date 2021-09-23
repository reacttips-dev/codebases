import React from 'react';
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from 'react-hook-form';
import { AnchorAPI } from 'modules/AnchorAPI';
import { UploadOptions } from 'client/modules/AnchorAPI/uploadImage';
import { ImageUploader, ImageUploaderProps } from '.';
import { EpisodeImage } from '../EpisodeEditorPublish/types';

export type ControlledImageUploaderProps<T> = {
  control: Control<T>;
  name: FieldPath<T>;
  uploadOptions?: UploadOptions;
  normalize?: (json: any) => string;
} & Omit<ImageUploaderProps, 'onImageLocallyUploaded' | 'originalImage'>;

export const ControlledImageUploader = <T extends FieldValues>({
  name,
  control,
  uploadOptions,
  normalize,
  ...html
}: ControlledImageUploaderProps<T>) => {
  const {
    field: { value, onChange },
  } = useController<T, FieldPath<T>>({ control, name });

  return (
    <ImageUploader
      {...html}
      originalImage={
        (typeof value === 'object' && (value as EpisodeImage)?.image) || value
      }
      onImageLocallyUploaded={async (imageBlob: Blob) => {
        try {
          const { json } = await AnchorAPI.uploadImage(
            {
              imageBlob,
            },
            uploadOptions
          );
          const image = normalize?.(json) || json;
          onChange(image);
        } catch (err) {
          // current ImageUploader component can't handle errors :(
        }
      }}
    />
  );
};
