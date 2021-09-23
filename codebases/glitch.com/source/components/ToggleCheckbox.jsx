import React from 'react';
import whenKeyIsEnter from '../utils/whenKeyIsEnter';

export default function ToggleCheckbox({ value, onChange, children, ...props }) {
  return (
    // This rule doesn't account for input elements being inside label elements, which associates the two without the
    // need for `htmlFor` on the label and `id` on the input.
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label {...props}>
      <div role="button" aria-pressed={value} tabIndex="0" onKeyDown={whenKeyIsEnter(onChange)} className="button button-small button-secondary">
        <input className="input" type="checkbox" checked={value} onChange={onChange} tabIndex="-1" />
        {children}
      </div>
    </label>
  );
}
