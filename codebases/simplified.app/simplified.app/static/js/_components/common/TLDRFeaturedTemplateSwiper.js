import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { StyledMarketPlaceSwiperButton } from "../styled/details/stylesDetails";
import {
  StyledSectionTitleRow,
  StyledSectionTitle,
  StyledMarkerplaceHelpText,
  StyledMarkerplaceCard,
} from "../styled/home/stylesHome";
import TLDRSwiper from "./TLDRSwiper";

import { Component } from "react";
import DesignCard from "../home/DesignCard";
import { TAB_TEMPLATES } from "../details/constants";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  fetchCategories,
  resetStories,
  fetchViewAllTemplatesByGroup,
  resetTemplatesViewAll,
  filterTemplatesByCategory,
} from "../../_actions/storiesActions";
import { TEMPLATES_SCREEN } from "../../_utils/routes";

let marketPlaceCollectionSwiperParams = {
  spaceBetween: 20, // padding between 2 elements (in px)
  slidesPerView: "auto",
  freeMode: true,
  shouldSwiperUpdate: true,
  runCallbacksOnInit: true,
  mousewheel: false,
  containerClass: "marketplace-collection-swiper-container",
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
      spaceBetween: 20,
    },
    320: {
      spaceBetween: 10,
    },
  },
};

class TLDRFeaturedTemplateSwiper extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);
    const { format, category, categoryId } = this.props;
    this.state = {
      requestedCategory: category,
      requestedFormat: format,
      requestedCategoryId: categoryId,
    };
  }

  render() {
    let cards = [];
    const { stories } = this.props;

    if (stories?.payload && stories.payload?.length > 0) {
      cards = stories.payload.map((template) => {
        const { id, image_height, image_width } = template;
        return (
          <StyledMarkerplaceCard
            key={id}
            location="template-marketplace"
            height={image_height}
            width={image_width}
          >
            <DesignCard
              key={id}
              story={template}
              tab={TAB_TEMPLATES}
              showHoverOverlay={true}
            />
          </StyledMarkerplaceCard>
        );
      });
    }

    let aspectRatio =
      stories?.payload[0]?.image_width / stories?.payload[0]?.image_height;
    const numberOfTiles = 6; // It can be changeable.
    let slidesPerView =
      aspectRatio >= 6
        ? 4.5
        : aspectRatio >= 2
        ? 3.5
        : aspectRatio === 1
        ? 5.5
        : aspectRatio >= 1
        ? numberOfTiles / aspectRatio
        : aspectRatio < 0.3
        ? 12
        : aspectRatio < 0.9 && aspectRatio > 0.8
        ? 8
        : numberOfTiles * (aspectRatio + 0.4);
    return (
      <>
        {cards.length > 0 && (
          <>
            <StyledSectionTitleRow className="mt-3">
              <div>
                <StyledMarkerplaceHelpText
                  className={"marketplace-template-subheader d-none d-md-block"}
                >
                  Take your designs to the next level
                </StyledMarkerplaceHelpText>
                <StyledSectionTitle>
                  Explore template collection
                </StyledSectionTitle>
              </div>
              <div
                className="view-all"
                onClick={() => {
                  this.goViewAll();
                }}
              >
                <span className="view-all mr-2">View All</span>
                <FontAwesomeIcon icon="arrow-right" />
              </div>
            </StyledSectionTitleRow>
            <TLDRSwiper
              swiperParams={{
                ...marketPlaceCollectionSwiperParams,
                slidesPerView: slidesPerView.toFixed(1),
                breakpoints: {
                  ...marketPlaceCollectionSwiperParams.breakpoints,
                  1200: {},
                  1024: {},
                  768: {},
                  480: {
                    slidesPerView: aspectRatio > 1.5 ? 1.5 : 2,
                  },
                  320: {
                    ...marketPlaceCollectionSwiperParams.breakpoints[320],
                    slidesPerView: aspectRatio > 1.5 ? 1 : 1.5,
                  },
                },
              }}
            >
              {cards}
            </TLDRSwiper>
          </>
        )}
      </>
    );
  }

  componentDidMount() {
    // if (!this.state.requestedCategoryId) {
    this.props.resetStories();
    this.fetchAllTemplatesByFormat();
    // }
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  fetchAllTemplatesByFormat = () => {
    this.props.resetTemplatesViewAll();
    this.props.fetchViewAllTemplatesByGroup(
      "",
      this.state.requestedFormat,
      this.state.requestedCategoryId,
      1,
      { ...this.props },
      this.signal.token
    );
  };

  goViewAll = () => {
    const { requestedCategory, requestedFormat, requestedCategoryId } =
      this.state;
    const url = TEMPLATES_SCREEN;
    this.props.history.push({
      pathname: encodeURI(url),
    });
  };
}

TLDRFeaturedTemplateSwiper.propTypes = {};

const mapStateToProps = (state) => ({
  stories: state.stories,
});

const mapDispatchToProps = {
  fetchCategories,
  resetStories,
  fetchViewAllTemplatesByGroup,
  resetTemplatesViewAll,
  filterTemplatesByCategory,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TLDRFeaturedTemplateSwiper));
