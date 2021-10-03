import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { StyledMarketPlaceSwiperButton } from "../styled/details/stylesDetails";
import {
  StyledSectionTitleRow,
  StyledSectionTitle,
  StyledMarkerplaceHelpText,
} from "../styled/home/stylesHome";
import { StyledDesignCard } from "../styled/styles";
import TLDRSwiper from "./TLDRSwiper";
import YoutubeEmbed from "./YoutubeEmbed";

let marketPlaceTemplateFormatsSwiperParams = {
  spaceBetween: 20, // padding between 2 elements (in px)
  slidesPerView: 3,
  freeMode: true,
  shouldSwiperUpdate: true,
  runCallbacksOnInit: true,
  mousewheel: false,
  containerClass: "marketplace-template-formats-swiper-container",
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
    disabledClass: "swiper-button-disabled",
  },
  renderPrevButton: () => (
    <StyledMarketPlaceSwiperButton
      className={"swiper-button-prev"}
      variance="left"
    >
      <div className="swiper-button-inner-div">
        <FontAwesomeIcon icon="chevron-left" />
      </div>
    </StyledMarketPlaceSwiperButton>
  ),
  renderNextButton: () => (
    <StyledMarketPlaceSwiperButton
      className={"swiper-button-next"}
      variance="right"
    >
      <div className="swiper-button-inner-div">
        <FontAwesomeIcon icon="chevron-right" />
      </div>
    </StyledMarketPlaceSwiperButton>
  ),
  breakpoints: {
    768: {
      slidesPerView: 5,
      spaceBetween: 20,
    },
    640: {
      slidesPerView: 3.5,
      spaceBetween: 10,
    },
    320: {
      slidesPerView: 1,
      spaceBetween: 10,
      noSwiping: false,
    },
  },
};

function TldrLearnSection() {
  const videos = [
    { title: "Workspace", url: "https://www.youtube.com/embed/CP6BKvDb8tI" },
    { title: "Get started", url: "https://www.youtube.com/embed/jbwJ4OPQD3Q" },
    { title: "AI", url: "https://www.youtube.com/embed/Ra1Ghy1Id2o" },
    {
      title: "Background remover",
      url: "https://www.youtube.com/embed/DUdBVftWZSs",
    },
  ];

  let videoGalary = videos.map((video, index) => {
    return (
      <StyledDesignCard key={index}>
        <YoutubeEmbed
          title={video.title}
          width="560"
          height="315"
          embedId={video.url}
        ></YoutubeEmbed>
      </StyledDesignCard>
    );
  });

  return (
    <>
      <StyledSectionTitleRow className="mt-3">
        <div>
          <StyledMarkerplaceHelpText className={"d-none d-md-block"}>
            Learn how to use Simplified like a pro
          </StyledMarkerplaceHelpText>
          <StyledSectionTitle>Simplified Tutorials</StyledSectionTitle>
        </div>
        <div
          className="view-all"
          onClick={() => {
            window.open("https://simplified.co/academy", "_blank");
          }}
        >
          <span className="view-all mr-2">Go to Academy</span>
          <FontAwesomeIcon icon="arrow-right" />
        </div>
      </StyledSectionTitleRow>
      <TLDRSwiper swiperParams={marketPlaceTemplateFormatsSwiperParams}>
        {videoGalary}
      </TLDRSwiper>
    </>
  );
}

export default TldrLearnSection;
