// external imports
import React from 'react';
import PropTypes from 'prop-types';

class FileInput extends React.Component {
  _handleUpload = evt => {
    const { onChange } = this.props;
    const file = evt.target.files[0];
    onChange(file);

    // free up the fileInput again
    this.fileInput.value = null;
  };

  render() {
    const { acceptedTypes, style, children } = this.props;
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
      <div style={style}>
        <label htmlFor="file-input" style={{ display: 'none' }}>
          Upload File
        </label>
        <input
          accept={acceptedTypes.join(',')}
          type="file"
          style={{ display: 'none' }}
          id="file-input"
          name="file-input"
          onChange={this._handleUpload}
          ref={ele => (this.fileInput = ele)}
        />
        {React.cloneElement(children, {
          onClick: () => {
            if (children && children.props.onClick) children.props.onClick();
            this.fileInput.click();
          },
        })}
      </div>
    );
  }
}

FileInput.defaultProps = {
  acceptedTypes: ['*'],
};

FileInput.propTypes = {
  style: PropTypes.objectOf(PropTypes.any),
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  acceptedTypes: PropTypes.arrayOf(PropTypes.string),
};

export default FileInput;
