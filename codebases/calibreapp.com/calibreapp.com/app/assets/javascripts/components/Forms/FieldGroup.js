import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Box } from '../Grid'
import { Col } from '../Layout'
import { Text } from '../Type'
import Label from './Label'
import FieldHelp from './FieldHelp'
import FieldHint from './FieldHint'

const FieldGroup = ({
  label,
  labelid,
  children,
  help,
  helpid,
  hint,
  hintid,
  error,
  ...props
}) => (
  <Col {...props}>
    {label || labelid ? (
      <>
        <Label>
          {labelid ? <FormattedMessage id={labelid} /> : label}
          {!(helpid || help) || (
            <>
              {' '}
              <FieldHelp>
                {helpid ? <FormattedMessage id={helpid} /> : help}
              </FieldHelp>
            </>
          )}
          <Box pt={hintid || hint ? 1 : 2} fontWeight="normal">
            {!(hintid || hint) || (
              <FieldHint mb={2}>
                {hintid ? <FormattedMessage id={hintid} /> : hint}
              </FieldHint>
            )}
            {children}
          </Box>
        </Label>
      </>
    ) : (
      children
    )}
    {error && (
      <Box mt={2}>
        <Text color="red300">{error}</Text>
      </Box>
    )}
  </Col>
)

export default FieldGroup
