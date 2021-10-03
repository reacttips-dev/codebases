import React, { Component } from "react";
import Swiper from "react-id-swiper";
import "swiper/css/swiper.css";

class TLDRSwiper extends Component {
  render() {
    let { swiperParams, children, refs, enableKeyboard } = this.props;
    if (!swiperParams) {
      swiperParams = {
        // pagination: {
        //   clickable: true,
        // },
        spaceBetween: 15,
        slidesPerView: 6,
        freeMode: true,
        shouldSwiperUpdate: true,
        runCallbacksOnInit: true,
        mousewheel: true,
      };
    }
    return (
      <>
        <Swiper
          ref={refs}
          {...swiperParams}
          keyboard={enableKeyboard}
          speed={700}
        >
          {children}
        </Swiper>
      </>
    );
  }
}

TLDRSwiper.propTypes = {};

export default TLDRSwiper;
