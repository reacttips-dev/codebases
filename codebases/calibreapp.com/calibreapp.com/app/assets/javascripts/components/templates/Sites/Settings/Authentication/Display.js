import React from 'react'

import { FieldSet, FieldGroup } from '../../../../Forms'
import { TruncatedText } from '../../../../Type'

const Display = ({
  url,
  username,
  password,
  formSelector,
  buttonSelector,
  usernameSelector,
  passwordSelector
}) => {
  return (
    <>
      <FieldSet mb={0}>
        <FieldGroup
          span={2}
          data-testid="authentication-settings-url"
          labelid="site.settings.authentication.url.label"
        >
          <TruncatedText>{url}</TruncatedText>
        </FieldGroup>
      </FieldSet>

      <FieldSet mb={0}>
        <FieldGroup
          data-testid="authentication-settings-username"
          labelid="site.settings.authentication.username.label"
        >
          <TruncatedText>{username ? username : 'Not set'}</TruncatedText>
        </FieldGroup>

        <FieldGroup
          data-testid="authentication-settings-password"
          labelid="site.settings.authentication.password.label"
        >
          <TruncatedText>
            {Array(password ? password.length : 0)
              .fill('•')
              .join('')}
          </TruncatedText>
        </FieldGroup>
      </FieldSet>

      <FieldSet mb={0}>
        <FieldGroup
          data-testid="authentication-settings-form-selector"
          labelid="site.settings.authentication.formSelector.label"
        >
          <TruncatedText>{formSelector}</TruncatedText>
        </FieldGroup>

        <FieldGroup
          data-testid="authentication-settings-button-selector"
          labelid="site.settings.authentication.buttonSelector.label"
        >
          <TruncatedText>
            {buttonSelector ? buttonSelector : 'Not set'}
          </TruncatedText>
        </FieldGroup>
      </FieldSet>

      <FieldSet mb={0}>
        <FieldGroup
          data-testid="authentication-settings-username-selector"
          labelid="site.settings.authentication.usernameSelector.label"
        >
          <TruncatedText>
            {usernameSelector ? usernameSelector : 'Not set'}
          </TruncatedText>
        </FieldGroup>
        <FieldGroup
          data-testid="authentication-settings-password-selector"
          labelid="site.settings.authentication.passwordSelector.label"
        >
          <TruncatedText>{passwordSelector}</TruncatedText>
        </FieldGroup>
      </FieldSet>
    </>
  )
}

export default Display
