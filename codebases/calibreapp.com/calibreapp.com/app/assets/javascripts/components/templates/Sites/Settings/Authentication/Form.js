import React, { useEffect, useState, useRef } from 'react'
import { FormattedMessage } from 'react-intl'

import { FieldSet, FieldGroup, Input } from '../../../../Forms'
import { Flex, Box } from '../../../../Grid'
import Button from '../../../../Button'
import FeedbackBlock from '../../../../FeedbackBlock'
import { Strong } from '../../../../Type'

const Form = ({
  loading,
  saving,
  onUpdate,
  onCancel,
  ...initialAttributes
}) => {
  const formRef = useRef()
  const [modified, setModified] = useState(false)
  const [attributes, setAttributes] = useState(initialAttributes)

  useEffect(() => {
    setAttributes(initialAttributes)
  }, [loading])

  useEffect(() => {
    setModified(saving)
  }, [saving])

  const handleSubmit = event => {
    event.preventDefault()
    onUpdate(attributes)
  }

  const setAttribute = attribute => {
    const updatedAttributes = { ...attributes, ...attribute }
    setAttributes(updatedAttributes)
    setModified(true)
  }

  const {
    url,
    formSelector,
    username,
    usernameSelector,
    password,
    passwordSelector,
    buttonSelector
  } = attributes

  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      <FieldSet mb={0}>
        <FieldGroup
          span={2}
          labelid="site.settings.authentication.url.label"
          helpid="site.settings.authentication.url.help"
        >
          <Input
            data-testid="authentication-settings-url"
            name="url"
            type="url"
            loading={loading}
            defaultValue={url}
            onChange={url => setAttribute({ url })}
            maxLength={255}
            required={true}
          />
        </FieldGroup>
      </FieldSet>

      <FieldSet mb={0}>
        <FieldGroup labelid="site.settings.authentication.username.label">
          <Input
            data-testid="authentication-settings-username"
            name="username"
            loading={loading}
            defaultValue={username}
            onChange={username => setAttribute({ username })}
            maxLength={255}
          />
        </FieldGroup>
        <FieldGroup labelid="site.settings.authentication.password.label">
          <Input
            data-testid="authentication-settings-password"
            name="password"
            type="password"
            loading={loading}
            defaultValue={password}
            onChange={password => setAttribute({ password })}
            maxLength={255}
            required={true}
          />
        </FieldGroup>
      </FieldSet>

      <FieldSet mb={0}>
        <FieldGroup
          label="Form selector"
          labelid="site.settings.authentication.formSelector.label"
          helpid="site.settings.authentication.formSelector.help"
        >
          <Input
            data-testid="authentication-settings-form-selector"
            name="form-selector"
            loading={loading}
            placeholder="#sign-in"
            defaultValue={formSelector}
            onChange={formSelector => setAttribute({ formSelector })}
            maxLength={255}
            required={true}
          />
        </FieldGroup>

        <FieldGroup
          labelid="site.settings.authentication.buttonSelector.label"
          helpid="site.settings.authentication.buttonSelector.help"
        >
          <Input
            data-testid="authentication-settings-button-selector"
            name="button-selector"
            loading={loading}
            placeholder={`input[type="submit"]`}
            defaultValue={buttonSelector}
            onChange={buttonSelector => setAttribute({ buttonSelector })}
            maxLength={255}
          />
        </FieldGroup>
      </FieldSet>

      <FieldSet mb={0}>
        <FieldGroup labelid="site.settings.authentication.usernameSelector.label">
          <Input
            data-testid="authentication-settings-username-selector"
            name="username-selector"
            loading={loading}
            placeholder={`input[name="username"]`}
            defaultValue={usernameSelector}
            onChange={usernameSelector => setAttribute({ usernameSelector })}
            maxLength={255}
          />
        </FieldGroup>
        <FieldGroup labelid="site.settings.authentication.passwordSelector.label">
          <Input
            data-testid="authentication-settings-password-selector"
            name="password-selector"
            loading={loading}
            placeholder={`input[name="password"]`}
            defaultValue={passwordSelector}
            onChange={passwordSelector => setAttribute({ passwordSelector })}
            maxLength={255}
            required={true}
          />
        </FieldGroup>
      </FieldSet>

      <FieldSet mb={0}>
        <FieldGroup span={2}>
          <FeedbackBlock type="warning">
            <Strong color="yellow500">
              Credentials will be stored in clear text.
            </Strong>{' '}
            We recommend creating a special test account for Calibre.
          </FeedbackBlock>
        </FieldGroup>
      </FieldSet>

      <Flex>
        <Box order={2}>
          <Button
            data-testid="authentication-settings-submit"
            disabled={!modified || saving}
            loading={saving}
            type="submit"
          >
            <FormattedMessage id="site.actions.update_authentication" />
          </Button>
        </Box>
        {onCancel ? (
          <Box mr={2} order={1}>
            <Button
              data-testid="authentication-settings-cancel"
              onClick={onCancel}
              variant="tertiary"
            >
              <FormattedMessage id="site.actions.cancel" />
            </Button>
          </Box>
        ) : null}
      </Flex>
    </form>
  )
}

export default Form
