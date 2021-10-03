import React, { Component } from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { StyledMarkerplaceSearch } from "../styled/home/stylesHome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import queryString from "query-string";

class TldrSearch extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);
    this.onSearchTextChange = this.onSearchTextChange.bind(this);
    this.searchTimeInterval = 500;
    this.search = this.search.bind(this);
    this.throttledSearch = _.debounce(this.search, this.searchTimeInterval);
    this.timeout = 0;
    this.state = {
      searchText: "",
    };
  }

  componentDidMount() {
    var querySearchParam = queryString.parse(this.props.location.search).search;
    this.setState({
      searchText: querySearchParam,
    });
  }

  render() {
    const { searchText } = this.state;

    const {
      placeholder,
      width,
      autoFocus,
      className,
      size,
      showShadow,
      searchLocation,
      height,
    } = this.props;

    return (
      <>
        <StyledMarkerplaceSearch
          location={searchLocation}
          className={`mr-0 ml-0 ${className}`}
          width={width}
          size={size}
          height={height}
          showshadow={showShadow}
        >
          <InputGroup className="search-box">
            <InputGroup.Prepend className={"mr-0"}>
              <InputGroup.Text>
                <FontAwesomeIcon
                  icon="search"
                  size="1x"
                  className="ml-2"
                  onClick={(event) => {
                    this.onSearchIconClick(event);
                  }}
                />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder={placeholder}
              onChange={this.onSearchTextChange}
              value={searchText}
              autoFocus={autoFocus}
              onFocus={this.onSearchFocus}
              onKeyUp={this.onSearchKeyUp}
            />
            {searchText && searchText.length > 0 && (
              <InputGroup.Append
                className={"ml-0"}
                onClick={() => {
                  this.clearSearch();
                }}
              >
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faTimesCircle} size="1x" />
                </InputGroup.Text>
              </InputGroup.Append>
            )}
          </InputGroup>
        </StyledMarkerplaceSearch>
      </>
    );
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  onSearchIconClick = (event) => {
    if (this.props.onSearchIconClick) {
      this.props.onSearchIconClick();
    }
  };

  search = (searchText) => {
    this.props.onSearch(searchText);
  };

  onSearchTextChange = (event) => {
    var searchText = event.target.value; // this is the search text
    this.setState({
      searchText,
    });

    this.throttledSearch(searchText);
  };

  clearSearch = (event) => {
    this.setState(
      {
        searchText: "",
      },
      () => {
        if (this.props.onClear) {
          this.props.onClear(this.state.searchText);
        } else {
          this.props.onSearch(this.state.searchText);
        }
      }
    );
  };

  onSearchFocus = (e) => {
    if (this.props.onFocus) {
      this.props.onFocus(this.state.searchText);
    }
  };

  onSearchKeyUp = (e) => {
    switch (e.keyCode) {
      // esc
      case 27:
        if (this.props.handleEscKeyEvent) {
          this.props.handleEscKeyEvent();
        }
        break;
      case 13:
        if (this.props.handleEnterKeyEvent) {
          this.props.handleEnterKeyEvent();
        }
        break;
      default:
        break;
    }
  };
}

TldrSearch.propTypes = {};

TldrSearch.defaultProps = {
  placeholder: "Search story, post, topic, templates",
  width: "640px",
  location: "dashboard",
};

export default withRouter(TldrSearch);
