import React, { Component } from "react";
import PropTypes from "prop-types";

class TLDRSwiperImage extends Component {
  render() {
    const { width, height, src } = this.props;
    return (
      <div className="swiper-slide image-container">
        <img
          data-src={src}
          alt=" " // space is important
          className="swiper-lazy"
          height={height}
          width={width}
        />
        <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
      </div>
    );
  }
}

TLDRSwiperImage.propTypes = {
  src: PropTypes.string.isRequired,
};

TLDRSwiperImage.defaultProps = {
  alt: "",
};

export default TLDRSwiperImage;
