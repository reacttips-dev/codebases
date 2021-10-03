import React, { Component } from "react";
import { StyledDropdownHeader } from "../../styled/details/styleDownloadOptions";
import TldrSlider from "../../common/TldrSlider";

class TLDRDownloadJPEGFileQuality extends Component {
  render() {
    const { imageQuality } = this.props;
    return (
      <>
        <StyledDropdownHeader>Quality</StyledDropdownHeader>
        <TldrSlider
          domain={[0, 100]}
          onChange={this.onChange}
          values={[imageQuality]}
          classNames={"quality-slider quality-slider-mobile"}
          showDecimals={false}
        ></TldrSlider>
      </>
    );
  }

  onChange = (value) => {
    this.props.onImageQualityChange(value[0]);
  };
}

TLDRDownloadJPEGFileQuality.propTypes = {};

export default TLDRDownloadJPEGFileQuality;
