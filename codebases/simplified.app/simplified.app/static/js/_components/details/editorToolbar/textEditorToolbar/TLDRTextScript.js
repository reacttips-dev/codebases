import { faSubscript, faSuperscript } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { TldrEditorAction } from "../../../common/statelessView";
import { FABRIC_TEXT_TYPES } from "../../constants";

const TLDRTextScript = (props) => {
  const { canvasRef, activeElement } = props;
  const { deltaY: textDeltaY, script: textScript } = activeElement.format;

  const activeObj = canvasRef.handler.canvas.getActiveObject();

  const [script, setScript] = useState(textScript);
  const [deltaY, setDeltaY] = useState(textDeltaY);

  useEffect(() => {
    const { deltaY, script } = activeElement.format;

    setScript(script);
    setDeltaY(deltaY);
  }, [activeElement.format]);

  function onScriptClick(scriptType) {
    const { canvasRef, activeElement } = props;

    const style = canvasRef.handler.textHandler.getStyle(activeElement.format);

    let appliedScript =
      style?.deltaY > 0 ? "sub" : style?.deltaY < 0 ? "super" : undefined;

    canvasRef.handler.textHandler.script(
      scriptType,
      !appliedScript ? "apply" : "remove"
    );
  }

  function callback(action, value) {
    switch (action) {
      case "subscript":
        onScriptClick("sub");
        break;
      case "superscript":
        onScriptClick("super");
        break;
      default:
        return;
    }
  }

  return (
    <>
      <TldrEditorAction
        action={"subscript"}
        icon={faSubscript}
        title={"Subscript"}
        callback={callback}
        showHover={true}
        active={deltaY ? deltaY > 0 : script === "sub"}
        disabled={
          FABRIC_TEXT_TYPES.includes(activeObj?.type) &&
          activeObj?.getSelectedText().length === 0
        }
      />
      <TldrEditorAction
        action={"superscript"}
        icon={faSuperscript}
        title={"Superscript"}
        callback={callback}
        showHover={true}
        active={deltaY ? deltaY < 0 : script === "super"}
        disabled={
          FABRIC_TEXT_TYPES.includes(activeObj?.type) &&
          activeObj?.getSelectedText().length === 0
        }
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  activeElement: state.editor.activeElement,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TLDRTextScript);
