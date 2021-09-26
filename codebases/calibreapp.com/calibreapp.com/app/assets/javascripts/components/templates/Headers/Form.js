import React, { Suspense, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import Button from '../../Button'
import { Flex, Box } from '../../Grid'
import { FieldSet, FieldGroup, Input } from '../../Forms'

const FeedbackBlock = React.lazy(() => import('../../FeedbackBlock'))

const Form = ({
  loading,
  onSave,
  onCancel,
  name: initialName,
  value: initialValue,
  parentHeaders
}) => {
  const [modified, setModified] = useState(false)
  const [attributes, setAttributes] = useState({
    name: initialName,
    value: initialValue
  })

  const { name, value } = attributes

  useEffect(() => {
    setAttributes({ name: initialName, value: initialValue })
  }, [loading, initialName, initialValue])

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
        <FieldGroup labelid="site.settings.profiles.headers.name.label">
          <Input
            data-testid="header-name"
            name="header_name"
            defaultValue={name}
            required={true}
            maxLength={120}
            onChange={name => setAttribute({ name })}
          />
        </FieldGroup>
        <FieldGroup labelid="site.settings.profiles.headers.value.label">
          <Input
            data-testid="header-value"
            name="header_value"
            defaultValue={value}
            required={true}
            onChange={value => setAttribute({ value })}
          />
        </FieldGroup>
      </FieldSet>

      {(parentHeaders || []).find(parent => parent.name === name) ? (
        <Suspense fallback={<div />}>
          <FeedbackBlock type="warning" data-testid="header-feedback" mb={4}>
            <FormattedMessage
              id="site.settings.profiles.headers.parentMatch.text"
              values={{
                name,
                link: (
                  <a
                    href="/docs/get-started/authentication#test-profiles-cookies-and-custom-headers"
                    target="_blank"
                  >
                    <FormattedMessage
                      id={`site.settings.profiles.headers.parentMatch.link`}
                    />
                  </a>
                )
              }}
            />
          </FeedbackBlock>
        </Suspense>
      ) : null}

      <Flex mb={4}>
        <Box order={2}>
          <Button
            data-testid="header-submit"
            disabled={!modified || loading || !name || !value}
            onClick={handleSave}
          >
            <FormattedMessage id="site.settings.profiles.headers.actions.save" />
          </Button>
        </Box>
        <Box mr={2} order={1}>
          <Button
            type="button"
            data-testid="header-cancel"
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

export default Form
