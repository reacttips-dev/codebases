import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropzone from "react-dropzone";
import axios from "axios";
import { Spinner } from "react-bootstrap";

class TldrDropzone extends Component {
  signal = axios.CancelToken.source();
  onDrop = (acceptedFiles) => {
    if (acceptedFiles.length <= 0) {
      return;
    }
    this.props.onDrop(acceptedFiles, this.signal);
  };

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  render() {
    const { isUploading, btnTitle, description, className } = this.props;

    return (
      <>
        <Dropzone onDrop={(acceptedFiles) => this.onDrop(acceptedFiles)}>
          {({ getRootProps, getInputProps, open }) => (
            <section>
              <div {...getRootProps({ className: `dropzone ${className}` })}>
                <input
                  {...getInputProps()}
                  onClick={(e) => {
                    if (this.props.handleInputOnClick) {
                      this.props.handleInputOnClick(e);
                    }
                  }}
                />
                <FontAwesomeIcon icon="cloud-upload-alt"></FontAwesomeIcon>
                <p>{description}</p>
                <button
                  type="button"
                  onClick={() => open}
                  className="btn-upload-font"
                  style={{ width: `${this.props.buttonWidth}%` }}
                >
                  {isUploading ? (
                    <>
                      <Spinner
                        variant="warning"
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <p className={"ml-1"} style={{ display: "unset" }}>
                        Uploading...
                      </p>
                    </>
                  ) : (
                    `${btnTitle}`
                  )}
                </button>
              </div>
            </section>
          )}
        </Dropzone>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  pagestore: state.pagestore,
  websockets: state.websockets,
  story: state.story,
  editor: state.editor,
});

TldrDropzone.propTypes = {
  onDrop: PropTypes.func.isRequired,
};

TldrDropzone.defaultProps = {
  isUploading: false,
  description: "Just drag and drop your brand images, videos.",
  btnTitle: "Upload",
  buttonWidth: 100,
  disableInput: false,
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TldrDropzone);
