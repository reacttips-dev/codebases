import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import Button from '../../Button'
import { Flex, Box } from '../../Grid'
import { FieldSet, FieldGroup, Display } from '../../Forms'
import { Text, TruncatedText } from '../../Type'

import Form from './Form'

const Cookie = ({
  name,
  value,
  domain,
  path,
  secure,
  httpOnly,
  onSave,
  onDelete,
  parentCookies,
  ...props
}) => {
  const [editing, setEditing] = useState(false)

  const handleSave = cookie => {
    setEditing(false)
    onSave(cookie)
  }

  if (editing) {
    return (
      <Form
        onSave={handleSave}
        name={name}
        value={value}
        domain={domain}
        path={path}
        secure={secure}
        httpOnly={httpOnly}
        onCancel={() => setEditing(false)}
        parentCookies={parentCookies}
      />
    )
  }

  return (
    <Box mb="15px" {...props}>
      <FieldSet mb={0} alignItems="center">
        <FieldGroup labelid="site.settings.profiles.cookies.name.label" mb={4}>
          <Display>
            <TruncatedText data-testid="cookie-display-name">
              {name}
            </TruncatedText>
          </Display>
        </FieldGroup>

        <FieldGroup labelid="site.settings.profiles.cookies.path.label" mb={4}>
          <Display>
            <Text data-testid="cookie-display-path">{path}</Text>
          </Display>
        </FieldGroup>

        <FieldGroup>
          <Flex>
            <Box ml={'auto'} mr={2}>
              <Button type="button" variant="danger" onClick={onDelete}>
                <FormattedMessage id="site.settings.actions.delete" />
              </Button>
            </Box>
            <Box>
              <Button
                data-testid="cookie-edit"
                variant="tertiary"
                onClick={() => setEditing(true)}
                type="button"
              >
                <FormattedMessage id="site.settings.actions.edit" />
              </Button>
            </Box>
          </Flex>
        </FieldGroup>
      </FieldSet>

      <FieldSet mb={0}>
        <FieldGroup
          labelid="site.settings.profiles.cookies.domain.label"
          mb={4}
        >
          <Display>
            <TruncatedText data-testid="cookie-display-domain">
              {domain}
            </TruncatedText>
          </Display>
        </FieldGroup>

        <FieldGroup
          labelid="site.settings.profiles.cookies.secure.label"
          mb={4}
        >
          <Display>
            <Text data-testid="cookie-display-secure">
              {secure ? 'Yes' : 'No'}
            </Text>
          </Display>
        </FieldGroup>
      </FieldSet>

      <FieldSet mb="5px">
        <FieldGroup labelid="site.settings.profiles.cookies.value.label" mb={4}>
          <Display>
            <TruncatedText data-testid="cookie-display-value">
              {value}
            </TruncatedText>
          </Display>
        </FieldGroup>

        <FieldGroup
          labelid="site.settings.profiles.cookies.httpOnly.label"
          mb={4}
        >
          <Display>
            <Text data-testid="cookie-display-httpOnly">
              {httpOnly ? 'Yes' : 'No'}
            </Text>
          </Display>
        </FieldGroup>
      </FieldSet>
    </Box>
  )
}

export default Cookie
