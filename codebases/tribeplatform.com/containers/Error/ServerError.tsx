import React from 'react'

import { Center, Container } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import { withTranslation } from 'tribe-translation'

import { getRuntimeConfigVariable } from 'utils/config'

import { HeroEmptyState } from '../common'

export const ServerError = () => {
  const { t } = useTranslation()

  return (
    <Container maxW="container.2xl">
      <Center h="100vh">
        <HeroEmptyState
          image={`${getRuntimeConfigVariable('SHARED_CDN_HOST') ||
            ''}/public/static/images/notWorkingProperly.png`}
          title={t('error:title', 'It’s not you, it’s us.')}
          subtitle={t(
            'error:subtitle',
            'Something’s not working properly. Please try again in few minutes.',
          )}
          cta={t('error:cta', 'Home')}
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/'
            }
          }}
        />
      </Center>
    </Container>
  )
}

export default withTranslation('error')(ServerError)
