import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getFontVariants } from "../../../../_utils/common";
import TLDRFontOptions from "./fontBrowser/TLDRFontOptions";
import { FONT_REGULAR_WEIGHT } from "../../constants";

const TLDRFontDropDown = (props) => {
  const { canvasRef, activeElement } = props;

  const [fontFamily, setFontFamily] = useState(
    activeElement.format?.fontFamily
  );

  const [fontId, setFontId] = useState(activeElement.format?.fontId);

  useEffect(() => {
    setFontFamily(activeElement.format?.fontFamily);
    setFontId(activeElement.format?.fontId);
  }, [activeElement.format]);

  function onFontChange(selectedOption) {
    const { fonts, canvasRef } = props;

    const variants = getFontVariants(fonts, selectedOption.value);

    let { fontWeight } = activeElement.format;

    fontWeight = !canvasRef.handler.textHandler.currentFontVariantExists(
      fontWeight,
      variants
    )
      ? FONT_REGULAR_WEIGHT
      : fontWeight;

    canvasRef.handler.textHandler.font(
      selectedOption.label,
      fontWeight,
      selectedOption.value
    );
  }

  return (
    <TLDRFontOptions
      font={fontFamily}
      fontId={fontId}
      onFontChange={onFontChange}
      canvasRef={canvasRef}
    />
  );
};

const mapStateToProps = (state) => ({
  activeElement: state.editor.activeElement,
  fonts: state.app.fonts,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TLDRFontDropDown);
