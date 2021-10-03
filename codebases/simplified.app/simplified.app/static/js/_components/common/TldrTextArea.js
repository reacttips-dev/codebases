import React from "react";
import { Field, ErrorMessage } from "formik";

function TldrTextArea(props) {
  const { label, name, ...rest } = props;
  return (
    <div className="input-group">
      <Field
        as="textarea"
        id={name}
        name={name}
        {...rest}
        className="teamfield"
      />
      <ErrorMessage name={name} component="div" className="error" />
    </div>
  );
}

export default TldrTextArea;
