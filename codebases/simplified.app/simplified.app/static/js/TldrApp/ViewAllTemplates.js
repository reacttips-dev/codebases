import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyledMarketPlaceGallery,
  StyledMarkerplaceCard,
  StyledMarketPlaceHeader,
  StyledMarkerplaceHelpText,
  StyledMarketplaceContent,
  StyledTemplateViewAllSwiperButton,
  StyledMarketplaceViewAllTemplatesBreadcrumbRow,
} from "../_components/styled/home/stylesHome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ShowCenterSpinner,
  RequestTemplateContent,
} from "../_components/common/statelessView";
import { connect } from "react-redux";
import DesignCard from "../_components/home/DesignCard";
import { TAB_TEMPLATES } from "../_components/details/constants";
import TLDRInfiniteScroll from "../_components/common/TLDRInfiniteScroll";
import { MAIN_CONTAINER_SCROLLABLE_TARGET_ID } from "../_utils/constants";
import { createStory } from "../_actions/storiesActions";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import TldrAiBase from "../TldrAi/TldrAiBase";
import TldrSearch from "../_components/common/TldrSearch";
import { StyledRoundedPill } from "../_components/styled/styles";
import {
  fetchCategories,
  resetStories,
  fetchViewAllTemplatesByGroup,
  resetTemplatesViewAll,
  filterTemplatesByCategory,
  fetchTemplatesByGroup,
} from "../_actions/storiesActions";
import { searchFormats } from "../_actions/slidePresetActions";
import TLDRSwiper from "../_components/common/TLDRSwiper";
import queryString from "query-string";
import { TEMPLATES_BY_FORMAT_SCREEN } from "../_utils/routes";
import Format from "string-format";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { primayColor, secondaryColor } from "../_components/styled/variable";
import { Breadcrumb } from "react-bootstrap";
import { encodeWithDash } from "../_utils/common";

class ViewAllTemplates extends Component {
  signal = axios.CancelToken.source();
  constructor(props) {
    super(props);
    const {
      params: { format, category },
    } = this.props.match;
    var querySearchParam = queryString.parse(this.props.location.search).search;

    this.state = {
      searchTerm: querySearchParam,
      requestedCategory: category,
      requestedFormat: format,
      formatDetails: null,
      category: {},
    };
  }

  componentDidMount() {
    this.fetchFormatInformation();
    if (!this.state.requestedCategory) {
      this.fetchAllTemplatesByFormat();
    }
    this.props
      .fetchCategories(this.props, this.signal.token)
      .then((categories) => {
        if (categories) {
          const selectedCategory = categories.find((category) => {
            return (
              category.title === this.state.requestedCategory?.toLowerCase()
            );
          });
          this.setState({
            category: selectedCategory
              ? selectedCategory
              : { id: "", title: "All" },
          });
          if (this.state.requestedCategory) {
            this.fetchAllTemplatesByFormat();
          }
        }
      });
  }

  fetchFormatInformation = () => {
    this.props
      .searchFormats(this.state.requestedFormat, this.props)
      .then((response) => {
        this.setState({ formatDetails: response.results[0] });
      });
  };

  fetchAllTemplatesByFormat = () => {
    this.props.resetTemplatesViewAll();
    this.props.fetchViewAllTemplatesByGroup(
      this.state.searchTerm,
      this.state.requestedFormat,
      this.state.category?.id,
      1,
      { ...this.props },
      this.signal.token
    );
  };

  loadMoreData = () => {
    this.props.fetchViewAllTemplatesByGroup(
      this.state.searchTerm,
      this.state.requestedFormat,
      this.state.category?.id,
      this.props.stories.templatesViewAllPage || 1,
      { ...this.props },
      this.signal.token
    );
  };

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  onFilterChange = (key) => {
    if (key.id === this.state.category?.id) {
      return;
    }
    this.setState(
      {
        ...this.state,
        category: key,
        requestedCategory: key.id,
      },
      () => {
        this.filterOrSearchTemplates();
      }
    );
  };

  filterOrSearchTemplates = () => {
    const { category, searchTerm, formatDetails } = this.state;

    // get the search term from search box or from url
    let querySearchParam;

    querySearchParam =
      searchTerm?.length > 0
        ? searchTerm
        : queryString.parse(this.props.location.search).search;

    let url = Format(TEMPLATES_BY_FORMAT_SCREEN, formatDetails?.title);

    if (category) {
      url = `${url}/${encodeWithDash(category?.title)}`;
    }

    this.props.history.replace({
      pathname: encodeURI(url),
      search: searchTerm?.length > 0 ? `?search=${querySearchParam}` : "",
    });

    this.fetchAllTemplatesByFormat();
  };

  handleClick = () => {
    const { formatDetails } = this.state;
    this.props.createStory(
      {
        status: "draft",
        format: formatDetails?.id,
        image_height: `${formatDetails.image_height}`,
        image_width: `${formatDetails.image_width}`,
        title: formatDetails?.display_name,
      },
      this.signal.token,
      this.props
    );
  };

  getViewAllHeadings = () => {
    const { formatDetails } = this.state;

    return (
      <div className="templates-view-all-headings">
        <div className="headings-container">
          <SkeletonTheme color={secondaryColor} highlightColor={primayColor}>
            <StyledMarketPlaceHeader className="mr-0 ml-0 title marketplace-view-all-template-header">
              {formatDetails
                ? formatDetails.display_name
                : formatDetails?.display_name || <Skeleton width={200} />}
            </StyledMarketPlaceHeader>
            {formatDetails ? (
              <StyledMarkerplaceHelpText className="marketplace-view-all-template-subheader">
                {formatDetails?.description ||
                  `${formatDetails?.image_width} x ${formatDetails?.image_height} px`}
              </StyledMarkerplaceHelpText>
            ) : (
              <StyledMarkerplaceHelpText className="marketplace-view-all-template-subheader">
                <Skeleton width={200} />
              </StyledMarkerplaceHelpText>
            )}
          </SkeletonTheme>
        </div>
      </div>
    );
  };

  closeAllTemplateType = () => {
    this.props.resetStories();
    this.props.history.goBack();
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
    this.setState({ searchTerm: keyword }, () => {
      this.filterOrSearchTemplates();
    });
  };

  render() {
    const viewAllHeadings = this.getViewAllHeadings();
    const { stories, navbar } = this.props;
    const { category, formatDetails } = this.state;
    const { loaded, payload, loadMore } = stories;

    const templateCategories =
      [{ id: "", title: "all", display_name: "All" }].concat(
        navbar.payload.results
      ) || [];
    const categoriesView =
      navbar.loaded &&
      templateCategories &&
      templateCategories.map((templateCategory) => {
        return (
          <StyledRoundedPill
            key={templateCategory.id}
            className="template-categories"
            tldrbtn={
              category?.id === templateCategory.id ? "primary" : "default"
            }
            onClick={() => this.onFilterChange(templateCategory)}
          >
            {templateCategory.display_name}
          </StyledRoundedPill>
        );
      });

    let templateTypesContent =
      payload && Array.isArray(payload)
        ? payload.map((template) => {
            return (
              <StyledMarkerplaceCard
                key={template.id}
                location="template-marketplace-view-all"
              >
                <DesignCard
                  story={template}
                  tab={TAB_TEMPLATES}
                  showHoverOverlay={false}
                  isUsedInSwiper={false}
                />
              </StyledMarkerplaceCard>
            );
          })
        : [];

    templateTypesContent.length > 0
      ? templateTypesContent.unshift(
          <StyledMarkerplaceCard
            location="template-marketplace-view-all"
            onClick={() => this.handleClick()}
            key={0}
          >
            <div className="template-marketplace-empty-container">
              <div className="icon-container">
                <FontAwesomeIcon icon="plus" />
              </div>
              <span>{`Create ${formatDetails?.display_name}`}</span>
            </div>
          </StyledMarkerplaceCard>
        )
      : templateTypesContent.unshift(<React.Fragment key={0}></React.Fragment>);

    let aspectRatio = payload[0]?.image_width / payload[0]?.image_height;
    const numberOfTiles = 6; // It can be changeable.
    let slidesPerView =
      aspectRatio >= 6
        ? 4
        : aspectRatio >= 2
        ? 3
        : aspectRatio === 1
        ? 5
        : aspectRatio >= 1
        ? numberOfTiles / aspectRatio
        : aspectRatio < 0.3
        ? 12
        : aspectRatio < 0.9 && aspectRatio > 0.8
        ? 8
        : numberOfTiles * (aspectRatio + 0.4);

    return (
      <StyledMarketplaceContent>
        <TldrAiBase
          className="templates-header-box templates-view-all"
          cardBodyClassName="marketplace-templates-card-body"
        >
          <div className="view-all-templates-info-container">
            <div className="view-all-templates-title">
              <div className="go-back" onClick={this.closeAllTemplateType}>
                <FontAwesomeIcon icon={faArrowLeft}></FontAwesomeIcon>
              </div>

              <div className="ml-4">
                {viewAllHeadings}

                <TldrSearch
                  onSearch={this.handleSearch}
                  className="mt-3"
                  size="lg"
                  searchLocation="dashboard"
                  placeholder="Search story, post, topic, templates"
                  width="400px"
                />
              </div>
            </div>
          </div>

          <img
            src={formatDetails?.hero || formatDetails?.image}
            style={{ height: "100%", width: "auto" }}
            alt={formatDetails?.display_name}
          />
        </TldrAiBase>

        <StyledMarketplaceViewAllTemplatesBreadcrumbRow>
          <Breadcrumb>
            <Breadcrumb.Item onClick={this.closeAllTemplateType}>
              Templates
            </Breadcrumb.Item>
            <Breadcrumb.Item
              active={category?.id === ""}
              onClick={() => this.onFilterChange(templateCategories[0])}
            >
              {formatDetails?.display_name}
            </Breadcrumb.Item>
            {category?.id !== "" && (
              <Breadcrumb.Item active>
                {this.state.category?.display_name}
              </Breadcrumb.Item>
            )}
          </Breadcrumb>
        </StyledMarketplaceViewAllTemplatesBreadcrumbRow>

        {navbar.loaded && (
          <TLDRSwiper swiperParams={viewAllTemplateCategoriesSwiperParams}>
            {categoriesView}
          </TLDRSwiper>
        )}

        <StyledMarketPlaceGallery>
          {loaded && payload.length > 0 ? (
            <TLDRInfiniteScroll
              childrens={templateTypesContent}
              className="view-all-templates-infinite-scroll"
              loadMoreData={this.loadMoreData}
              hasMore={loadMore}
              scrollableTarget={MAIN_CONTAINER_SCROLLABLE_TARGET_ID}
              wrapChildrenInCustomGrid
              templatesPerRow={Math.ceil(slidesPerView)}
            />
          ) : loaded && payload.length === 0 ? (
            <>
              {templateTypesContent}
              <RequestTemplateContent text="No templates found"></RequestTemplateContent>
            </>
          ) : (
            <ShowCenterSpinner loaded={loaded} />
          )}
        </StyledMarketPlaceGallery>
      </StyledMarketplaceContent>
    );
  }
}

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

ViewAllTemplates.propTypes = {
  loadMoreData: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  stories: state.stories,
  navbar: state.navbar,
});

const mapDispatchToProps = {
  createStory,
  fetchCategories,
  resetStories,
  fetchViewAllTemplatesByGroup,
  resetTemplatesViewAll,
  filterTemplatesByCategory,
  fetchTemplatesByGroup,
  searchFormats,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ViewAllTemplates));
