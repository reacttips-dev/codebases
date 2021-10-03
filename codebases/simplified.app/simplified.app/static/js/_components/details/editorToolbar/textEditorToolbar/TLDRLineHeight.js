import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { checkInputboxValueRangeForSlider } from "../../../../_utils/common";
import TldrSlider from "../../../common/TldrSlider";
import { DOMAIN_1_TO_5, SLIDER_VALUE_REGEX } from "../../constants";

const TLDRLineHeight = (props) => {
  const { canvasRef, activeElement } = props;

  const editorFormat = canvasRef?.handler.textHandler.getStyle(
    activeElement.format
  );

  const [lineHeight, setLineHeight] = useState([
    editorFormat?.lineHeight || 1.16,
  ]);

  useEffect(() => {
    setLineHeight([Number(activeElement.format?.lineHeight) || 0]);
  }, [activeElement.format]);

  function handleLineHeightFocusOut(text) {
    if (
      text.match(SLIDER_VALUE_REGEX) &&
      checkInputboxValueRangeForSlider(text, DOMAIN_1_TO_5)
    ) {
      props.canvasRef.handler.textHandler.textLineHeight(text, "push");
    } else {
      setLineHeight([text]);
    }
  }

  function onLineHeightChange(selectedOption) {
    if (
      lineHeight[0] === Number(Number(selectedOption).toFixed(1)) ||
      lineHeight[0] === Number(Number(selectedOption[0]).toFixed(1))
    )
      return;

    if (typeof selectedOption === "object") {
      props.canvasRef.handler.textHandler.textLineHeight(
        selectedOption[0],
        "push"
      );
    } else if (typeof selectedOption === "string") {
      handleLineHeightFocusOut(selectedOption);
    }
  }

  function onLineHeightUpdate(selectedOption) {
    if (typeof selectedOption === "object") {
      props.canvasRef.handler.textHandler.textLineHeight(
        selectedOption[0],
        "commit"
      );
    } else if (typeof selectedOption === "string") {
    }
  }

  return (
    <TldrSlider
      hideIndicator={true}
      onChange={onLineHeightChange}
      onUpdate={(value) => {
        if (
          lineHeight[0] === Number(Number(value).toFixed(1)) ||
          lineHeight[0] === Number(Number(value[0]).toFixed(1))
        )
          return;
        onLineHeightUpdate(value);
      }}
      step={0.1}
      domain={[0.1, 5]}
      values={lineHeight}
      title="Line Height"
      maxLength={4}
      handleFocus={(value) => {
        if (
          lineHeight[0] === Number(Number(value).toFixed(1)) ||
          lineHeight[0] === Number(Number(value[0]).toFixed(1))
        )
          return;
        onLineHeightChange(value);
      }}
      handleFocusOut={onLineHeightChange}
      showInputbox={true}
      showDecimals={true}
    />
  );
};

const mapStateToProps = (state) => ({
  activeElement: state.editor.activeElement,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TLDRLineHeight);
