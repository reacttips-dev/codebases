import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Section, Block, Lockup } from '../../../Layout'
import { LoadingButton } from '../../../Loading'
import Button from '../../../Button'

const Delete = ({ name, onDelete, loading, saving }) => {
  return (
    <Section>
      <Lockup
        id="organisations.delete"
        link="/docs/account-and-billing/cancel-account"
      />

      <Block>
        {loading ? (
          <LoadingButton />
        ) : (
          <FormattedMessage id="organisations.delete.prompt" values={{ name }}>
            {message => (
              <Button
                variant="danger"
                disabled={saving}
                onClick={() => {
                  const response = prompt(message)
                  if (response === name) {
                    onDelete()
                  }
                }}
                loading={saving}
              >
                <FormattedMessage id="organisations.actions.delete" />
              </Button>
            )}
          </FormattedMessage>
        )}
      </Block>
    </Section>
  )
}

export default Delete
