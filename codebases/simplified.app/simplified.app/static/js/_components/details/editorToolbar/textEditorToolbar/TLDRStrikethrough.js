import React, { useEffect, useState } from "react";
import { faStrikethrough } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { TldrEditorAction } from "../../../common/statelessView";
import { comboKey1 } from "../../constants";

const TLDRStrikethrough = (props) => {
  const { activeElement } = props;

  const [isStrikethrough, setIsStrikethrough] = useState(
    activeElement.format?.linethrough
  );

  useEffect(() => {
    setIsStrikethrough(activeElement.format?.linethrough);
  }, [activeElement.format]);

  function onStrikethroughClick(action, value) {
    const { canvasRef, activeElement } = props;
    const { linethrough: currentLinethrough } = activeElement.format;
    canvasRef.handler.textHandler.strike(!currentLinethrough);
  }

  return (
    <TldrEditorAction
      action={"strikethrough"}
      icon={faStrikethrough}
      title={"Strikethrough"}
      showHover={true}
      callback={onStrikethroughClick}
      active={isStrikethrough}
      shortcutKeys={[comboKey1, "Shift", "X"]}
    />
  );
};

const mapStateToProps = (state) => ({
  activeElement: state.editor.activeElement,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TLDRStrikethrough);
