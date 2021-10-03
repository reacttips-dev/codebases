import React, { Component } from "react";
import {
  StyledMarketplaceHeader,
  StyledMarkerplaceCollection,
  StyledMarketPlaceGallery,
  StyledMarkerplaceCard,
  StyledMarketplaceContent,
  StyledMarketPlaceHeader,
  StyledMarkerplaceHelpText,
} from "../_components/styled/home/stylesHome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TLDRSwiper from "../_components/common/TLDRSwiper";
import { ShowCenterSpinner } from "../_components/common/statelessView";
import { StyledMarketPlaceSwiperButton } from "../_components/styled/details/stylesDetails";
import { connect } from "react-redux";
import DesignCard from "../_components/home/DesignCard";
import { TAB_TEMPLATES } from "../_components/details/constants";
import TLDRInfiniteScroll from "../_components/common/TLDRInfiniteScroll";
import { withRouter } from "react-router-dom";
import Format from "string-format";
import { TEMPLATES_BY_FORMAT_SCREEN, TEMPLATES_SCREEN } from "../_utils/routes";
import axios from "axios";
import {
  fetchTemplatesByGroup,
  resetStories,
} from "../_actions/storiesActions";
import queryString from "query-string";
import TldrAiBase from "../TldrAi/TldrAiBase";
import TldrSearch from "../_components/common/TldrSearch";
import TemplateFormatsSwiper from "./TemplateFormatsSwiper";
import { analyticsTrackEvent } from "../_utils/common";
import TemplatesMasonryView from "./TemplatesMasonryView";
import TldrSearchSuggestion from "../_components/common/TldrSearchSuggestion";
import { MAIN_CONTAINER_SCROLLABLE_TARGET_ID } from "../_utils/constants";
import TLDRTitleSearch from "../_components/common/TLDRTitleSearch";

class AllFormatsTemplate extends Component {
  signal = axios.CancelToken.source();
  constructor(props) {
    super(props);
    var querySearchParam = queryString.parse(this.props.location.search).search;

    this.state = {
      searchTerm: "",
      showSuggestions: false,
      showMasonryView: querySearchParam ? true : false,
    };
  }

  componentDidMount() {
    let { tags } = queryString.parse(window.location.search);
    if (tags && !(tags instanceof Array)) {
      tags = [tags];
    }
    var querySearchParam = queryString.parse(this.props.location.search).search;
    this.setState(
      {
        searchTerm: querySearchParam ? querySearchParam : "",
      },
      () => {
        if (this.state.searchTerm) {
          this.handleShowAllSearchTemplates();
        } else {
          this.props.resetStories();
          this.props.fetchTemplatesByGroup(
            "",
            this.props,
            this.signal.token,
            tags
          );
        }
      }
    );
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  getHeadings = () => {
    return (
      <>
        <StyledMarketPlaceHeader className="mr-0 ml-0 marketplace-template-header">
          What do you want to create today?
        </StyledMarketPlaceHeader>
        <StyledMarkerplaceHelpText className="marketplace-template-subheader">
          Get started with templates, customize to match your needs.
        </StyledMarkerplaceHelpText>
      </>
    );
  };

  handleSearch = (keyword) => {
    const searchParameter = "?search={0}";

    this.setState(
      {
        searchTerm: keyword,
        showSuggestions: true,
      },
      () => {
        this.props.history.replace({
          pathname: TEMPLATES_SCREEN,
          search:
            this.state.searchTerm.length === 0
              ? ""
              : Format(
                  searchParameter,
                  encodeURIComponent(this.state.searchTerm)
                ),
        });
      }
    );
    analyticsTrackEvent("searchTemplates", {
      keyword: keyword,
    });
  };

  loadMoreData = () => {
    const { searchTerm } = this.state;

    this.props.fetchTemplatesByGroup(searchTerm, this.props, this.signal.token);
  };

  goViewAll = (templateType) => {
    const { searchTerm } = this.state;
    const url = Format(TEMPLATES_BY_FORMAT_SCREEN, templateType?.group_key);

    this.props.history.push({
      pathname: encodeURI(url),
      search: searchTerm.length > 0 ? `?search=${searchTerm}` : "",
    });
  };

  handleShowAllSearchTemplates = () => {
    this.props.resetStories();

    this.setState({
      showSuggestions: false,
      showMasonryView: true,
    });
  };

  handleSearchWrapperOnBlur = (event) => {
    if (event.currentTarget.id !== event.relatedTarget?.id) {
      this.setState({ showSuggestions: false });
    }
  };

  render() {
    const headings = this.getHeadings();
    const { stories } = this.props;
    const { loaded, templatePayload } = stories;
    const { searchTerm, showSuggestions, showMasonryView } = this.state;

    let cards = [];
    var templateTypesContent =
      templatePayload &&
      templatePayload.map((templateType, index) => {
        if (!templateType.payload) {
          return <></>;
        }

        cards = templateType.payload.map((template) => {
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
                isUsedInSwiper={true}
              />
            </StyledMarkerplaceCard>
          );
        });

        let aspectRatio =
          templateType?.payload[0]?.image_width /
          templateType?.payload[0]?.image_height;
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
          <div key={index} style={{ marginBottom: "40px" }}>
            <StyledMarketplaceHeader key={`${index}_header`}>
              <div className="header">{templateType?.format?.display_name}</div>
              <div
                className="view-all"
                onClick={() => this.goViewAll(templateType)}
              >
                View All
                <FontAwesomeIcon icon="arrow-right" className="ml-2" />
              </div>
            </StyledMarketplaceHeader>
            <StyledMarkerplaceCollection key={`${index}_collection`}>
              <TLDRSwiper
                swiperParams={{
                  ...marketPlaceCollectionSwiperParams,
                  slidesPerView: slidesPerView.toFixed(1),
                  breakpoints: {
                    1200: {},
                    1024: {},
                    768: {},
                    480: {
                      slidesPerView: aspectRatio > 1.5 ? 1.5 : 2,
                    },
                    320: {
                      slidesPerView: aspectRatio > 1.5 ? 1 : 1.5,
                    },
                  },
                }}
              >
                {cards}
              </TLDRSwiper>
            </StyledMarkerplaceCollection>
          </div>
        );
      });

    return (
      <StyledMarketplaceContent>
        <StyledMarketPlaceGallery className="pt-0">
          <TldrAiBase
            className="templates-header-box templates"
            cardBodyClassName="marketplace-templates-card-body"
            toggleVisibility={showMasonryView}
          >
            <div className="templates-info-container">
              {headings}

              <div
                id="tldr-templates-search-wrapper"
                tabIndex={0}
                onBlur={(e) => this.handleSearchWrapperOnBlur(e)}
              >
                <TldrSearch
                  onSearch={this.handleSearch}
                  className="mt-3"
                  size="lg"
                  searchLocation="dashboard"
                  placeholder="Search formats, templates"
                  width="400px"
                  onClear={this.handleSearchClear}
                  onFocus={this.handleSearchFocus}
                  handleEnterKeyEvent={this.handleShowAllSearchTemplates}
                  handleEscKeyEvent={() => {
                    this.setState({ showSuggestions: false });
                  }}
                />

                {showSuggestions && (
                  <TldrSearchSuggestion
                    width="400px"
                    searchTerm={searchTerm}
                    searchLocation="dashboard"
                    handleShowAllClick={() =>
                      this.handleShowAllSearchTemplates()
                    }
                    classes={"d-none d-md-block"}
                  />
                )}
              </div>
            </div>

            <img
              src="https://assets.simplified.co/images/templates-pic@2x.png"
              height="230"
              alt=""
            />
          </TldrAiBase>

          <TemplateFormatsSwiper
            searchTerm={searchTerm}
            toggleVisibility={showMasonryView}
            classes={"d-none d-md-block"}
          />

          <TLDRTitleSearch
            title="Templates"
            classes={"d-flex d-sm-flex d-md-none"}
            searchConfig={{
              handleSearch: this.handleSearch,
              onFocus: this.handleSearchFocus,
              handleEnterKeyEvent: this.handleShowAllSearchTemplates,
              handleEscKeyEvent: () => {
                this.setState({ showSuggestions: false });
              },
              onClear: this.handleSearchClear,
            }}
            showFilterDropdown={showMasonryView}
          ></TLDRTitleSearch>

          {showSuggestions && (
            <TldrSearchSuggestion
              width="auto"
              searchTerm={searchTerm}
              searchLocation="dashboard"
              handleShowAllClick={() => this.handleShowAllSearchTemplates()}
              classes={"d-flex d-small-flex d-md-none"}
            />
          )}

          {loaded && templatePayload && !showMasonryView ? (
            <TLDRInfiniteScroll
              childrens={templateTypesContent}
              hasMore={stories.loadMore}
              loadMoreData={this.loadMoreData}
              scrollableTarget={MAIN_CONTAINER_SCROLLABLE_TARGET_ID}
            />
          ) : !loaded && !showMasonryView ? (
            <div className="marketplace-templates-no-content-container">
              <ShowCenterSpinner loaded={!loaded} />
            </div>
          ) : null}

          {showMasonryView ? (
            <TemplatesMasonryView
              handleSearchClear={(key) => this.handleSearchClear(key)}
              onSearch={this.handleSearch}
              handleEnterKeyEvent={this.handleShowAllSearchTemplates}
              handleEscKeyEvent={() => {
                this.setState({ showSuggestions: false });
              }}
            />
          ) : null}
        </StyledMarketPlaceGallery>
      </StyledMarketplaceContent>
    );
  }

  handleSearchFocus = () => {
    this.setState({
      showSuggestions: true,
    });
  };

  handleSearchClear = (keyword) => {
    this.props.resetStories();
    const searchParameter = "?search={0}";

    this.setState(
      {
        searchTerm: keyword,
        showSuggestions: false,
        showMasonryView: false,
      },
      () => {
        this.props.history.replace({
          pathname: TEMPLATES_SCREEN,
          search:
            this.state.searchTerm.length === 0
              ? ""
              : Format(
                  searchParameter,
                  encodeURIComponent(this.state.searchTerm)
                ),
        });
        this.props.fetchTemplatesByGroup(
          this.state.searchTerm,
          this.props,
          this.signal.token
        );
      }
    );
    analyticsTrackEvent("searchTemplates", {
      keyword: keyword,
    });
  };
}

let marketPlaceCollectionSwiperParams = {
  spaceBetween: 20, // padding between 2 elements (in px)
  slidesPerView: "auto",
  freeMode: true,
  shouldSwiperUpdate: true,
  runCallbacksOnInit: true,
  mousewheel: false,
  lazy: true,
  preloadImages: false,
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
};

AllFormatsTemplate.propTypes = {};

const mapStateToProps = (state) => ({
  stories: state.stories,
});

const mapDispatchToProps = {
  fetchTemplatesByGroup,
  resetStories,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AllFormatsTemplate));
