import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getFontVariants } from "../../../../_utils/common";
import TLDRFontWeight from "./TLDRFontWeight";

const TLDRFontWeightDropDown = (props) => {
  const { canvasRef, activeElement, fonts } = props;

  const editorFormat = canvasRef?.handler.textHandler.getStyle(
    activeElement.format
  );
  const [fontFamily, setFontFamily] = useState(editorFormat?.fontFamily);
  const [fontWeight, setFontWeight] = useState(editorFormat?.fontWeight);

  useEffect(() => {
    const editorFormat = canvasRef?.handler.textHandler.getStyle(
      activeElement.format
    );

    setFontWeight(editorFormat?.fontWeight);
    setFontFamily(editorFormat?.fontFamily);
  }, [activeElement.format, canvasRef]);

  function onFontWeightChange(weight) {
    const { canvasRef } = props;
    canvasRef.handler.textHandler.fontWeight(weight);
  }

  // TODO: Variant list should be in order.

  return (
    <TLDRFontWeight
      variants={getFontVariants(fonts, fontFamily)}
      font={fontFamily}
      fontWeight={fontWeight}
      onFontWeightChange={onFontWeightChange}
    />
  );
};

const mapStateToProps = (state) => ({
  activeElement: state.editor.activeElement,
  fonts: state.app.fonts,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TLDRFontWeightDropDown);
