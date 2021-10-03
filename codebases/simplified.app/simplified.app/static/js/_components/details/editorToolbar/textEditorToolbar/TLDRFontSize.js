import React from "react";
import { connect } from "react-redux";
import {
  convertNumberToPixel,
  convertPixelToFloat,
  pixelToPoint,
  pointToPixel,
} from "../../../../_utils/common";
import TLDRSelectMenuWithIncrementDecrement from "../../../common/TLDRSelectMenuWithIncrementDecrement";
import { fontSizes } from "../../constants";

const TLDRFontSize = (props) => {
  const { activeElement } = props;
  const fontSizeOptions = fontSizes.map((point, index) => ({
    value: `${pointToPixel(point).toFixed(4)}px`,
    label: point,
  }));

  function createFontSizeOption(fontPoint) {
    return {
      value: `${pointToPixel(fontPoint)}px`,
      label: fontPoint,
    };
  }

  function onFontSizeChange(fontPoint) {
    props.canvasRef.handler.textHandler.fontSize(
      convertPixelToFloat(fontPoint)
    );
  }

  function getSizeValue(size) {
    return size
      ? {
          value: convertNumberToPixel(size),
          label: Math.round(pixelToPoint(size)),
        }
      : { value: "64px", label: "48" };
  }

  return (
    <TLDRSelectMenuWithIncrementDecrement
      createOption={createFontSizeOption}
      onValueChange={onFontSizeChange}
      options={fontSizeOptions}
      placeholder={"Size"}
      value={getSizeValue(activeElement.format?.fontSize)}
    />
  );
};

const mapStateToProps = (state) => ({
  activeElement: state.editor.activeElement,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TLDRFontSize);
