import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TldrDropzone from "./TldrDropzone";
import { uploadFontFile } from "../../_actions/storiesActions";
import VariableFont from "../../_utils/variableFont";
import { fetchBrandKits } from "../../_actions/brandKitActions";
import FontHandler from "../canvas/handlers/FontHandler";
import { TldrBasicConfirmationModal } from "./statelessView";

const opentype = require("opentype.js");

class FontsDropZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConsentPopup: false,
      uploadingCount: 0,
      droppedFiles: [],
    };
  }

  render() {
    const { uploadingCount, showConsentPopup } = this.state;
    const { brandKitId, buttonWidth, className } = this.props;
    return (
      <>
        <TldrDropzone
          isUploading={uploadingCount > 0}
          btnTitle="Upload Fonts"
          brandKitId={brandKitId}
          buttonWidth={buttonWidth}
          description={"The file should be in a TTF or OTF format"}
          onDrop={this.onFontsDrop}
          className={className}
        />
        <TldrBasicConfirmationModal
          title={"Upload fonts"}
          message={
            "By uploading custom font(s), you warrant that you have all the necessary rights and licenses to allow us to modify and store the font in this way."
          }
          inprogress={uploadingCount > 0}
          show={showConsentPopup}
          onHide={(e) => {
            this.setState({
              ...this.state,
              showConsentPopup: false,
              droppedFiles: [],
            });
          }}
          onYes={() => {
            this.processFontFiles(this.state.droppedFiles);
          }}
        />
      </>
    );
  }

  onFontsDrop = (droppedFiles) => {
    this.setState({
      ...this.state,
      showConsentPopup: true,
      droppedFiles,
    });
  };

  processFontFiles = (fontFiles) => {
    if (fontFiles.length > 0) {
      this.setState(
        {
          ...this.state,
          uploadingCount: fontFiles.length,
        }
        // () => {
        //   this.processFontFiles(droppedFiles);
        // }
      );
    }

    const { brandKitId, auth } = this.props;
    const selectedOrgId = auth.payload.selectedOrg;

    fontFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.warn("file reading was aborted");
      reader.onerror = () => console.error("file reading has failed");
      reader.onload = (e2) => {
        try {
          let fontBuffer = e2.target.result;
          let vf = new VariableFont(opentype.parse(fontBuffer));
          this.props
            .uploadFontFile(
              selectedOrgId,
              file,
              vf.getMetaInformation(),
              brandKitId
            )
            .then((fontInfo) => {
              if (brandKitId) {
                this.props.fetchBrandKits();
              }

              let fontHandler = new FontHandler(null);
              fontHandler.addFont(fontInfo);

              this.setState({
                ...this.state,
                uploadingCount: this.state.uploadingCount - 1,
                showConsentPopup: this.state.uploadingCount - 1 !== 0,
              });
            });
        } catch (err) {
          console.error(err);
          this.setState({
            ...this.state,
            uploadingCount: 0,
            droppedFiles: [],
          });
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };
}

FontsDropZone.propTypes = {
  auth: PropTypes.object.isRequired,
};

FontsDropZone.defaultProps = {
  brandKitId: null,
  buttonWidth: null,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  uploadFontFile: (orgId, file, metaInfo, brandKitId) =>
    dispatch(uploadFontFile(orgId, file, metaInfo, brandKitId)),
  fetchBrandKits: () => dispatch(fetchBrandKits()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FontsDropZone);
