import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyledListGroupGoogleFontItem,
  StyledListGroupGoogleFont,
  StyledGoogleFontItemName,
  StyledGoogleFontFiltersWrapper,
  StyledGoogleFontListWrapper,
  sortSelectStyle,
} from "../../../../styled/styleFontBrowser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import {
  GOOGLE_FONTS_ENDPOINT,
  FONTS_ENDPOINT,
} from "../../../../../_actions/endpoints";
import { ShowCenterSpinner } from "./../../../../common/statelessView";
import { FixedSizeList } from "react-window";
import _ from "lodash";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { connect } from "react-redux";
import { fontGetAdded } from "../../../../../_actions/appActions";
import TldrSearch from "../../../../common/TldrSearch";
import Select from "react-select";

class GoogleFontList extends Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();

    this.state = {
      googleFonts: [],
      sort: { value: "popularity", label: "Popularity" },
      addingFont: {},
      searchPhrase: "",
      loaded: false,
    };

    this.sortOption = [
      {
        value: "alpha",
        label: "Alphabetical",
      },
      { value: "date", label: "Date" },
      { value: "popularity", label: "Popularity" },
      { value: "style", label: "Style" },
      { value: "trending", label: "Trending" },
    ];
  }

  render() {
    let { googleFonts, searchPhrase, sort, loaded } = this.state;
    const { canvasRef } = this.props;

    if (searchPhrase) {
      var re = new RegExp(searchPhrase, "i");
      googleFonts = googleFonts.filter((font, index) => font.family.match(re));
    }

    let sortValueIndex = _.findIndex(this.sortOptions, {
      value: sort.value,
      label: sort.label,
    });

    const FontItemRow = ({ index, isScrolling, style }) => {
      let font = googleFonts[index];

      let isFontInMyList = this.isGoogleFontInMyList(font);

      // Load font face
      canvasRef.handler.fontHandler.setOptions({
        clearCache: false,
      });
      font.source = "google";
      canvasRef.handler.fontHandler.addFont(font);

      return (
        <StyledListGroupGoogleFontItem
          family={font.family}
          style={style}
          onClick={(event) =>
            this.addFontToMyFontList(font, index, isFontInMyList)
          }
          key={index}
        >
          {isFontInMyList && <FontAwesomeIcon icon={faCheck} />}
          {this.state.addingFont[index] && (
            <Spinner
              variant="warning"
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
          <StyledGoogleFontItemName
            isSelected={isFontInMyList || this.state.addingFont[index]}
          >
            {font.family}
          </StyledGoogleFontItemName>
        </StyledListGroupGoogleFontItem>
      );
    };

    return (
      <StyledGoogleFontListWrapper>
        <StyledGoogleFontFiltersWrapper>
          <TldrSearch
            onSearch={this.onSearch}
            placeholder={"Search fonts"}
            width={"250px"}
            size="sm"
          />
          <Select
            value={sortValueIndex > 0 ? this.sortOptions[sortValueIndex] : sort}
            onChange={this.onSortChange}
            options={this.sortOption}
            styles={sortSelectStyle}
            placeholder="Sort by"
          />
        </StyledGoogleFontFiltersWrapper>
        <StyledListGroupGoogleFont>
          {googleFonts.length > 0 && (
            <FixedSizeList
              ref={this.listRef}
              itemCount={googleFonts.length}
              itemSize={48}
              height={window.innerHeight * 0.6 - 48}
              width={"100%"}
              // useIsScrolling
            >
              {FontItemRow}
            </FixedSizeList>
          )}

          {googleFonts.length === 0 && loaded && (
            <StyledListGroupGoogleFontItem>
              <StyledGoogleFontItemName>
                No fonts found.
              </StyledGoogleFontItemName>
            </StyledListGroupGoogleFontItem>
          )}

          {googleFonts.length === 0 && !loaded && (
            <ShowCenterSpinner loaded={loaded} />
          )}
        </StyledListGroupGoogleFont>
      </StyledGoogleFontListWrapper>
    );
  }

  componentDidMount() {
    this.fetchGoogleFonts();
    this.setState({
      ...this.state,
      loaded: true,
    });
  }

  onSearch = (searchPhrase) => {
    this.setState({
      ...this.state,
      searchPhrase: searchPhrase,
    });
  };

  fetchGoogleFonts = () => {
    const { sort } = this.state;
    let endpoint = GOOGLE_FONTS_ENDPOINT;
    if (sort) {
      endpoint += `&sort=${sort.value}`;
    }

    fetch(endpoint)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.setState({
          ...this.state,
          googleFonts: json.items,
        });
      })
      .catch((error) => {
        console.error("Google fonts fetching failed...", error);
      });
  };

  onSortChange = (selected) => {
    this.setState(
      {
        ...this.state,
        sort: selected,
      },
      () => {
        this.fetchGoogleFonts();
        this.listRef &&
          this.listRef.current &&
          this.listRef.current.scrollToItem(0);
      }
    );
  };

  isGoogleFontInMyList = (googleFont) => {
    const { fonts } = this.props;
    if (_.find(fonts, { family: googleFont.family })) {
      return true;
    }
    return false;
  };

  addFontToMyFontList(font, index, isFontInMyList) {
    if (isFontInMyList) {
      return;
    }

    this.setState({
      ...this.state,
      addingFont: {
        ...this.state.addingFont,
        [index]: true,
      },
    });

    let requestData = {
      family: font.family,
      source: "google",
      payload: font,
      organization: parseInt(this.props.auth.payload.selectedOrg),
    };

    axios
      .post(FONTS_ENDPOINT, requestData)
      .then((response) => {
        this.props.fontGetAdded(response.data);

        this.setState({
          ...this.state,
          addingFont: {
            ...this.state.addingFont,
            [index]: false,
          },
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({
          ...this.state,
          addingFont: {
            ...this.state.addingFont,
            [index]: false,
          },
        });
      });
  }
}

GoogleFontList.propTypes = {
  fonts: PropTypes.array.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fonts: state.app.fonts,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  fontGetAdded: (fontInfo) => dispatch(fontGetAdded(fontInfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GoogleFontList);
