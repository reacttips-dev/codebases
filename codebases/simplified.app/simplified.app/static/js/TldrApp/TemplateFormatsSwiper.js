import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { fetchCategories, fetchFormats } from "../_actions/slidePresetActions";
import TLDRSwiper from "../_components/common/TLDRSwiper";
import { StyledMarketPlaceSwiperButton } from "../_components/styled/details/stylesDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  StyledMarkerplaceCard,
  StyledMarketplaceFooter,
  StyledMarketplaceFrameDescription,
  StyledMarketplaceProjectFormatTitle,
  StyledTemplateFormatsSwiperContainer,
} from "../_components/styled/home/stylesHome";
import {
  StyledMarketplaceDesignCard,
  StyledRoundedPill,
} from "../_components/styled/styles";
import dashboardArtBoardPlaceholder from "../assets/images/dashboardArtBoardPlaceholder.png";
import Format from "string-format";
import { TEMPLATES_BY_FORMAT_SCREEN } from "../_utils/routes";
import { withRouter } from "react-router-dom";
import { FETCH_FORMATS } from "../_actions/endpoints";
import { handleHTTPError } from "../_actions/errorHandlerActions";

class TemplateFormatsSwiper extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);

    this.state = {
      selectedCategory: "all",
      presets: [],
    };
  }

  componentDidMount() {
    this.fetchCategories();
    this.fetchFormats();
  }

  fetchCategories() {
    this.props.fetchCategories(this.props, this.signal.token);
  }

  fetchFormats(key = "") {
    axios
      .get(Format(FETCH_FORMATS, key))
      .then((res) => {
        this.setState({
          presets: res.data.results,
        });
      })
      .catch((error) => {
        this.props.handleHTTPError(error, this.props);
      });
  }

  onFilterChange = (key) => {
    this.setState({ selectedCategory: key.id }, () => {
      this.fetchFormats(key.id === "all" ? "" : key.id);
    });
  };

  handleClick = (format) => {
    const { searchTerm } = this.props;
    const url = Format(TEMPLATES_BY_FORMAT_SCREEN, format?.title);

    this.props.history.push({
      pathname: encodeURI(url),
      search: searchTerm?.length > 0 ? `?search=${searchTerm}` : "",
    });
  };

  render() {
    const { presetCategories } = this.props.slidePresets;
    const { selectedCategory, presets } = this.state;
    const finalCategories = [
      { id: "all", title: "For you", display_name: "For you" },
    ].concat(presetCategories);

    const categoriesView = finalCategories.map((category) => {
      return (
        <StyledRoundedPill
          key={category.id}
          className="template-categories"
          tldrbtn={selectedCategory === category.id ? "primary" : "default"}
          onClick={() => this.onFilterChange(category)}
        >
          {category.display_name}
        </StyledRoundedPill>
      );
    });

    const formatContent = presets.map((preset, index) => {
      const { id, image_height, image_width, title, image, display_name } =
        preset;
      return (
        <div key={id}>
          <StyledMarkerplaceCard location="start-from-srcatch">
            <StyledMarketplaceDesignCard>
              <div
                className="start-from-scratch-thumbnail swiper-thumbnail"
                onClick={() => this.handleClick(preset)}
              >
                <img
                  className="marketplace-template-format-swiper-image"
                  src={!image ? dashboardArtBoardPlaceholder : image}
                  alt={title}
                />
                <StyledMarketplaceFooter>
                  <StyledMarketplaceProjectFormatTitle className="marketplace-template-formats-title">
                    {display_name}
                  </StyledMarketplaceProjectFormatTitle>
                  <StyledMarketplaceFrameDescription className="marketplace-template-formats-description">
                    {image_width} x {image_height} px
                  </StyledMarketplaceFrameDescription>
                </StyledMarketplaceFooter>
              </div>
            </StyledMarketplaceDesignCard>
          </StyledMarkerplaceCard>
        </div>
      );
    });

    return (
      <StyledTemplateFormatsSwiperContainer
        className={`${this.props.toggleVisibility ? "hidden" : "visible"} ${
          this.props.classes
        }`}
      >
        <div>{categoriesView}</div>

        <TLDRSwiper swiperParams={marketPlaceTemplateFormatsSwiperParams}>
          {formatContent}
        </TLDRSwiper>
      </StyledTemplateFormatsSwiperContainer>
    );
  }
}

let marketPlaceTemplateFormatsSwiperParams = {
  spaceBetween: 20, // padding between 2 elements (in px)
  slidesPerView: 6,
  breakpoints: {
    1200: {
      slidesPerView: 6,
    },
    1024: {
      slidesPerView: 5,
    },
    768: {
      slidesPerView: 4,
    },
    480: {
      slidesPerView: 2,
    },
    320: {
      slidesPerView: 1.5,
    },
  },
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
};

const mapStateToProps = (state) => ({
  slidePresets: state.slidePresets,
});

const mapDispatchToProps = {
  fetchCategories,
  fetchFormats,
  handleHTTPError,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TemplateFormatsSwiper));
