import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect, batch } from "react-redux";
import {
  fetchData,
  search,
  resetPage,
  resetSidebarSliderPayload,
  changeSource,
  fetchDataOnSourceChange,
  searchDataOnSourceChange,
} from "../../_actions/sidebarSliderActions";
import { FormControl, InputGroup, OverlayTrigger } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { StyledMarkerplaceSearch } from "../styled/home/stylesHome";
import TldrPopover from "./TldrPopover";
import { IconsSources, ImageSources, VideoSources } from "../../_actions/types";
import { getCurrentMediaSource } from "./statelessView";
import { debounce } from "lodash";
import { API_DEBOUNCE_TIME } from "../../_utils/constants";

class SearchForm extends Component {
  abortController = new AbortController();
  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.state = {
      searchText: this.props.searchText,
      imgSource: "Unsplash",
      selectedSource: "",
      imageSources: [],
    };
    this.onPopoverClick = this.onPopoverClick.bind(this);
  }

  render() {
    const { searchText } = this.state;
    const { autoFocus } = this.props;

    var { imageSource, videoSource, iconsSource } = this.props.sidebarSlider;

    const showImagesPopover = (
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={
          <TldrPopover
            props={this.props}
            onChange={this.onPopoverClick}
            defaultChecked={imageSource}
            validsources={[
              ImageSources.UNSPLASH,
              ImageSources.PIXABAY,
              ImageSources.PEXELS,
              ImageSources.SHOPIFY,
              ImageSources.GOOGLE_DRIVE,
            ]}
          />
        }
      >
        <InputGroup.Append className={"ml-0"}>
          <InputGroup.Text>
            <FontAwesomeIcon icon="sliders-h" size="1x" className={"ml-1"} />
          </InputGroup.Text>
        </InputGroup.Append>
      </OverlayTrigger>
    );

    const showVideosPopover = (
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={
          <TldrPopover
            props={this.props}
            onChange={this.onPopoverClick}
            defaultChecked={videoSource}
            validsources={[
              VideoSources.PIXABAY,
              VideoSources.PEXELS,
              VideoSources.STORYBLOCKS,
            ]}
          />
        }
      >
        <InputGroup.Append className={"ml-0"}>
          <InputGroup.Text>
            <FontAwesomeIcon icon="sliders-h" size="1x" className={"ml-1"} />
          </InputGroup.Text>
        </InputGroup.Append>
      </OverlayTrigger>
    );

    const showIconsPopover = (
      <OverlayTrigger
        trigger="click"
        placement="bottom"
        overlay={
          <TldrPopover
            props={this.props}
            onChange={this.onPopoverClick}
            defaultChecked={iconsSource}
            validsources={[IconsSources.FLATICON, IconsSources.BRANDFETCH]}
          />
        }
      >
        <InputGroup.Append className={"ml-0"}>
          <InputGroup.Text>
            <FontAwesomeIcon icon="sliders-h" size="1x" className={"ml-1"} />
          </InputGroup.Text>
        </InputGroup.Append>
      </OverlayTrigger>
    );

    return (
      <StyledMarkerplaceSearch location="studio" className="mr-0 ml-0">
        <InputGroup className="search-box">
          <InputGroup.Prepend className={"mr-0"}>
            <InputGroup.Text>
              <FontAwesomeIcon icon="search" size="1x" />
            </InputGroup.Text>
          </InputGroup.Prepend>

          <FormControl
            placeholder={this.getPlaceholder()}
            aria-label="Search"
            onChange={this.onInputChange}
            value={searchText}
            autoFocus={autoFocus}
          />

          <InputGroup.Append className={"ml-0"}>
            <InputGroup.Text>
              {searchText !== "" && (
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  size="1x"
                  onClick={this.clearSearch}
                  className={"mr-1"}
                />
              )}
            </InputGroup.Text>
          </InputGroup.Append>
          {this.props.panelType === "images" ? showImagesPopover : null}
          {this.props.panelType === "video" ? showVideosPopover : null}
          {/* {this.props.panelType === "icons" ? showIconsPopover : null} */}
        </InputGroup>
      </StyledMarkerplaceSearch>
    );
  }

  componentWillUnmount() {}

  onPopoverClick(e) {
    this.setState(
      {
        imgSource: e.target.value,
        selectedSource: e.target.value,
      },
      function () {
        if (this.state.searchText === "") {
          this.props.changeSource(this.state.selectedSource);
          this.props.fetchData(
            this.state.imgSource,
            { ...this.props },
            this.abortController.signal
          );
        } else {
          this.props.changeSource(this.state.selectedSource);
          this.props.search(
            this.state.imgSource,
            this.state.searchText,
            { ...this.props },
            this.abortController.signal
          );
        }
      }
    );
  }

  /* 
    Debounced search will receive search events and fires only last 
    one after waiting 500 ms
  */
  debouncedSearch = debounce(async (mediaSource) => {
    const { signalToken, cancelSignal } = this.props;
    const { searchText } = this.state;

    batch(() => {
      // Set page number to 1
      this.props.resetPage();
      // Clear payload
      this.props.resetSidebarSliderPayload();
    });
    // Avoid general fetch call only focusing search form input
    if (searchText === "") {
      this.props.fetchData(
        mediaSource,
        { ...this.props, page: 1 },
        signalToken
      );
    } else if (searchText.trim() !== "") {
      this.props.search(
        mediaSource,
        searchText.trim(),
        { ...this.props, searchText, page: 1 },
        signalToken
      );
    }
  }, API_DEBOUNCE_TIME);

  onInputChange(event) {
    // set selectedSource value based on what panelType/source is the user on:
    let mediaSource = getCurrentMediaSource(this.props, this.state);
    let searchText = event.target.value; // this is the search text
    this.setState({ searchText }, () => {
      this.debouncedSearch(mediaSource);
    });
  }

  clearSearch = (event) => {
    batch(() => {
      // Set page number to 1
      this.props.resetPage();
      // Clear payload
      this.props.resetSidebarSliderPayload();
    });

    let mediaSource = getCurrentMediaSource(this.props, this.state);
    this.setState({ searchText: "" }, () => {
      const { signalToken } = this.props;
      const { searchText } = this.state;

      this.props.fetchData(
        mediaSource,
        { ...this.props, searchText, page: 1 },
        signalToken
      );
    });
  };

  getPlaceholder = () => {
    const { panelType, type } = this.props;

    let searchFormPlaceholder = `Search ${
      (panelType || "") &&
      panelType.charAt(0).toUpperCase() + panelType.slice(1)
    }`;

    if (this.props.sidebarSlider.iconsSource === "Brandfetch") {
      searchFormPlaceholder = `Search Brand Logos`;
    }

    if (type) {
      searchFormPlaceholder = `Search ${type}`;
    }
    if (type === "Brandfetch") {
      searchFormPlaceholder = `Search Brand Logos`;
    }

    return searchFormPlaceholder;
  };
}

SearchForm.propTypes = {
  panelType: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  resetPage: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  signalToken: PropTypes.object.isRequired,
  categoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  categoryType: PropTypes.string,
  templateType: PropTypes.string,
};

SearchForm.defaultProps = {
  viewAll: false,
  type: "",
};

const mapStateToProps = (state) => ({
  panelType: state.sidebarSlider.sliderPanelType,
  page: state.sidebarSlider.page,
  searchText: state.sidebarSlider.searchText,
  sidebarSlider: state.sidebarSlider,
  story: state.story,
  pagestore: state.pagestore,
  editor: state.editor,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  resetPage: () => dispatch(resetPage()),
  fetchData: (source, props, token) =>
    dispatch(fetchData(source, props, token)),
  search: (source, searchTerm, props, token) =>
    dispatch(search(source, searchTerm, props, token)),
  resetSidebarSliderPayload: () => dispatch(resetSidebarSliderPayload()),
  fetchDataOnSourceChange: (source, props, token) =>
    dispatch(fetchDataOnSourceChange(source, props, token)),
  searchDataOnSourceChange: (source, searchTerm, props, token) =>
    dispatch(searchDataOnSourceChange(source, searchTerm, props, token)),
  changeSource: (source) => dispatch(changeSource(source)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);
