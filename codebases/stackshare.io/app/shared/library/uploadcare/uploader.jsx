import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';

const Uploader = ({...props}) => {
  const uploader = useRef();
  useEffect(() => {
    import(/* webpackChunkName: "uploadcare-widget" */ 'uploadcare-widget/').then(module => {
      const uploadcare = module.default;
      const widget = uploadcare.SingleWidget(uploader.current);
      if (typeof props.value !== 'undefined') {
        widget.value(props.value);
      }
      if (typeof props.onChange === 'function') {
        widget.onChange(files => {
          if (files) {
            files = files && files.files ? files.files() : [files];
          } else {
            files = null;
          }
          props.onChange(files);
        });
      }
      if (typeof props.onUploadComplete === 'function') {
        widget.onUploadComplete(props.onUploadComplete);
      }
      if (props.clearImage) {
        widget.value(null);
      }

      widget.onDialogOpen(dialog => dialog);
    });
  }, [props.clearImage]);

  const getInputAttributes = () => {
    const attributes = Object.assign({}, props);
    delete attributes.value;
    delete attributes.clearImage;
    delete attributes.onChange;
    delete attributes.onUploadComplete;

    return attributes;
  };
  const attributes = getInputAttributes();

  return (
    <input
      type="hidden"
      data-images-only="true"
      data-file-types="png jpeg jpg"
      data-input-accept-types="image/png image/jpeg"
      data-preview-step="true"
      data-clearable="true"
      ref={uploader}
      {...attributes}
    />
  );
};

Uploader.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onUploadComplete: PropTypes.func,
  clearImage: PropTypes.bool
};

export default Uploader;
