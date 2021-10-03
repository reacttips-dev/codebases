import { faUnderline } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { TldrEditorAction } from "../../../common/statelessView";
import { comboKey1 } from "../../constants";

const TLDRUnderline = (props) => {
  const { activeElement } = props;

  const [isUnderline, setIsUnderline] = useState(
    activeElement.format?.underline
  );

  useEffect(() => {
    setIsUnderline(activeElement.format?.underline);
  }, [activeElement.format]);

  function onUnderlineClick(action, value) {
    const { canvasRef, activeElement } = props;
    const { underline: currentUnderline } = activeElement.format;
    canvasRef.handler.textHandler.underline(!currentUnderline);
  }

  return (
    <TldrEditorAction
      action={"underline"}
      icon={faUnderline}
      title={"Underline"}
      showHover={true}
      callback={onUnderlineClick}
      active={isUnderline}
      shortcutKeys={[comboKey1, "U"]}
    />
  );
};

const mapStateToProps = (state) => ({
  activeElement: state.editor.activeElement,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TLDRUnderline);
