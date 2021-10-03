import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { StyledSearchSuggestionContainer } from "../styled/home/stylesHome";
import Format from "string-format";
import { fetchFormats, searchFormats } from "../../_actions/slidePresetActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TEMPLATES_BY_FORMAT_SCREEN } from "../../_utils/routes";
import { withRouter } from "react-router-dom";

class TldrSearchSuggestion extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    this.searchFormats(this.props.searchTerm);
  }

  componentDidUpdate(prevProps) {
    if (this.props.searchTerm !== prevProps.searchTerm) {
      this.searchFormats(this.props.searchTerm);
    }
  }

  searchFormats = (key = "") => {
    this.setState({
      ...this.state,
      loaded: false,
    });

    this.props.searchFormats(key, this.props).then(() => {
      this.setState({ ...this.state, loaded: true });
    });
  };

  // getSearchSuggestion = () => {
  //   const { searchTerm } = this.props;
  //   if (searchTerm.length === 0) {
  //     return;
  //   }

  //   this.setState({
  //     ...this.state,
  //     loaded: false,
  //   });

  //   let endpoint = Format(TEMPLATE_SEARCH_SUGGESTION_ENDPOINT, searchTerm);
  //   endpoint += "&template=template";

  //   axios
  //     .get(endpoint)
  //     .then((res) => {
  //       var suggestedTitles = [],
  //         suggestedTags = [],
  //         suggestedCategories = [];
  //       res.data.title_suggest.forEach((suggestion) => {
  //         suggestion.options.forEach((option) => {
  //           suggestedTitles.push(option);
  //         });
  //       });

  //       res.data.tag_suggest.forEach((suggestion) => {
  //         suggestion.options.forEach((option) => {
  //           suggestedTags.push(option);
  //         });
  //       });

  //       res.data.category_suggest.forEach((suggestion) => {
  //         suggestion.options.forEach((option) => {
  //           suggestedCategories.push(option);
  //         });
  //       });

  //       this.setState({
  //         ...this.state,
  //         titleSuggestions: suggestedTitles,
  //         tagSuggestions: suggestedTags,
  //         categorySuggestions: suggestedCategories,
  //         loaded: true,
  //       });
  //     })
  //     .catch((error) => console.log(error));
  // };

  handlePresetClick = (preset) => {
    const url = Format(TEMPLATES_BY_FORMAT_SCREEN, preset?.title);

    this.props.history.push({
      pathname: encodeURI(url),
      search: "",
    });
  };

  handleShowAllClick = () => {
    if (this.props.handleShowAllClick) {
      this.props.handleShowAllClick();
    }
  };

  render() {
    const { width, searchLocation, slidePresets, searchTerm, classes } =
      this.props;
    const { presets } = slidePresets;

    return (
      <StyledSearchSuggestionContainer
        width={width}
        location={searchLocation}
        className={classes ? classes : ""}
      >
        <div className="suggestion-box">
          {searchTerm?.length > 0 && (
            <div
              className="show-all-item"
              onClick={() => this.handleShowAllClick()}
            >
              <span>
                <FontAwesomeIcon icon="search" />
              </span>

              <div>
                <p className="title">Show all templates for:</p>
                <p className="searched-keyword">{searchTerm}</p>
              </div>
            </div>
          )}

          {presets.length > 0 && (
            <>
              <p className="title">Suggested Formats:</p>
              <ul className="template-search-suggestion-list">
                {presets.map((preset, index) => (
                  <React.Fragment key={index}>
                    <div
                      className="list-item-row"
                      onClick={() => this.handlePresetClick(preset)}
                    >
                      {preset.payload.hasOwnProperty("iconType") ? (
                        <FontAwesomeIcon
                          icon={["fab", `${preset.payload.icon}`]}
                        />
                      ) : (
                        <FontAwesomeIcon icon={preset.payload.icon} />
                      )}
                      <li
                        key={preset.id}
                        className="template-search-suggestion-list-item"
                      >
                        {preset.display_name}
                      </li>
                      <p className="template-search-suggestion-list-item_extra-data">
                        {preset.image_width} x {preset.image_height}
                      </p>
                    </div>
                  </React.Fragment>
                ))}
              </ul>
            </>
          )}
        </div>
      </StyledSearchSuggestionContainer>
    );
  }
}

TldrSearchSuggestion.propTypes = {
  searchTerm: PropTypes.string.isRequired,
};

TldrSearchSuggestion.defaultProps = {
  width: "400px",
  searchTerm: "",
};

const mapStateToProps = (state) => ({
  slidePresets: state.slidePresets,
});

const mapDispatchToProps = (dispatch) => ({
  searchFormats: (keyword, props) => dispatch(searchFormats(keyword, props)),
  fetchFormats: (keyword, props) => dispatch(fetchFormats(keyword, props)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TldrSearchSuggestion));
