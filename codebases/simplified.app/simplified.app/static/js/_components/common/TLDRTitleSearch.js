import React, { Component } from "react";
import {
  StyledSectionTitle,
  StyledTitleRowWrapper,
} from "../styled/home/stylesHome";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { lightInactive } from "../styled/variable";
import TldrSearch from "./TldrSearch";
import Select from "react-select";
import { templateFilterOptionsStyle } from "../styled/details/stylesSelect";
import { fetchFormats } from "../../_actions/slidePresetActions";
import { connect } from "react-redux";
import {
  fetchTemplatesByGroup,
  fetchViewAllTemplatesByGroup,
  resetTemplatesViewAll,
} from "../../_actions/storiesActions";
import axios from "axios";

class TLDRTitleSearch extends Component {
  signal = axios.CancelToken.source();
  constructor(props) {
    super(props);
    this.state = {
      isSearchOpen: false,
      searchValues: false,
      formatOptions: [],
      selectedFormatForFilter: null,
    };
  }

  componentDidMount() {
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
    });
  }

  render() {
    const { isSearchOpen, formatOptions, selectedFormatForFilter } = this.state;
    const { title, classes, style, searchConfig, showFilterDropdown } =
      this.props;
    const {
      handleSearch,
      onFocus,
      handleEnterKeyEvent,
      handleEscKeyEvent,
      onClear,
      ...otherSearchProps
    } = searchConfig;
    return (
      <StyledTitleRowWrapper
        className={`${classes ? classes : ""}`}
        style={{ ...style }}
      >
        {isSearchOpen ? (
          <div className="d-sm-search-container">
            <TldrSearch
              autoFocus
              width={"100%"}
              size="sm"
              placeholder="Search anything"
              searchLocation="dashboard"
              onSearch={(keyword) => {
                this.setState({ searchValues: true });
                handleSearch(keyword);
              }}
              onSearchIconClick={this.onSearchIconClick}
              onFocus={onFocus}
              handleEnterKeyEvent={handleEnterKeyEvent}
              handleEscKeyEvent={handleEscKeyEvent}
              onClear={onClear}
            ></TldrSearch>

            {isSearchOpen && showFilterDropdown && (
              <Select
                isSearchable={false}
                isClearable={false}
                styles={templateFilterOptionsStyle}
                options={formatOptions}
                value={selectedFormatForFilter}
                onChange={(selected) => this.selectFormat(selected)}
              />
            )}
          </div>
        ) : (
          <>
            <StyledSectionTitle>{title}</StyledSectionTitle>
            <FontAwesomeIcon
              icon={"search"}
              color={lightInactive}
              className="search-icon"
              onClick={(event) => {
                this.onSearchIconClick(event);
              }}
            ></FontAwesomeIcon>
          </>
        )}
      </StyledTitleRowWrapper>
    );
  }

  onSearchIconClick = (event) => {
    const { handleEscKeyEvent } = this.props.searchConfig;

    this.setState(
      {
        ...this.state,
        isSearchOpen: !this.state.isSearchOpen,
      },
      () => {
        if (!this.state.isSearchOpen) {
          handleEscKeyEvent();
        }
      }
    );
  };

  selectFormat = (selected) => {
    this.props.resetTemplatesViewAll();

    this.setState(
      {
        selectedFormatForFilter: selected,
      },
      () => {
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
}

TLDRTitleSearch.propTypes = {};

const mapStateToProps = (state) => ({
  slidePresets: state.slidePresets,
});

const mapDispatchToProps = (dispatch) => ({
  fetchFormats: (key, props) => dispatch(fetchFormats(key, props)),
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
});

export default connect(mapStateToProps, mapDispatchToProps)(TLDRTitleSearch);
