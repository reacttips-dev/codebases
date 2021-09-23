import React from 'react'

import { Box, Flex } from '@chakra-ui/react'
import NextLink from 'next/link'

import { Button, Text } from 'tribe-components'
import { Trans } from 'tribe-translation'

import CampfireLogo from './CampfireLogo'

const WelcomeSection = () => (
  <Flex
    boxShadow="lowLight"
    borderRadius={[0, '6px']}
    mt={[6, 8]}
    bgColor="#1b1b1b"
    bgImage="url('https://tribe-s3-production.imgix.net/aWTBb7njiemxGOfAdsLcd')"
    bgRepeat="repeat"
    flexDirection="column"
    justifyContent="center"
    height={['250px', '286px']}
    paddingX={['32px', '65px']}
    overflow="hidden"
    w="100%"
  >
    <Box ml="-2">
      <CampfireLogo />
    </Box>
    <Text
      mt={5}
      textStyle="semibold/2xlarge"
      fontSize={['xl', '32px']}
      color="label.primary"
      sx={{ color: 'white' }}
    >
      <Trans
        i18nKey="explore:welcomeBox.banner"
        defaults="Welcome to the community"
      />
    </Text>
    <Text
      mt={3}
      textStyle="semibold/xlarge"
      sx={{ color: 'white' }}
      fontSize={['md', 'xl']}
    >
      <Trans
        i18nKey="explore:welcomeBox.description"
        defaults="Learn, share and build relationships"
      />
    </Text>
    <Box>
      <NextLink href="/start-here/post" passHref>
        <Button
          buttonType="secondary"
          as="a"
          mt="42px"
          borderRadius="33px"
          fontWeight="bold"
          fontSize="14px"
        >
          <Trans i18nKey="explore:welcomeBox.btn" defaults="Get Started" />
        </Button>
      </NextLink>
    </Box>
  </Flex>
)

export default WelcomeSection
