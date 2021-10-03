import React, { Component } from "react";
import PropTypes from "prop-types";
import {Image, Shimmer } from "react-shimmer";
import errorImagePlaceholder from "../../assets/images/image-failed-to-load.png";

class TLDRImage extends Component {
  render() {
    const { width, height, alt, src, NativeImgProps } = this.props;
    return (
      <>
        <Image
          {...this.props}
          NativeImgProps={{ ...NativeImgProps, width: width, height: height }}
          src={src}
          alt={alt}
          width={width}
          height={height}
          color="rgba(255, 255, 255, 0.12)"
          duration={1000}
          fallback={
            <Shimmer
              width={width}
              height={height}
              className="tldr-image-shimmer"
            />
          }
          errorFallback={(err) => {
            console.error(`Failed to load given URL ${src} due to ${err}`);
            return (
              <img
                src={errorImagePlaceholder}
                alt={"Failed to load the given URL."}
                width={width}
                height={height}
              />
            );
          }}
          fadeIn={true}
        />
      </>
    );
  }
}

TLDRImage.propTypes = {
  src: PropTypes.string.isRequired,
};

TLDRImage.defaultProps = {
  alt: "",
  NativeImgProps: {},
};

export default TLDRImage;
