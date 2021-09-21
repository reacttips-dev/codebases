// external imports
import React from 'react';
import PropTypes from 'prop-types';
// local imports
import FileInput from './components/FileInput';

class FilePicker extends React.Component {
  _validate = file => {
    const { onError, onChange, maxSize, maxSizeLabel, extensions } = this.props;
    // make sure a file was provided in the first place
    if (!file) {
      onError('Failed to upload a file.');
      return;
    }

    // if we care about file extensions
    if (extensions) {
      const uploadedFileExt = file.name.split('.').pop().toLowerCase();
      const isValidFileExt = extensions
        .map(ext => ext.toLowerCase())
        .includes(uploadedFileExt);

      if (!isValidFileExt) {
        onError(`Must upload a file of type: ${extensions.join(' or ')}`);
        return;
      }
    }

    if (file.size > maxSize) {
      onError(`File size must be less than ${maxSizeLabel} MB.`);
      return;
    }

    // return native file object
    onChange(file);
  };

  render() {
    const { children, style, acceptedTypes } = this.props;

    return (
      <FileInput
        onChange={this._validate}
        style={style}
        acceptedTypes={acceptedTypes}
      >
        {children}
      </FileInput>
    );
  }
}

FilePicker.defaultProps = {
  acceptedTypes: ['*'],
  maxSize: 100000000000000000,
};

FilePicker.propTypes = {
  acceptedTypes: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  // max file size in MB
  maxSize: PropTypes.number,
  // file extension
  extensions: PropTypes.arrayOf(PropTypes.string),
  // validate file contents
  validateContent: PropTypes.func,
  style: PropTypes.objectOf(PropTypes.any),
};

export default FilePicker;
