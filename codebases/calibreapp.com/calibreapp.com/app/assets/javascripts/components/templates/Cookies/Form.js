import React, { Suspense, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import Button from '../../Button'
import { Flex, Box } from '../../Grid'
import { FieldSet, FieldGroup, Input, TextArea, Checkbox } from '../../Forms'

const FeedbackBlock = React.lazy(() => import('../../FeedbackBlock'))

const Form = ({
  loading,
  onSave,
  onCancel,
  name: initialName,
  path: initialPath,
  domain: initialDomain,
  secure: initialSecure,
  value: initialValue,
  httpOnly: initialHttpOnly,
  parentCookies
}) => {
  const [modified, setModified] = useState(false)
  const [attributes, setAttributes] = useState({
    name: initialName,
    path: initialPath,
    domain: initialDomain,
    secure: initialSecure,
    value: initialValue,
    httpOnly: initialHttpOnly
  })

  const {
    name,
    path,
    domain,
    secure = true,
    value,
    httpOnly = false
  } = attributes

  useEffect(() => {
    setAttributes({
      name: initialName,
      path: initialPath,
      domain: initialDomain,
      secure: initialSecure,
      value: initialValue,
      httpOnly: initialHttpOnly
    })
  }, [loading])

  const setAttribute = attribute => {
    const updatedAttributes = { ...attributes, ...attribute }
    setAttributes(updatedAttributes)
    setModified(true)
  }

  const handleSave = () => {
    onSave(attributes)
  }

  return (
    <>
      <FieldSet mb={0}>
        <FieldGroup labelid="site.settings.profiles.cookies.name.label">
          <Input
            data-testid="cookie-name"
            name="cookie_name"
            defaultValue={name}
            required={true}
            maxLength={120}
            onChange={name => setAttribute({ name })}
            placeholder="app.sid"
          />
        </FieldGroup>
        <FieldGroup labelid="site.settings.profiles.cookies.domain.label">
          <Input
            data-testid="cookie-domain"
            name="cookie_domain"
            defaultValue={domain}
            required={true}
            maxLength={120}
            onChange={domain => setAttribute({ domain })}
            placeholder="google.com"
          />
        </FieldGroup>
      </FieldSet>

      <FieldSet mb={0}>
        <FieldGroup labelid="site.settings.profiles.cookies.value.label">
          <TextArea
            data-testid="cookie-value"
            name="cookie_value"
            defaultValue={value}
            required={true}
            onChange={value => setAttribute({ value: value?.trim() })}
            placeholder="4583490924e9834082d09a8s8932040923482eda"
            height={150}
          />
        </FieldGroup>
        <Box>
          <FieldGroup labelid="site.settings.profiles.cookies.path.label">
            <Input
              data-testid="cookie-path"
              name="cookie_path"
              defaultValue={path}
              required={true}
              maxLength={120}
              onChange={path => setAttribute({ path })}
              placeholder="e.g. /"
            />
          </FieldGroup>
          <FieldGroup mb="15px">
            <Checkbox
              data-testid="cookie-secure"
              name="cookie_secure"
              id="cookie_secure"
              checked={secure}
              onChange={() =>
                setAttribute({
                  secure: !secure
                })
              }
            >
              <FormattedMessage id="site.settings.profiles.cookies.secure.label" />
            </Checkbox>
          </FieldGroup>
          <FieldGroup>
            <Checkbox
              data-testid="cookie-httpOnly"
              name="cookie_httpOnly"
              id="cookie_httpOnly"
              checked={httpOnly}
              onChange={() =>
                setAttribute({
                  httpOnly: !httpOnly
                })
              }
            >
              <FormattedMessage id="site.settings.profiles.cookies.httpOnly.label" />
            </Checkbox>
          </FieldGroup>
        </Box>
      </FieldSet>

      <FieldSet mb={0}></FieldSet>

      {(parentCookies || []).find(
        parent =>
          parent.name === name &&
          parent.path === path &&
          parent.domain === domain
      ) ? (
        <Suspense fallback={<div />}>
          <FeedbackBlock type="warning" data-testid="cookie-feedback" mb={4}>
            <FormattedMessage
              id="site.settings.profiles.cookies.parentMatch.text"
              values={{
                name,
                link: (
                  <a
                    href="/docs/get-started/authentication#test-profiles-cookies-and-custom-cookies"
                    target="_blank"
                  >
                    <FormattedMessage
                      id={`site.settings.profiles.cookies.parentMatch.link`}
                    />
                  </a>
                )
              }}
            />
          </FeedbackBlock>
        </Suspense>
      ) : null}

      <Flex>
        <Box order={2}>
          <Button
            data-testid="cookie-submit"
            disabled={
              !modified || loading || !name || !value || !domain || !path
            }
            onClick={handleSave}
          >
            <FormattedMessage id="site.settings.profiles.cookies.actions.save" />
          </Button>
        </Box>
        <Box mr={2} order={1}>
          <Button
            type="button"
            data-testid="cookie-cancel"
            onClick={onCancel}
            variant="tertiary"
          >
            <FormattedMessage id="site.actions.cancel" />
          </Button>
        </Box>
      </Flex>
    </>
  )
}

Form.defaultProps = {
  path: '/'
}

export default Form
