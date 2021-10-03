import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import TLDRInfiniteGalleryJustifiedLayout from "../_components/common/TLDRInfiniteGalleryJustifiedLayout";
import {
  StyledMarketPlaceHeader,
  StyledMarketplaceMasonryView,
  StyledMarketplaceTemplatesBreadcrumbRow,
} from "../_components/styled/home/stylesHome";
import { Breadcrumb } from "react-bootstrap";
import Select from "react-select";
import { templateFilterOptionsStyle } from "../_components/styled/details/stylesSelect";
import { fetchFormats } from "../_actions/slidePresetActions";
import axios from "axios";
import {
  cloneTemplate,
  fetchTemplatesByGroup,
  fetchViewAllTemplatesByGroup,
  resetTemplatesViewAll,
} from "../_actions/storiesActions";
import { analyticsTrackEvent } from "../_utils/common";
import { TldrProgressDialog } from "../_components/common/statelessView";
import TldrSearch from "../_components/common/TldrSearch";
import { TEMPLATES_SCREEN } from "../_utils/routes";
import Format from "string-format";
import TldrSearchSuggestion from "../_components/common/TldrSearchSuggestion";
import queryString from "query-string";

class TemplatesMasonryView extends Component {
  signal = axios.CancelToken.source();
  constructor(props) {
    super(props);

    this.state = {
      formatOptions: [],
      selectedFormatForFilter: null,
      inProgress: "false",
      showCloneModal: false,
      searchText: "",
      showSuggestions: false,
    };
  }

  componentDidMount() {
    var querySearchParam = queryString.parse(this.props.location.search).search;
    var options = [{ value: "", label: "All Formats" }];
    this.props.fetchFormats().then(() => {
      this.props.slidePresets.presets.forEach((preset) => {
        options.push({
          value: preset.title,
          label: preset.display_name,
        });
      });
    });

    this.setState({
      formatOptions: options,
      selectedFormatForFilter: options[0],
      searchText: querySearchParam,
    });
  }

  handleSearch = (keyword) => {
    this.setState(
      {
        searchText: keyword,
      },
      () => {
        this.props.onSearch(keyword);
      }
    );
  };

  handleSearchFocus = () => {
    this.setState({
      showSuggestions: true,
    });
  };

  handleSearchClear = (key) => {
    this.setState({
      searchText: "",
    });
  };

  goBack = () => {
    this.props.handleSearchClear("");
  };

  selectFormat = (selected) => {
    this.props.resetTemplatesViewAll();

    this.setState(
      {
        selectedFormatForFilter: selected,
      },
      () => {
        if (this.state.selectedFormatForFilter.value === "") {
          this.loadPage();
          return;
        }
        this.props.fetchViewAllTemplatesByGroup(
          this.state.searchText,
          this.state.selectedFormatForFilter.value,
          "",
          1,
          { ...this.props },
          this.signal.token
        );
      }
    );
  };

  handleOnClick = (story) => {
    this.setState({
      inProgress: true,
      showCloneModal: true,
    });
    this.props.cloneTemplate(story.id, this.signal, this.props);
    analyticsTrackEvent("cloneTemplate", {
      template: story.id,
    });
  };

  handleSearchWrapperOnBlur = (event) => {
    if (event.currentTarget.id !== event.relatedTarget?.id) {
      this.setState({ showSuggestions: false });
    }
  };

  render() {
    const { stories } = this.props;
    const { loaded, payload, templatePayload, loadMore } = stories;
    const {
      formatOptions,
      selectedFormatForFilter,
      inProgress,
      showCloneModal,
      showSuggestions,
      searchText,
    } = this.state;

    let templateArray =
      templatePayload && templatePayload.length > 0 ? templatePayload : payload;
    let childElements = templateArray.map((template) => {
      const { id, groupKey, image, title, format_display_name } = template;
      return (
        <div
          key={id}
          data-groupkey={groupKey}
          className="item"
          onClick={() => this.handleOnClick(template)}
        >
          <div className="thumbnail">
            <img src={image} alt={""} />
          </div>

          <div className="overlay-info-container">
            <div className="overlay-info">
              <p>{format_display_name}</p>
              <p>{title}</p>
            </div>
          </div>
        </div>
      );
    });

    return (
      <>
        <StyledMarketplaceTemplatesBreadcrumbRow>
          <div>
            <Breadcrumb>
              <Breadcrumb.Item onClick={this.goBack}>Templates</Breadcrumb.Item>
              <Breadcrumb.Item active>
                {selectedFormatForFilter?.value === ""
                  ? "All Formats"
                  : selectedFormatForFilter?.label}
              </Breadcrumb.Item>
              <Breadcrumb.Item active={searchText?.length > 0}>
                {searchText}
              </Breadcrumb.Item>
            </Breadcrumb>

            {searchText?.length > 0 && (
              <StyledMarketPlaceHeader className="mr-0 ml-0 mb-2 marketplace-templates-search-result-header">
                '{searchText}' Templates
              </StyledMarketPlaceHeader>
            )}
          </div>

          <div className="breadcrumb__template-search-row">
            <div
              id="tldr-templates-search-wrapper"
              tabIndex={0}
              onBlur={(e) => this.handleSearchWrapperOnBlur(e)}
              className="templates-info-container"
            >
              <TldrSearch
                onSearch={this.handleSearch}
                className="template-search__search-bar"
                size="lg"
                searchLocation="dashboard"
                placeholder="Search formats, templates"
                width="400px"
                onFocus={this.handleSearchFocus}
                onClear={this.handleSearchClear}
                handleEnterKeyEvent={this.showSearchResults}
                handleEscKeyEvent={() => {
                  this.setState({ showSuggestions: false });
                }}
              />

              {showSuggestions && (
                <TldrSearchSuggestion
                  width="400px"
                  searchTerm={searchText}
                  searchLocation="dashboard"
                  handleShowAllClick={this.showSearchResults}
                />
              )}
            </div>

            <div className="tldr-vl" />

            <Select
              isSearchable={false}
              isClearable={false}
              styles={templateFilterOptionsStyle}
              options={formatOptions}
              value={selectedFormatForFilter}
              onChange={(selected) => this.selectFormat(selected)}
            />
          </div>
        </StyledMarketplaceTemplatesBreadcrumbRow>

        <StyledMarketplaceMasonryView>
          <TLDRInfiniteGalleryJustifiedLayout
            childElements={childElements}
            hasMore={loadMore}
            loaded={loaded}
            loadPage={(groupKey) => this.loadPage(groupKey)}
            className="marketplace-template-search-gallery"
          />
        </StyledMarketplaceMasonryView>

        <TldrProgressDialog
          inprogress={inProgress}
          show={showCloneModal}
          onHide={() => {
            this.setState({
              ...this.state,
              showCloneModal: false,
            });
          }}
          onYes={() => {
            this.setState({
              inProgress: "true",
            });
          }}
        ></TldrProgressDialog>
      </>
    );
  }

  loadPage = (groupKey) => {
    const { searchText } = this.state;

    this.props.fetchTemplatesByGroup(
      searchText,
      { ...this.props, groupKey },
      this.signal.token
    );
  };

  showSearchResults = () => {
    const { searchText } = this.state;
    const searchParameter = "?search={0}";

    this.props.resetTemplatesViewAll();

    this.setState(
      {
        showSuggestions: false,
      },
      () => {
        if (this.state.selectedFormatForFilter.value !== "") {
          this.selectFormat(this.state.selectedFormatForFilter);
          return;
        }

        this.props.history.replace({
          pathname: TEMPLATES_SCREEN,
          search:
            searchText.length === 0
              ? ""
              : Format(searchParameter, encodeURIComponent(searchText)),
        });
      }
    );
  };
}

TemplatesMasonryView.propTypes = {};

const mapStateToProps = (state) => ({
  stories: state.stories,
  slidePresets: state.slidePresets,
});

const mapDispatchToProps = (dispatch) => ({
  resetTemplatesViewAll: () => dispatch(resetTemplatesViewAll()),
  fetchTemplatesByGroup: (searchTerm, props, signalToken, tags) =>
    dispatch(fetchTemplatesByGroup(searchTerm, props, signalToken, tags)),
  fetchViewAllTemplatesByGroup: (
    searchTerm,
    formatId,
    categoryId,
    pageIndex,
    props,
    signalToken
  ) =>
    dispatch(
      fetchViewAllTemplatesByGroup(
        searchTerm,
        formatId,
        categoryId,
        pageIndex,
        props,
        signalToken
      )
    ),
  fetchFormats: (key, props) => dispatch(fetchFormats(key, props)),
  cloneTemplate: (storyId, signal, props) =>
    dispatch(cloneTemplate(storyId, signal, props)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TemplatesMasonryView));
