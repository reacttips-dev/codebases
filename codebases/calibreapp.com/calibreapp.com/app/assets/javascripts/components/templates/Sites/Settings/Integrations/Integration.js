import React from 'react'
import { useIntl, FormattedMessage } from 'react-intl'

import { Row, Col } from '../../../../Layout'
import { Flex, Box } from '../../../../Grid'
import { Text, TextLink } from '../../../../Type'
import Button from '../../../../Button'

import { CheckIcon, CrossIcon } from '../../../../Icon'

const Integration = ({
  teamId,
  siteId,
  integrations: providerIntegrations,
  provider,
  Icon,
  description,
  cta,
  actions,
  onDelete
}) => {
  const intl = useIntl()
  const confirmText = 'DELETE'

  const integrations = providerIntegrations.map(
    ({ events, ...attributes }) => ({
      eventsDescription:
        events && events.length
          ? events
              .map(event =>
                intl.formatMessage({
                  id: `site.settings.integrations.events.${event}.descriptor`
                })
              )
              .join(', ')
          : intl.formatMessage({
              id: 'site.settings.integrations.events.empty'
            }),
      events,
      ...attributes
    })
  )

  return (
    <Row>
      <Col span={2}>
        <Box
          border="1px solid"
          borderColor="grey100"
          borderTopLeftRadius="3px"
          borderTopRightRadius="3px"
          borderBottomLeftRadius={integrations.length ? 0 : '3px'}
          borderBottomRightRadius={integrations.length ? 0 : '3px'}
        >
          <Flex p={4} flexWrap={['wrap', 'nowrap']} alignItems="center">
            {Icon ? (
              <Box width={[1, 'auto']} pr={[0, 4]} textAlign="left">
                <Icon />
              </Box>
            ) : null}
            {description && description.url ? (
              <Box flex={1} my={[3, 0]}>
                <FormattedMessage
                  id={`site.settings.integrations.${provider}.link`}
                >
                  {link => (
                    <FormattedMessage
                      id={`site.settings.integrations.${provider}.description`}
                      values={{
                        link: link ? (
                          <TextLink href={description.url} target="_blank">
                            {link}
                          </TextLink>
                        ) : null
                      }}
                    >
                      {chunks => (
                        <Text>
                          {chunks.map((chunk, index) => (
                            <span key={index}>{chunk}</span>
                          ))}
                        </Text>
                      )}
                    </FormattedMessage>
                  )}
                </FormattedMessage>
              </Box>
            ) : null}
            {cta ? (
              <Box ml={[0, 4]} width={[1, 200]}>
                <Button {...cta} width={1}>
                  <FormattedMessage
                    id={`site.settings.integrations.${provider}.actions.${
                      cta.action || 'add'
                    }`}
                  />
                </Button>
              </Box>
            ) : null}
          </Flex>
        </Box>
        {integrations
          .filter(({ deleted }) => !deleted)
          .map(({ uuid, isDisabled, ...integration }, index) => (
            <Box
              key={uuid}
              p={4}
              border="1px solid"
              borderTop="0px"
              borderColor="grey100"
              borderBottomLeftRadius={
                index === integrations.length - 1 ? '3px' : 0
              }
              borderBottomRightRadius={
                index === integrations.length - 1 ? '3px' : 0
              }
            >
              <Flex alignItems="center">
                <Box flex={1}>
                  <Flex>
                    <Box
                      color={`${isDisabled ? 'red300' : 'green300'}`}
                      mr="10px"
                      mt="3px"
                    >
                      {isDisabled ? <CrossIcon /> : <CheckIcon />}
                    </Box>
                    <Box flex={1}>
                      <FormattedMessage
                        id={`site.settings.integrations.${provider}.integration.${
                          isDisabled ? 'disabled' : 'enabled'
                        }.description`}
                        values={integration}
                      >
                        {chunks => (
                          <Text>
                            {chunks.map((chunk, index) => (
                              <span key={index}>{chunk}</span>
                            ))}
                          </Text>
                        )}
                      </FormattedMessage>
                    </Box>
                  </Flex>
                </Box>
                {actions?.includes('edit') ? (
                  <Box ml={4} mr={2}>
                    <Button
                      data-testid="integration-edit"
                      variant="tertiary"
                      type="button"
                      to={`/teams/${teamId}/${siteId}/settings/integrations/${provider}/${uuid}/edit`}
                    >
                      <FormattedMessage id="site.settings.actions.edit" />
                    </Button>
                  </Box>
                ) : null}
                {actions?.includes('delete') ? (
                  <Box>
                    <FormattedMessage
                      id="site.settings.integrations.delete.prompt"
                      values={{ confirmText }}
                    >
                      {message => (
                        <Button
                          type="button"
                          variant="tertiary"
                          onClick={() => {
                            const response = prompt(message)
                            if (response === confirmText) {
                              onDelete({ provider: provider, uuid })
                            }
                          }}
                        >
                          <FormattedMessage id="site.settings.actions.delete" />
                        </Button>
                      )}
                    </FormattedMessage>
                  </Box>
                ) : null}
              </Flex>
            </Box>
          ))}
      </Col>
    </Row>
  )
}

Integration.defaultProps = {
  integrations: []
}

export default Integration
