'use es6';

import devLogger from 'react-utils/devLogger'; // #4597

export default function validateUIFormControlValidationMessage(props) {
  var validationMessage = props.validationMessage,
      error = props.error;

  if (validationMessage && !error) {
    devLogger.warn({
      message: 'UIFormControl: Use of `error={false}` with `validationMessage` is discouraged.',
      url: 'https://git.hubteam.com/HubSpot/UIComponents/issues/4597',
      key: 'UIFormControl: `error={false}` with `validationMessage`'
    });
  }
}