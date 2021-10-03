import React, { Component } from "react";
import PropTypes from "prop-types";
import AsyncSelect from "react-select/async";
import { fontSelectStyle } from "../../../../styled/details/stylesSelect";
import { findIndex } from "lodash";
import { connect } from "react-redux";
import TLDRBrowseMoreFontsModal from "./TLDRBrowseMoreFontsModal";
import { ADD_MORE_FONTS } from "../../../../../_utils/constants";
import axios from "axios";
import { FONTS_ENDPOINT } from "../../../../../_actions/endpoints";
import { debounce } from "lodash";
import { fontsGetAdded } from "../../../../../_actions/appActions";
class TLDRFontOptions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showMoreFontBrowser: false,
    };

    this.addMoreFontLabel = ADD_MORE_FONTS;
  }

  render() {
    const { font, fonts, canvasRef, fontId } = this.props;
    const { showMoreFontBrowser } = this.state;

    let myFontList = fonts.filter((font, index) => font.organization !== null);
    myFontList = myFontList.map((font, index) => ({
      value: font?.id || font.family,
      label: font.family,
    }));

    let defaultFontList = fonts.filter(
      (font, index) => font.organization === null
    );
    defaultFontList = defaultFontList.map((font, index) => ({
      value: font?.id || font.family,
      label: font.family,
    }));
    let fontOptions = [
      { label: this.addMoreFontLabel, value: "" },
      {
        label: "My Fonts",
        options: myFontList,
      },
      {
        label: "Default Fonts",
        options: defaultFontList,
      },
    ];

    // TODO: Improve to find valueIndex
    let valueIndex = findIndex(fontOptions, {
      value: font,
      label: fontId || font,
    });

    return (
      <>
        <AsyncSelect
          value={
            valueIndex > 0
              ? fontOptions[valueIndex]
              : { value: fontId || font, label: font }
          }
          onChange={this.onChange}
          options={fontOptions}
          defaultOptions={fontOptions}
          loadOptions={this.searchedFontOptions}
          styles={fontSelectStyle}
          placeholder="Font"
          isSearchable
          // cacheOptions
          onMenuClose={this.onMenuClose}
          hasValue={true}
        />
        <TLDRBrowseMoreFontsModal
          show={showMoreFontBrowser}
          onHide={this.hideMoreFontBrowser}
          canvasRef={canvasRef}
        />
      </>
    );
  }

  onChange = (selected) => {
    if (selected.label === this.addMoreFontLabel) {
      this.browseMoreFonts();
      return;
    }
    this.props.onFontChange(selected);
  };

  browseMoreFonts = () => {
    this.setState({
      showMoreFontBrowser: true,
    });
  };

  hideMoreFontBrowser = () => {
    this.setState({
      showMoreFontBrowser: false,
    });
  };

  onMenuClose = (data) => {};

  searchedFontOptions = debounce(
    (inputValue) => {
      const { canvasRef } = this.props;

      // Search font from remote server by family name
      const FONT_SEARCH_ENDPOINT = `${FONTS_ENDPOINT}?search=${inputValue}`;
      return axios
        .get(FONT_SEARCH_ENDPOINT)
        .then((res) => {
          const fonts = res?.data?.results || [];

          // Add font face file into DOM
          canvasRef?.handler.fontHandler.addFonts(fonts);
          this.props.fontsGetAdded(fonts);

          return fonts.map((font, index) => ({
            value: font.id,
            label: font.family,
          }));
        })
        .catch((error) => {
          console.error(error);
          return [];
        });
    },
    500,
    { leading: false, trailing: true, maxWait: 500 }
  );
}

TLDRFontOptions.propTypes = {
  onFontChange: PropTypes.func.isRequired,
};

TLDRFontOptions.defaultProps = {
  font: "Roboto",
  fontId: null,
};

const mapStateToProps = (state) => ({
  fonts: state.app.fonts,
});

const mapDispatchToProps = (dispatch) => ({
  fontsGetAdded: (fonts) => dispatch(fontsGetAdded(fonts)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TLDRFontOptions);
