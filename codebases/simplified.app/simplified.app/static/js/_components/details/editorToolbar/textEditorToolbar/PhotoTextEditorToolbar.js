import React from "react";
import { connect } from "react-redux";
import { StyledTextEditorToolbarFormatGroup } from "../../../styled/details/stylesDetails";
import TLDRFontDropDown from "./TLDRFontDropDown";
import TLDRFontSize from "./TLDRFontSize";
import TLDRTextMask from "./TLDRTextMask";

const PhotoTextEditorToolbar = (props) => {
  const { canvasRef } = props;

  return (
    <>
      <div className="tldr-vl" />
      <StyledTextEditorToolbarFormatGroup>
        <TLDRFontDropDown canvasRef={canvasRef} />
        <TLDRFontSize canvasRef={canvasRef} />
      </StyledTextEditorToolbarFormatGroup>

      <TLDRTextMask canvasRef={canvasRef} />
      <div className="tldr-vl" />
    </>
  );
};

PhotoTextEditorToolbar.propTypes = {};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhotoTextEditorToolbar);
