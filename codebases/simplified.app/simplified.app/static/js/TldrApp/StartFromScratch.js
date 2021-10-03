import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { createStory } from "../_actions/storiesActions";
import {
  StyledMarketplaceContent,
  StyledMarketplaceFrameDescription,
  StyledMarketPlacePresetsGallery,
  StyledMarkerplaceCard,
  StyledMarketplaceFooter,
  StyledMarketplaceProjectFormatTitle,
  StyledDashboardBannerRow,
  StyledSectionTitle,
  StyledMarkerplaceHelpText,
  StyledTemplateViewAllSwiperButton,
} from "../_components/styled/home/stylesHome";
import {
  StyledCategories,
  StyledRoundedPill,
  StyledMarketplaceDesignCard,
} from "../_components/styled/styles";
import TLDRInfiniteScroll from "../_components/common/TLDRInfiniteScroll";
import {
  CustomStorySizeModal,
  RequestTemplateContent,
  ShowCenterSpinner,
} from "../_components/common/statelessView";
import {
  fetchCategories,
  fetchFormats,
  searchFormats,
} from "../_actions/slidePresetActions";
import TldrSearch from "../_components/common/TldrSearch";
import dashboardArtBoardPlaceholder from "../assets/images/dashboardArtBoardPlaceholder.png";
import { analyticsTrackEvent } from "../_utils/common";
import { StyledNewProjectButton } from "./../_components/styled/styles";
import { lightInactive } from "../_components/styled/variable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TLDRTitleSearch from "../_components/common/TLDRTitleSearch";
import TLDRSwiper from "../_components/common/TLDRSwiper";
import { FloatingButton } from "./TldrHomeBaseStyles";
import { faCropAlt } from "@fortawesome/free-solid-svg-icons";
let viewAllTemplateCategoriesSwiperParams = {
  slidesPerView: "auto",
  freeMode: true,
  shouldSwiperUpdate: true,
  runCallbacksOnInit: true,
  mousewheel: false,
  containerClass: "marketplace-templates-category-swiper-container",
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
    disabledClass: "swiper-button-disabled",
  },
  renderPrevButton: () => (
    <StyledTemplateViewAllSwiperButton
      className={"swiper-button-prev"}
      variance="left"
    >
      <div className="swiper-button-inner-div">
        <FontAwesomeIcon icon="chevron-left" />
      </div>
    </StyledTemplateViewAllSwiperButton>
  ),
  renderNextButton: () => (
    <StyledTemplateViewAllSwiperButton
      className={"swiper-button-next"}
      variance="right"
    >
      <div className="swiper-button-inner-div">
        <FontAwesomeIcon icon="chevron-right" />
      </div>
    </StyledTemplateViewAllSwiperButton>
  ),
};

class StartFromScratch extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      showCustomStorySizeModal: false,
      customHeigth: 640,
      customWidth: 640,
      lockAspectRatio: false,
      selectedCategory: "all",
      category: null,
      loaded: true,
    };
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  loadMoreData() {}

  onFilterChange(key) {
    this.setState({ selectedCategory: key.id, category: key });
    this.fetchFormats(key.id === "all" ? "" : key.id);
  }

  fetchCategories() {
    this.props.fetchCategories(this.props, this.signal.token);
  }

  fetchFormats(key = "") {
    this.setState({
      loaded: false,
    });
    this.props.fetchFormats(key, this.props).then(() => {
      this.setState({
        loaded: true,
      });
    });
  }

  componentDidMount() {
    this.fetchCategories();
    this.fetchFormats();
  }

  toggleCustomSizePopup = () => {
    this.setState((state) => ({
      selectedCategory: "custom",
      showCustomStorySizeModal: !state.showCustomStorySizeModal,
    }));
  };

  handleClick = (data) => {
    this.createStory(data);
  };

  toggleAspectRatioLock = () => {
    this.setState({
      ...this.state,
      lockAspectRatio: !this.state.lockAspectRatio,
    });
  };

  onChange = (dimensions) => {
    const design = {
      format_type: "custom",
      image_height: dimensions.height,
      image_width: dimensions.width,
      title: "Custom",
    };

    this.createStory(design);
  };

  onWidthFocusOut = (text) => {
    if (this.state.lockAspectRatio) {
      this.setState({
        ...this.state,
        customWidth: text,
        customHeigth: text,
      });
    } else {
      this.setState({
        ...this.state,
        customWidth: text,
      });
    }
  };

  onHeightFocusOut = (text) => {
    if (this.state.lockAspectRatio) {
      this.setState({
        ...this.state,
        customWidth: text,
        customHeigth: text,
      });
    } else {
      this.setState({
        ...this.state,
        customHeigth: text,
      });
    }
  };

  interchangeDimensions = () => {
    this.setState({
      ...this.state,
      customHeigth: this.state.customWidth,
      customWidth: this.state.customHeigth,
    });
  };

  createStory = (data) => {
    this.props.createStory(
      {
        status: "draft",
        template: data.format_type,
        format: data.id,
        title: data.display_name ? data.display_name : data.title,
        image_height: data.image_height,
        image_width: data.image_width,
      },
      this.signal.token,
      this.props
    );
  };

  handleSearch = (keyword) => {
    this.setState({ loaded: false });
    analyticsTrackEvent("searchFormats", {
      keyword: keyword,
    });
    this.props.searchFormats(keyword, this.props).then(() => {
      this.setState({ loaded: true });
    });
  };

  render() {
    const {
      showCustomStorySizeModal,
      customHeigth,
      customWidth,
      lockAspectRatio,
      loaded,
      selectedCategory,
    } = this.state;
    const { presetCategories, presets } = this.props.slidePresets;
    const finalCategories = [
      { id: "all", title: "all", display_name: "All" },
    ].concat(presetCategories);

    const formatContent = presets.map((preset, index) => {
      const { id, image_height, image_width, title, display_name, image } =
        preset;

      return (
        <React.Fragment key={index}>
          <StyledMarkerplaceCard key={id} location="start-from-srcatch">
            <StyledMarketplaceDesignCard>
              <div
                className="start-from-scratch-thumbnail"
                onClick={() => this.handleClick(preset)}
              >
                <img
                  src={!image ? dashboardArtBoardPlaceholder : image}
                  alt={title}
                />
                <StyledMarketplaceFooter>
                  <StyledMarketplaceProjectFormatTitle>
                    {display_name}
                  </StyledMarketplaceProjectFormatTitle>
                  <StyledMarketplaceFrameDescription>
                    {image_width} x {image_height} px
                  </StyledMarketplaceFrameDescription>
                </StyledMarketplaceFooter>
              </div>
            </StyledMarketplaceDesignCard>
          </StyledMarkerplaceCard>
        </React.Fragment>
      );
    });

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

    return (
      <>
        <StyledMarketplaceContent>
          <div
            className="start-from-scratch-hero-container d-none d-md-flex"
            style={{ marginTop: "-1.5rem" }}
          >
            <StyledDashboardBannerRow className={"search-template-size"}>
              <StyledSectionTitle style={{ fontSize: "30px" }}>
                Choose a size for your design
              </StyledSectionTitle>
              <StyledMarkerplaceHelpText
                className="marketplace-template-subheader"
                style={{ fontSize: "18px", color: lightInactive }}
              >
                Select from 30+ presets or create a custom size for your next
                project
              </StyledMarkerplaceHelpText>

              <TldrSearch
                placeholder="Search by format or by resolution"
                onSearch={this.handleSearch}
                className="pr-5 pl-5"
                size="xl"
                width={"100%"}
                height={"48px"}
                searchLocation="dashboard"
                showShadow={true}
              />
            </StyledDashboardBannerRow>
            <StyledCategories className="pills-container">
              <div>{categoriesView}</div>

              {presetCategories.length > 0 && (
                <>
                  <StyledNewProjectButton
                    className={"mr-2"}
                    variant="tprimary"
                    onClick={() => this.toggleCustomSizePopup()}
                    style={{ width: "unset" }}
                  >
                    Custom Size
                    <FontAwesomeIcon
                      icon="plus"
                      className="ml-2"
                    ></FontAwesomeIcon>
                  </StyledNewProjectButton>
                </>
              )}
            </StyledCategories>
          </div>

          <TLDRTitleSearch
            searchConfig={{
              handleSearch: this.handleSearch,
            }}
            title="Presets"
            classes={"d-flex d-sm-flex d-md-none"}
            style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
          ></TLDRTitleSearch>
          <div className="d-flex d-sm-flex d-md-none">
            <TLDRSwiper swiperParams={viewAllTemplateCategoriesSwiperParams}>
              {categoriesView}
            </TLDRSwiper>
          </div>

          <StyledMarketPlacePresetsGallery>
            {loaded && presets.length > 0 ? (
              <TLDRInfiniteScroll
                className={"start-from-scratch-presets-infinite-scroll"}
                childrens={formatContent}
                hasMore={false}
                loadMoreData={this.loadMoreData}
                loaded={false} // Change its value whenever data get loaded.
              />
            ) : loaded && presets.length === 0 ? (
              <RequestTemplateContent text="No formats found" />
            ) : (
              <ShowCenterSpinner loaded={loaded} />
            )}
          </StyledMarketPlacePresetsGallery>

          <CustomStorySizeModal
            show={showCustomStorySizeModal}
            onHide={(e) => {
              this.setState({
                selectedCategory: "all",
                showCustomStorySizeModal: false,
              });
              this.fetchFormats();
            }}
            height={customHeigth}
            width={customWidth}
            onWidthFocusOut={(text) => this.onWidthFocusOut(text)}
            onHeigthFocusOut={(text) => this.onHeightFocusOut(text)}
            onYes={() =>
              this.onChange({
                height: customHeigth,
                width: customWidth,
              })
            }
            onValuesInterchange={this.interchangeDimensions}
            toggleAspectRatio={this.toggleAspectRatioLock}
            aspectRatioLock={lockAspectRatio}
          />
        </StyledMarketplaceContent>
        <FloatingButton
          className="d-flex d-sm-flex d-md-none"
          onClick={() => this.toggleCustomSizePopup()}
        >
          <FontAwesomeIcon
            className={"floating-add-product-icon align-self-center"}
            icon={faCropAlt}
            fill="black"
            color={"black"}
          />
        </FloatingButton>
      </>
    );
  }
}

StartFromScratch.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  slidePresets: state.slidePresets,
  auth: state.auth,
});

const mapDispatchToProps = {
  createStory,
  fetchCategories,
  fetchFormats,
  searchFormats,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(StartFromScratch));
