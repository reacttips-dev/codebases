import React from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import { FormattedMessage, useIntl } from 'react-intl'

import Menu, {
  MenuButton,
  MenuList,
  MenuSection,
  MenuHeading,
  MenuLink,
  MenuAction
} from '../Menu'
import { ExportButton, GuideButton, ExternalLinkButton } from '../Button'
import { Flex, Box, InlineBox } from '../Grid'

import { Heading, Text, TextLink } from '../Type'
import Code from '../Code'

const Export = ({ id, actions, values }) => {
  const intl = useIntl()

  let cli = {}
  const title = intl.formatMessage({ id: `${id}.title` })
  const code = intl.formatMessage({ id: `${id}.cli.code` }, values)
  if (code) {
    cli = {
      code,
      link: intl.formatMessage({ id: `${id}.cli.link` }),
      url: intl.formatMessage({ id: `${id}.cli.url` })
    }
  }

  return (
    <Menu>
      {({ isExpanded }) => (
        <>
          <MenuButton>
            <VisuallyHidden>{title}</VisuallyHidden>
            <ExportButton
              as="div"
              role="button"
              title={title}
              className={isExpanded ? 'active' : null}
            />
          </MenuButton>
          {isExpanded ? (
            <MenuList
              level="lg"
              borderColor="grey100"
              borderStyle="solid"
              borderWidth="1px"
            >
              <>
                <MenuSection p={4}>
                  <Flex
                    flexWrap={['wrap', 'nowrap']}
                    alignItems="center"
                    width="100%"
                  >
                    <Box flex={1} mb={[4, 0]}>
                      <Heading>{title}</Heading>
                    </Box>
                    <Box pr={1} width={[1, 'auto']}>
                      <GuideButton
                        as={MenuLink}
                        href="/docs/account-and-billing/export-data"
                      >
                        <FormattedMessage id="export.actions.guide" />
                      </GuideButton>
                    </Box>
                  </Flex>
                </MenuSection>
                {actions && actions.length ? (
                  <MenuSection p={4}>
                    <MenuHeading>
                      <FormattedMessage id={`${id}.actions.title`} />
                    </MenuHeading>
                    <Box mt="15px" data-qa="exportActions">
                      {actions.map(({ action, onClick }, index) => (
                        <InlineBox mr="8px" key={index}>
                          <MenuAction
                            variant="primary"
                            onClick={onClick}
                            forwardedAs="button"
                          >
                            <FormattedMessage id={`${id}.actions.${action}`} />
                          </MenuAction>
                        </InlineBox>
                      ))}
                    </Box>
                  </MenuSection>
                ) : null}
                {cli.code ? (
                  <MenuSection p={4}>
                    <MenuHeading>
                      <FormattedMessage id="export.cli.title" />
                    </MenuHeading>
                    <Box my="15px">
                      <FormattedMessage
                        id={`${id}.cli.description`}
                        values={{
                          ...values,
                          link: cli.link ? (
                            <TextLink href={cli.url} target="_blank">
                              {cli.link}
                            </TextLink>
                          ) : null
                        }}
                      >
                        {chunks => (
                          <Box>
                            <Text>
                              {chunks.map((chunk, index) => (
                                <span key={index}>{chunk}</span>
                              ))}
                            </Text>
                          </Box>
                        )}
                      </FormattedMessage>
                    </Box>
                    <div>
                      <Code language="bash">{cli.code}</Code>
                      <ExternalLinkButton href="/docs/automation/cli">
                        <FormattedMessage id="export.cli.learn_more" />
                      </ExternalLinkButton>
                    </div>
                  </MenuSection>
                ) : null}
              </>
            </MenuList>
          ) : null}
        </>
      )}
    </Menu>
  )
}

Export.defaultProps = {
  id: 'pulse.export',
  actions: [],
  values: {}
}

export default Export
