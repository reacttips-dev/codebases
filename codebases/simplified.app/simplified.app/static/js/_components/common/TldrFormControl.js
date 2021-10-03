import React from "react";
import TldrTagsTextArea from "./TldrTagsTextArea";
import TldrTextArea from "./TldrTextArea";

function TldrFormControl(props) {
  const { control, ...rest } = props;
  switch (control) {
    case "textarea":
      return <TldrTextArea {...rest} />;
    case "tags-textarea":
      return <TldrTagsTextArea {...rest} />;
    default:
      return null;
  }
}

export default TldrFormControl;
