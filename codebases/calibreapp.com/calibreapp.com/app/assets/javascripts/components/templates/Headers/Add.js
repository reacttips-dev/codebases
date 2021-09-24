import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import Button from '../../Button'
import { Box } from '../../Grid'

import Form from './Form'

export const AddHeader = ({ variant, onSave, parentHeaders, ...props }) => {
  const [editing, setEditing] = useState(false)

  const handleSave = header => {
    setEditing(false)
    onSave(header)
  }

  if (editing) {
    return (
      <Form
        parentHeaders={parentHeaders}
        onSave={handleSave}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <Box {...props}>
      <Button
        data-testid="header-add"
        variant={variant}
        type="button"
        onClick={() => setEditing(true)}
      >
        <FormattedMessage id="site.settings.profiles.headers.actions.add" />
      </Button>
    </Box>
  )
}

export default AddHeader
