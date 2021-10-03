import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { checkInputboxValueRangeForSlider } from "../../../../_utils/common";
import { CHAR_SPACE_MULTIPLIER } from "../../../canvas/handlers/TextHandler";
import TldrSlider from "../../../common/TldrSlider";
import { DOMAIN_0_TO_100, SLIDER_VALUE_REGEX } from "../../constants";

const TLDRLineSpace = (props) => {
  const { canvasRef, activeElement } = props;

  const editorFormat = canvasRef?.handler.textHandler.getStyle(
    activeElement.format
  );

  const [letterSpace, setLetterSpace] = useState([
    editorFormat?.charSpacing / CHAR_SPACE_MULTIPLIER || 0,
  ]);

  useEffect(() => {
    setLetterSpace([
      Number(activeElement.format?.charSpacing) / CHAR_SPACE_MULTIPLIER || 0,
    ]);
  }, [activeElement.format]);

  function handleLetterSpaceFocusOut(text) {
    if (
      text.match(SLIDER_VALUE_REGEX) &&
      checkInputboxValueRangeForSlider(text, DOMAIN_0_TO_100)
    ) {
      props.canvasRef.handler.textHandler.textLetterSpace(text, "push");
    } else {
      setLetterSpace([text]);
    }
  }

  function onLetterSpaceChange(selectedOption) {
    if (
      letterSpace[0] === Number(Number(selectedOption).toFixed(1)) ||
      letterSpace[0] === Number(Number(selectedOption[0]).toFixed(1))
    )
      return;

    if (typeof selectedOption === "object") {
      props.canvasRef.handler.textHandler.textLetterSpace(
        selectedOption[0],
        "push"
      );
    } else if (typeof selectedOption === "string") {
      handleLetterSpaceFocusOut(selectedOption);
    }
  }

  function onLetterSpaceUpdate(selectedOption) {
    if (typeof selectedOption === "object") {
      props.canvasRef.handler.textHandler.textLetterSpace(
        selectedOption[0],
        "commit"
      );
    } else if (typeof selectedOption === "string") {
    }
  }

  return (
    <TldrSlider
      hideIndicator={true}
      onChange={onLetterSpaceChange}
      values={letterSpace}
      onUpdate={(value) => {
        if (
          letterSpace[0] === Number(Number(value).toFixed(1)) ||
          letterSpace[0] === Number(Number(value[0]).toFixed(1))
        )
          return;
        onLetterSpaceUpdate(value);
      }}
      title="Spacing"
      domain={DOMAIN_0_TO_100}
      maxLength={3}
      handleFocus={(value) => {
        if (
          letterSpace[0] === Number(Number(value).toFixed(1)) ||
          letterSpace[0] === Number(Number(value[0]).toFixed(1))
        )
          return;
        onLetterSpaceChange(value);
      }}
      handleFocusOut={onLetterSpaceChange}
      showDecimals={false}
      showInputbox={true}
    />
  );
};

const mapStateToProps = (state) => ({
  activeElement: state.editor.activeElement,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TLDRLineSpace);
