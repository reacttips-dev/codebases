import { faPalette } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { rgbaTohex } from "../../../../_utils/common";
import TLDRColorPicker from "../../../common/TLDRColorPicker";

const TLDRTextColor = (props) => {
  const { activeElement, top, right, brandKit, showHexCode } = props;

  const [fill, setFill] = useState(activeElement.format?.fill);

  useEffect(() => {
    setFill(activeElement?.format?.fill);
  }, [activeElement.format]);

  function onColorChange(action, value) {
    const { canvasRef } = props;
    setFill(value);
    canvasRef.handler.textHandler.textColor(value);
  }

  return (
    <TLDRColorPicker
      action={"color"}
      title={"Text color"}
      showIcon={true}
      icon={faPalette}
      color={fill}
      property={"color"}
      callback={onColorChange}
      top={top}
      right={right}
      colorCode={showHexCode && rgbaTohex(fill)}
      showBrandkitPaletteColors={brandKit.brandkitPayload.length > 0}
    />
  );
};

const mapStateToProps = (state) => ({
  activeElement: state.editor.activeElement,
  brandKit: state.brandKit,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TLDRTextColor);
