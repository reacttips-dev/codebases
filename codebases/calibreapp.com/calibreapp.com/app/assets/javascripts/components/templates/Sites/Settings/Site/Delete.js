import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Section, Lockup } from '../../../../Layout'
import { LoadingButton } from '../../../../Loading'
import Button from '../../../../Button'

const Delete = ({ name, onDelete, loading, saving }) => (
  <Section>
    <Lockup id="site.settings.general.delete" mb={0} />

    {loading ? (
      <LoadingButton />
    ) : (
      <FormattedMessage
        id="site.settings.general.delete.prompt"
        values={{ name }}
      >
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
            <FormattedMessage id="site.actions.delete" values={{ name }} />
          </Button>
        )}
      </FormattedMessage>
    )}
  </Section>
)

export default Delete
