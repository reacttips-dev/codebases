import React from "react";
import { Field, ErrorMessage } from "formik";
import TldrTagsInput from "./TldrTagsInput";

function EmailTagsInput({ field, form, className, ...props }) {
  const applyTags = (emails) => {
    emails = emails.map((email) => email.trim());
    props.getEmails(emails);
    form.resetForm();
  };

  return (
    <TldrTagsInput
      as="textarea"
      tagKey="space"
      {...field}
      {...props}
      applyTags={(emails) => applyTags(emails)}
    />
  );
}

function TldrTagsTextArea(props) {
  const { label, name, ...rest } = props;

  return (
    <div className="input-group">
      <Field
        component={EmailTagsInput}
        id={name}
        name={name}
        {...rest}
        className="teamfield"
      />
      <ErrorMessage name={name} component="div" className="error" />
    </div>
  );
}

export default TldrTagsTextArea;
