import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import Box from 'shared/Box';
import Mask from 'shared/Mask';
import Image from 'shared/Image';
import If from 'shared/If';
import ImagePicker from 'shared/ImagePicker';
import { Button } from 'shared/Button/NewButton';
import ErrorBanner from 'shared/ErrorBanner';
import SceneHeading from '../SceneHeading';

const noop = () => null;

const ChoosePathScene = ({
  imageErrorText,
  coverArtImageUrl,
  onChooseSearchPath,
  onChooseUploadPath,
  onChooseRandomPath,
}) => {
  const [imagePickerErrorText, setImagePickerErrorText] = useState(null);
  return (
    <Box>
      <SceneHeading
        title="Choose your cover art"
        subtitle={coverArtImageUrl === '' ? "First, you'll need an image." : ''}
      />
      <If
        condition={coverArtImageUrl === ''}
        ifRender={() => (
          <Box height={200} maxWidth={600} margin="auto">
            <Image
              imageUrl="https://d12xoj7p9moygp.cloudfront.net/images/cover-art/cover-art-maker-hero.png"
              retinaImageUrl="https://d12xoj7p9moygp.cloudfront.net/images/cover-art/cover-art-maker-hero@2x.png"
              height="100%"
              objectFit="contain"
            />
          </Box>
        )}
        elseRender={() => (
          <Box display="flex" justifyContent="center" maxWidth={10000}>
            <Box width={200} height={200} margin={0} position="relative">
              <Mask shape="rounded">
                <Image imageUrl={coverArtImageUrl} height={200} width={200} />
              </Mask>
            </Box>
          </Box>
        )}
      />
      <Box
        display="flex"
        justifyContent="center"
        marginTop={5}
        marginBottom={10}
      >
        <Box width={300}>
          <Box width="100%" paddingTop={40} paddingBottom={10}>
            {(imageErrorText || imagePickerErrorText) && (
              <Box paddingBottom={20}>
                <ErrorBanner
                  text={imageErrorText ? imageErrorText : imagePickerErrorText}
                />
              </Box>
            )}
            <Button
              className={css`
                width: 100%;
              `}
              color="purple"
              ariaLabel="Search for a photo"
              onClick={onChooseSearchPath}
            >
              Search for a photo
            </Button>
          </Box>
          <Box width="100%" paddingTop={10} paddingBottom={10}>
            <ImagePicker
              onChange={fileObj => {
                setImagePickerErrorText(null);
                onChooseUploadPath(fileObj);
              }}
              onError={handledErrorText =>
                setImagePickerErrorText(handledErrorText)
              }
              dims={{
                minWidth: 0,
                maxWidth: 1000000000000,
                minHeight: 0,
                maxHeight: 100000000000,
              }}
            >
              <Button
                className={css`
                  width: 100%;
                `}
                color="purple"
                ariaLabel="Upload an image"
              >
                Upload an image
              </Button>
            </ImagePicker>
          </Box>
          <Box width="100%" paddingTop={10} paddingBottom={20}>
            <Button
              className={css`
                width: 100%;
              `}
              color="purple"
              ariaLabel="Choose one for me"
              onClick={onChooseRandomPath}
            >
              Choose one for me
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

ChoosePathScene.defaultProps = {
  onChooseSearchPath: noop,
  onChooseUploadPath: noop,
  onChooseRandomPath: noop,
  coverArtImageUrl: '',
  imageErrorText: null,
};

ChoosePathScene.propTypes = {
  onChooseSearchPath: PropTypes.func,
  onChooseUploadPath: PropTypes.func,
  onChooseRandomPath: PropTypes.func,
  coverArtImageUrl: PropTypes.string,
  imageErrorText: PropTypes.string,
};

export default ChoosePathScene;
