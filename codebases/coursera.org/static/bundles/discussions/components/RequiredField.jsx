// @ flow

import React from 'react';
import 'css!./__styles__/RequiredField';
import 'css!bundles/discussions/components/__styles__/NewThreadButton';

const RequiredField = ({ fieldName }) => (
  <label className="c-form-label-area" htmlFor="forum-selector">
    <h2 className="c-form-label headline-1-text">
      <div className="rc-RequiredField">
        {fieldName}
        <span className="required-indicator" aria-hidden="true">
          {' '}
          *
        </span>
      </div>
    </h2>
  </label>
);

export default RequiredField;
