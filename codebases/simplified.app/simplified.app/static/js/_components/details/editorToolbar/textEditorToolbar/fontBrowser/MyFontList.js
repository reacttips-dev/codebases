import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyledListGroupFontItem,
  StyledListGroupMyFont,
  StyledMyFontTitle,
  StyledMyFontListWrapper,
} from "../../../../styled/styleFontBrowser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { deleteFont } from "../../../../../_actions/appActions";
import { Spinner } from "react-bootstrap";

class MyFontList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deletingFont: [],
    };
    this.listRef = React.createRef();
  }

  render() {
    let { fonts } = this.props;

    fonts = fonts.filter((font, index) => !(font.organization === null));

    const fontItems = fonts.map((font, index) => {
      return (
        <StyledListGroupFontItem family={font.family} key={index}>
          <div>{font.family}</div>

          {this.state.deletingFont.indexOf(font.id) > -1 ? (
            <Spinner
              variant="warning"
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <FontAwesomeIcon
              icon={faTimes}
              onClick={(event) => this.deleteFont(font)}
            />
          )}
        </StyledListGroupFontItem>
      );
    });

    return (
      <StyledMyFontListWrapper>
        <StyledMyFontTitle>My Fonts</StyledMyFontTitle>
        <StyledListGroupMyFont>
          {fontItems}
          {fonts.length === 0 && (
            <StyledListGroupFontItem>
              <div>Add font to My font list.</div>
            </StyledListGroupFontItem>
          )}
        </StyledListGroupMyFont>
      </StyledMyFontListWrapper>
    );
  }

  deleteFont = (font) => {
    this.setState(
      {
        ...this.state,
        deletingFont: this.state.deletingFont.concat([font.id]),
      },
      () => {
        this.props.deleteFont(font.id, this.props);
        this.setState({
          ...this.state,
          deletingFont: this.state.deletingFont.filter(
            (id, index) => id !== font.id
          ),
        });
      }
    );
  };
}

MyFontList.propTypes = {
  fonts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  fonts: state.app.fonts,
});

const mapDispatchToProps = (dispatch) => ({
  deleteFont: (id, props) => dispatch(deleteFont(id, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyFontList);
