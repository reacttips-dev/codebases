import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import Button from '../../Button'
import { Box } from '../../Grid'

import Form from './Form'

const AddCookie = ({ variant, parentCookies, onSave, ...props }) => {
  const [editing, setEditing] = useState(false)

  const handleSave = cookie => {
    setEditing(false)
    onSave(cookie)
  }

  if (editing) {
    return <Form onSave={handleSave} onCancel={() => setEditing(false)} />
  }

  return (
    <Box {...props}>
      <Button
        data-testid="cookie-add"
        variant={variant}
        type="button"
        onClick={() => setEditing(true)}
      >
        <FormattedMessage
          id="site.settings.profiles.cookies.actions.add"
          parentCookies={parentCookies}
        />
      </Button>
    </Box>
  )
}

export default AddCookie
