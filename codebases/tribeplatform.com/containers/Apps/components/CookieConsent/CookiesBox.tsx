import React, { FC } from 'react'

import { Box, VStack } from '@chakra-ui/react'

import { Text } from 'tribe-components'

import { Cookie } from 'lib/cookies/@types'

type CookiesBoxProps = {
  description: string
  cookies?: Cookie[]
}

// const accordionResetStyles = {
//   w: 'full',
//   boxShadow: 'none !important',
//   bg: 'transparent',
//   p: 0,
// }

// const TableCell = ({ text }: { text: string }) => (
//   <Text textStyle="medium/small" color="label.secondary">
//     {text}
//   </Text>
// )

const CookiesBox: FC<CookiesBoxProps> = ({
  // cookies,
  description,
  children,
}) => {
  // const [isOpen, setIsOpen] = useState(false)
  // const toggleText = () => setIsOpen(!isOpen)
  return (
    <VStack spacing={4} alignItems="start" w="full">
      {children}
      <Box bg="bg.secondary" p={4} borderRadius="base" w="full">
        <VStack spacing={2} alignItems="start">
          <Text variant="regular/medium" color="label.secondary">
            {description}
          </Text>
          {/* TODO: When cookie details are dynamic, bring this back */}
          {/* <Accordion
            allowToggle
            onChange={toggleText}
            sx={accordionResetStyles}
            variant="unstyled"
            w="full"
            bg="transparent"
            p={0}
          >
            <AccordionItem variant="unstyled" w="full" bg="transparent" p={0}>
              <AccordionButton p={0} justifyContent="end">
                <Text textStyle="medium/small" color="accent.base">
                  {isOpen ? (
                    <Trans
                      i18nKey="apps:cookieConsent.hideCookies"
                      defaults="Hide cookies"
                    />
                  ) : (
                    <Trans
                      i18nKey="apps:cookieConsent.viewCookies"
                      defaults="View cookies"
                    />
                  )}
                </Text>
                <AccordionIcon color="accent.base" />
              </AccordionButton>
              <AccordionPanel px={0}>
                {cookies && cookies.length > 0 ? (
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th pb={2} px={0}>
                          <Text
                            textStyle="medium/small"
                            color="label.primary"
                            textTransform="none"
                          >
                            <Trans
                              i18nKey="apps:cookieConsent.cookie.name"
                              defaults="Cookie name:"
                            />
                          </Text>
                        </Th>
                        <Th pb={2} px={0}>
                          <Text
                            textStyle="medium/small"
                            color="label.primary"
                            textTransform="none"
                          >
                            <Trans
                              i18nKey="apps:cookieConsent.cookie.company"
                              defaults="Company:"
                            />
                          </Text>
                        </Th>
                        <Th pb={2} px={0}>
                          <Text
                            textStyle="medium/small"
                            color="label.primary"
                            textTransform="none"
                          >
                            <Trans
                              i18nKey="apps:cookieConsent.cookie.domains"
                              defaults="Domains:"
                            />
                          </Text>
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td colSpan={3} p={0}>
                          <Divider borderColor="label.muted" mb={2} />
                        </Td>
                      </Tr>
                      {cookies?.map((cookie, i) => {
                        const paddingBottom = i === cookies.length - 1 ? 0 : 2
                        return (
                          <Tr key={cookie.name}>
                            <Td pt={0} pb={paddingBottom} px={0}>
                              <TableCell text={cookie.name} />
                            </Td>
                            <Td pt={0} pb={paddingBottom} px={0}>
                              <TableCell text={cookie.company} />
                            </Td>
                            <Td pt={0} pb={paddingBottom} px={0}>
                              <TableCell text={cookie.domains?.join(', ')} />
                            </Td>
                          </Tr>
                        )
                      })}
                    </Tbody>
                  </Table>
                ) : (
                  <Box>
                    <Text
                      textStyle="regular/small"
                      color="label.primary"
                      textTransform="none"
                    >
                      <Trans
                        i18nKey="apps:cookieConsent.cookie.noCookies"
                        defaults="There are currently no cookies being used for these purposes."
                      />
                    </Text>
                  </Box>
                )}
              </AccordionPanel>
            </AccordionItem>
          </Accordion> */}
        </VStack>
      </Box>
    </VStack>
  )
}

export default CookiesBox
