import React, { Component } from "react";
import { connect } from "react-redux";
import {
  StyledBrandKitLogosGrid,
  StyledBrandkitSectionLabels,
} from "../../_components/styled/settings/stylesSettings";
import FontsDropZone from "../../_components/common/FontsDropZone";
import TextMyFont from "../../_components/details/sidebarPanels/textsPanel/TextMyFont";

class BrandKitFontsSection extends Component {
  render() {
    const { brandKitInfo, brandKit } = this.props;
    const { loaded } = brandKit;
    const { fonts } = brandKitInfo;

    let brandFontChildren;

    if (loaded) {
      brandFontChildren =
        fonts &&
        fonts.map((font, index) => {
          return (
            <TextMyFont font={font} brandKitId={brandKitInfo.id} key={index} />
          );
        });
    }

    return (
      <>
        <StyledBrandkitSectionLabels>
          <label>fonts</label>
          {/* <div className="add-fonts">
            <FontAwesomeIcon icon="plus" />
          </div> */}
        </StyledBrandkitSectionLabels>

        <FontsDropZone brandKitId={brandKitInfo.id} buttonWidth={25} />
        {fonts && fonts.length > 0 && (
          <StyledBrandKitLogosGrid>{brandFontChildren}</StyledBrandKitLogosGrid>
        )}
      </>
    );
  }
}

BrandKitFontsSection.propTypes = {};

const mapStateToProps = (state) => ({
  brandKit: state.brandKit,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BrandKitFontsSection);
