import React, { useEffect, useState } from "react";
import { faItalic } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { TldrEditorAction } from "../../../common/statelessView";
import { comboKey1 } from "../../constants";

const TLDRItalic = (props) => {
  const { activeElement } = props;

  const [isItalic, setIsItalic] = useState(
    activeElement.format?.fontStyle === "italic"
  );

  useEffect(() => {
    setIsItalic(activeElement.format?.fontStyle === "italic");
  }, [activeElement.format]);

  function onItalicClick(action, value) {
    const { activeElement, canvasRef } = props;

    const { fontStyle: currentFontStyle } = activeElement.format;

    const fontStyle = currentFontStyle === "italic" ? "normal" : "italic";

    canvasRef.handler.textHandler.italic(fontStyle);
  }

  return (
    <TldrEditorAction
      action={"italic"}
      icon={faItalic}
      title={"Italic"}
      showHover={true}
      callback={onItalicClick}
      active={isItalic}
      shortcutKeys={[comboKey1, "I"]}
    />
  );
};

const mapStateToProps = (state) => ({
  activeElement: state.editor.activeElement,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TLDRItalic);
