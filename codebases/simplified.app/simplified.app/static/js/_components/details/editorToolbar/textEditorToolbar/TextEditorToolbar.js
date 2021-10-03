import React from "react";
import { connect } from "react-redux";
import { StyledTextEditorToolbarFormatGroup } from "../../../styled/details/stylesDetails";
import TLDRBold from "./TLDRBold";
import TLDRFontDropDown from "./TLDRFontDropDown";
import TLDRFontSize from "./TLDRFontSize";
import TLDRItalic from "./TLDRItalic";
import TLDRStrikethrough from "./TLDRStrikethrough";
import TLDRTextColor from "./TLDRTextColor";
import TLDRTextHighlightColor from "./TLDRTextHighlightColor";
import TLDRUnderline from "./TLDRUnderline";

const TextEditorToolbar = (props) => {
  const { canvasRef } = props;

  return (
    <>
      <div className="tldr-vl" />
      <StyledTextEditorToolbarFormatGroup>
        <TLDRFontDropDown canvasRef={canvasRef} />
        <TLDRFontSize canvasRef={canvasRef} />
      </StyledTextEditorToolbarFormatGroup>
      <div className="tldr-vl" />
      <StyledTextEditorToolbarFormatGroup>
        <TLDRBold canvasRef={canvasRef} />
        <TLDRItalic canvasRef={canvasRef} />
        <TLDRUnderline canvasRef={canvasRef} />
        <TLDRStrikethrough canvasRef={canvasRef} />
        <TLDRTextColor canvasRef={canvasRef} top={40} right={-100} />
        <TLDRTextHighlightColor canvasRef={canvasRef} top={40} right={-156} />
      </StyledTextEditorToolbarFormatGroup>
    </>
  );
};

TextEditorToolbar.propTypes = {};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TextEditorToolbar);
