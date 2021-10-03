import {
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { TldrEditorAction } from "../../../common/statelessView";

const TLDRTextAlign = (props) => {
  const { canvasRef, activeElement } = props;

  const editorFormat = canvasRef?.handler.textHandler.getStyle(
    activeElement.format
  );

  const [textAlign, setTextAlign] = useState(editorFormat?.textAlign);

  useEffect(() => {
    setTextAlign(activeElement?.format?.textAlign);
  }, [activeElement.format, canvasRef]);

  function onTextAlignButtonClick(alignValue) {
    props.canvasRef.handler.textHandler.textAlign(alignValue);
  }

  function callback(action, value) {
    switch (action) {
      case "left-align":
        onTextAlignButtonClick("left");
        break;
      case "center-align":
        onTextAlignButtonClick("center");
        break;
      case "right-align":
        onTextAlignButtonClick("right");
        break;
      default:
        return;
    }
  }

  return (
    <>
      <TldrEditorAction
        action={"left-align"}
        icon={faAlignLeft}
        title={"Left align"}
        showHover={true}
        callback={callback}
        active={textAlign === ""}
      />

      <TldrEditorAction
        action={"center-align"}
        icon={faAlignCenter}
        title={"Center align"}
        showHover={true}
        callback={callback}
        active={textAlign === "center"}
      />

      <TldrEditorAction
        action={"right-align"}
        icon={faAlignRight}
        title={"Right align"}
        showHover={true}
        callback={callback}
        active={textAlign === "right"}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  activeElement: state.editor.activeElement,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TLDRTextAlign);
