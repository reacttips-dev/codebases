import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Cropper from 'react-easy-crop';
import classnames from 'classnames/bind';
import styles from './ImageResizerAndCropper.sass';

const cx = classnames.bind(styles);

class ImageResizerAndCropper extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      imageUrl,
      scale,
      width,
      height,
      xPosition,
      yPosition,
      onPositionChange,
      onCropComplete,
      cropAreaShape,
    } = this.props;
    return (
      <div
        className={cx({
          root: true,
          roundedCropArea: cropAreaShape === 'rounded',
        })}
        style={{
          width,
          height,
        }}
      >
        <Cropper
          image={imageUrl}
          crop={{
            x: xPosition,
            y: yPosition,
          }}
          zoom={scale}
          showGrid={false}
          aspect={1}
          onCropChange={onPositionChange}
          onCropComplete={(croppedArea, croppedAreaPixels) => {
            onCropComplete(croppedArea, croppedAreaPixels);
          }}
        />
      </div>
    );
  }
}

ImageResizerAndCropper.defaultProps = {
  xPosition: 0,
  yPosition: 0,
  width: 400,
  height: 400,
  scale: 1.0,
  onImageChanged: () => {},
  onPositionChange: () => {},
  onCropComplete: () => {},
  cropAreaShape: 'rounded',
};

ImageResizerAndCropper.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  xPosition: PropTypes.number,
  yPosition: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  scale: PropTypes.number,
  onImageChanged: PropTypes.func,
  onPositionChange: PropTypes.func,
  onCropComplete: PropTypes.func,
  cropAreaShape: PropTypes.oneOf(['rounded']),
};

export default ImageResizerAndCropper;
