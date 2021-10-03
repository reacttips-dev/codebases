import { faHighlighter } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { rgbaTohex } from "../../../../_utils/common";
import TLDRColorPicker from "../../../common/TLDRColorPicker";

const TLDRTextHighlightColor = (props) => {
  const { activeElement, top, right, brandKit, showHexCode } = props;

  const [textBackgroundColor, setTextBackgroundColor] = useState(
    activeElement.format?.textBackgroundColor
  );

  useEffect(() => {
    setTextBackgroundColor(activeElement.format?.textBackgroundColor);
  }, [activeElement.format]);

  function onColorChange(action, value) {
    const { canvasRef } = props;
    setTextBackgroundColor(value);
    canvasRef.handler.textHandler.textHighLightColor(value);
  }

  return (
    <TLDRColorPicker
      action={"background"}
      title={"Highlight color"}
      showIcon={true}
      icon={faHighlighter}
      color={textBackgroundColor}
      property={"background"}
      callback={onColorChange}
      top={top}
      right={right}
      colorCode={showHexCode && rgbaTohex(textBackgroundColor)}
      showBrandkitPaletteColors={brandKit.brandkitPayload.length > 0}
    />
  );
};

const mapStateToProps = (state) => ({
  activeElement: state.editor.activeElement,
  brandKit: state.brandKit,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TLDRTextHighlightColor);
