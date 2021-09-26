import React from 'react'
import { FormattedMessage } from 'react-intl'

import Row from './Row'
import Col from './Col'
import { Box } from '../Grid'
import { Heading, Text, TextLink } from '../Type'

const Lockup = ({ id, span, link, mb, values, children, ...props }) => (
  <Row {...props}>
    <Col span={span}>
      <FormattedMessage id={`${id}.title`} defaultMessage="null">
        {title =>
          title[0] === 'null' ? null : (
            <Box mb={mb}>
              <Heading as="h2" level="sm">
                {title}
              </Heading>
            </Box>
          )
        }
      </FormattedMessage>
      <FormattedMessage
        id={`${id}.description`}
        defaultMessage="null"
        values={{
          ...values,
          link: link ? (
            <TextLink href={link} target="_blank">
              <FormattedMessage id={`${id}.link`} />
            </TextLink>
          ) : null
        }}
      >
        {chunks =>
          chunks[0] === 'null' ? null : (
            <Box mt={2} mb={mb}>
              <Text>
                {chunks.map((chunk, index) => (
                  <React.Fragment key={index}>{chunk}</React.Fragment>
                ))}
              </Text>
            </Box>
          )
        }
      </FormattedMessage>
      {children}
    </Col>
  </Row>
)

Lockup.defaultProps = {
  span: 2,
  mb: 2
}

export default Lockup
