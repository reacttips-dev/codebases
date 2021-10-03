import React, { Component } from "react";
import {
  StyledBrandKitLogosGrid,
  StyledBrandkitSectionLabels,
} from "../../_components/styled/settings/stylesSettings";
import TldrDropzone from "../../_components/common/TldrDropzone";
import { connect } from "react-redux";
import { setCounter, uploadFile } from "../../_actions/storiesActions";
import BrandKitLogos from "./BrandKitLogos";

class BrandKitLogosSection extends Component {
  render() {
    const { brandKit, brandKitInfo } = this.props;
    const { loaded } = brandKit;
    const { logos } = brandKitInfo;
    let brandLogosChild;
    if (loaded) {
      brandLogosChild =
        logos &&
        logos.map((logo, index) => {
          return (
            <BrandKitLogos
              key={index}
              logoInfo={logo}
              brandKitId={brandKitInfo.id}
            />
          );
        });
    }
    return (
      <>
        <StyledBrandkitSectionLabels>
          <label>logos</label>
          {/* <div className="add-logos">
            <FontAwesomeIcon icon="plus" />
          </div> */}
        </StyledBrandkitSectionLabels>
        <TldrDropzone
          btnTitle="Upload Logos"
          brandKitId={brandKitInfo.id}
          buttonWidth={25}
          onDrop={this.onLogosDrop}
        />

        {logos && logos.length > 0 && (
          <StyledBrandKitLogosGrid>{brandLogosChild}</StyledBrandKitLogosGrid>
        )}
      </>
    );
  }

  onLogosDrop = (droppedFiles, signalToken) => {
    const { brandKitInfo } = this.props;

    if (droppedFiles.length > 0) {
      this.props.setCounter(droppedFiles.length);
    }
    droppedFiles.forEach((file) => {
      this.props.uploadFile(
        file,
        { ...this.props, brandKitId: brandKitInfo.id },
        signalToken
      );
    });
  };
}

BrandKitLogosSection.propTypes = {};

const mapStateToProps = (state) => ({
  brandKit: state.brandKit,
});

const mapDispatchToProps = (dispatch) => ({
  uploadFile: (file, props, signalToken) =>
    dispatch(uploadFile(file, props, signalToken)),
  setCounter: (counter) => dispatch(setCounter(counter)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrandKitLogosSection);
