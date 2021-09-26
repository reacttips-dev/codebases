import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Flex, Box } from '../../../../Grid'
import { Header, Section, Lockup } from '../../../../Layout'
import { LoadingLine } from '../../../../Loading'
import Button from '../../../../Button'

import Form from './Form'
import Display from './Display'

const Authentication = ({
  loading,
  saving,
  onUpdate,
  onDelete,
  onEdit,
  onCancel,
  editing,
  ...attributes
}) => {
  const confirmText = 'DELETE'

  return (
    <>
      <Header>
        <Lockup
          id="site.settings.authentication"
          link="/docs/get-started/authentication"
        />
        <Lockup id="site.settings.authentication.form" />
      </Header>
      <Section>
        {loading ? (
          <LoadingLine />
        ) : editing ? (
          <Form
            saving={saving}
            onUpdate={onUpdate}
            onCancel={onCancel}
            {...attributes}
          />
        ) : (
          <>
            <Display {...attributes} />
            <Flex>
              <Box mr={2}>
                <FormattedMessage
                  id="site.settings.authentication.delete.prompt"
                  values={{ confirmText }}
                >
                  {message => (
                    <Button
                      variant="danger"
                      onClick={() => {
                        const response = prompt(message)
                        if (response === confirmText) {
                          onDelete()
                        }
                      }}
                    >
                      <FormattedMessage id="site.settings.authentication.actions.delete" />
                    </Button>
                  )}
                </FormattedMessage>
              </Box>
              <Box>
                <Button variant="tertiary" onClick={onEdit}>
                  <FormattedMessage id="site.settings.authentication.actions.edit" />
                </Button>
              </Box>
            </Flex>
          </>
        )}
      </Section>
    </>
  )
}

export default Authentication
