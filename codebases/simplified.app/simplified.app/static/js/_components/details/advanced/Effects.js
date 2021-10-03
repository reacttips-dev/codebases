import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import TextEffects from "./TextEffects";
import ImageEffects from "./imageEffects/ImageEffects";

export class Effects extends Component {
  render() {
    const { editor, canvasRef } = this.props;
    const { activeElement } = editor;
    return (
      <>
        {activeElement.mime === "text" ? (
          <TextEffects canvasRef={canvasRef} />
        ) : activeElement.mime === "image" ? (
          <ImageEffects canvasRef={canvasRef}></ImageEffects>
        ) : activeElement.mime === "video" ? (
          <ImageEffects canvasRef={canvasRef}></ImageEffects>
        ) : activeElement.mime === "shape" || activeElement.mime === "gif" ? (
          <></>
        ) : (
          <></>
        )}
      </>
    );
  }
}

Effects.propTypes = {
  editor: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Effects);
