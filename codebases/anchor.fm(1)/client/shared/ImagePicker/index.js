// external imports
import React from 'react';
import PropTypes from 'prop-types';
// local imports
import loadFile from './modules/load-file';
import loadImage from './modules/load-image';
import FilePicker from '../FilePicker';

/**
 * ImageInput returns a base64-encoded string of the
 * given image. It does NOT return a native file object
 * like the generic FilePicker component, but rather wraps it
 * and then loads the image into HTMLImageElement in order
 * to validate the dimensions of the uploaded image.
 */

class ImagePicker extends React.Component {
  _handleImg = file => {
    const { onChange, onError, dims } = this.props;

    loadFile(file)
      .then(dataUrl => {
        loadImage(dataUrl, dims).then(() => {
          onChange(dataUrl);
        });
      })
      .catch(err => {
        onError(err.message);
      });
  };

  render() {
    const { children, ...unused } = this.props;
    // pass our own onChange handler here and
    // use the user-provided onChange handler above in _handleImg
    // Reflect.deleteProperty(unused, 'onChange');

    return (
      <FilePicker onChange={this._handleImg} {...unused}>
        {children}
      </FilePicker>
    );
  }
}

ImagePicker.defaultProps = {
  acceptedTypes: ['image/*'],
  maxSize: 100000000000000000, // arbitrarily large
};

ImagePicker.propTypes = {
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  dims: PropTypes.shape({
    minWidth: PropTypes.number.isRequired,
    maxWidth: PropTypes.number.isRequired,
    minHeight: PropTypes.number.isRequired,
    maxHeight: PropTypes.number.isRequired,
  }).isRequired,
  maxSize: PropTypes.number,
  acceptedTypes: PropTypes.arrayOf(PropTypes.string),
};

export default ImagePicker;
