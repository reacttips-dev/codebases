import React, { Component } from "react";
import { StyledDropdownHeader } from "../../styled/details/styleDownloadOptions";
import TldrSlider from "../../common/TldrSlider";

class TLDRDownloadImageScale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSizeScale: 1,
    };
  }

  render() {
    const { imageSize, contentSize } = this.props;
    const { imageSizeScale } = this.state;

    return contentSize && imageSize ? (
      <>
        <StyledDropdownHeader>{`Size (${
          contentSize.width * imageSizeScale
        }px x ${contentSize.height * imageSizeScale}px)`}</StyledDropdownHeader>
        <TldrSlider
          domain={[1, 5]}
          onChange={this.onChange}
          values={[imageSize]}
          classNames={"quality-slider quality-slider-mobile"}
          showDecimals={false}
          unit={"x"}
        ></TldrSlider>
      </>
    ) : null;
  }

  onChange = (value) => {
    this.props.onImageSizeChange(value[0]);
    this.setState({
      imageSizeScale: value[0],
    });
  };
}

TLDRDownloadImageScale.propTypes = {};

export default TLDRDownloadImageScale;
