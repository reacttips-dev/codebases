import React, { Component } from "react";
import { connect } from "react-redux";
import FiniteGridLayout from "../../../common/FiniteGridLayout";
import FontsDropZone from "../../../common/FontsDropZone";
import { deleteFont } from "../../../../_actions/appActions";
import TextMyFont from "./TextMyFont";

class TextMyFontsList extends Component {
  render() {
    const { myFonts } = this.props;

    let childElements =
      myFonts &&
      myFonts.map((font, index) => {
        return <TextMyFont key={index} font={font} />;
      });

    return (
      <>
        <div className="subtitle-s">My fonts</div>
        <hr className="tldr-hr" />
        <FontsDropZone className="tldr-fonts-dropzone" buttonWidth={100} />
        <div className="grid-gallary my-font-gallary" id="tldr-my-fonts">
          <FiniteGridLayout childElements={childElements} loaded={true} />
        </div>
      </>
    );
  }

  onClickDeleteFont = (event, fontId) => {
    this.props.deleteFont(fontId);
  };
}

const mapStateToProps = (state) => ({
  myFonts: state.app.fonts.filter((font) => {
    return font?.organization > 0;
  }),
});

const mapDispatchToProps = (dispatch) => ({
  deleteFont: (fontId, props) => dispatch(deleteFont(fontId, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextMyFontsList);
