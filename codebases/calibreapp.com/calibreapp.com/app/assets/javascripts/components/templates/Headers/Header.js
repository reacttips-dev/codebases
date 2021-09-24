import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import Button from '../../Button'
import { Flex, Box } from '../../Grid'
import { FieldSet, FieldGroup, Display } from '../../Forms'
import { TruncatedText } from '../../Type'

import Form from './Form'

const Header = ({ name, value, onSave, parentHeaders, onDelete, ...props }) => {
  const [editing, setEditing] = useState(false)

  const handleSave = header => {
    setEditing(false)
    onSave(header)
  }

  if (editing) {
    return (
      <Form
        onSave={handleSave}
        parentHeaders={parentHeaders}
        name={name}
        value={value}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <FieldSet mb="15px" {...props} alignItems="center">
      <FieldGroup labelid="site.settings.profiles.headers.name.label" mb="15px">
        <Display>
          <TruncatedText data-testid="header-display-name">
            {name}
          </TruncatedText>
        </Display>
      </FieldGroup>

      <FieldGroup
        labelid="site.settings.profiles.headers.value.label"
        mb="15px"
      >
        <Display>
          <TruncatedText data-testid="header-display-value">
            {value}
          </TruncatedText>
        </Display>
      </FieldGroup>

      <FieldGroup mb={0}>
        <Flex>
          <Box ml={'auto'} mr={2}>
            <Button type="button" variant="danger" onClick={onDelete}>
              <FormattedMessage id="site.settings.actions.delete" />
            </Button>
          </Box>
          <Box>
            <Button
              type="button"
              data-testid="header-edit"
              variant="tertiary"
              onClick={() => setEditing(true)}
            >
              <FormattedMessage id="site.settings.actions.edit" />
            </Button>
          </Box>
        </Flex>
      </FieldGroup>
    </FieldSet>
  )
}

export default Header
