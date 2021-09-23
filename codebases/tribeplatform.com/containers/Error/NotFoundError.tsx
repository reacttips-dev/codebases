import React from 'react'

import { Center, Container } from '@chakra-ui/react'

import { useTranslation, withTranslation } from 'tribe-translation'

import { getRuntimeConfigVariable } from 'utils/config'

import { HeroEmptyState } from '../common'

export const NotFoundError = () => {
  const { t } = useTranslation()

  return (
    <Container maxW="container.2xl">
      <Center h="100vh">
        <HeroEmptyState
          image={`${getRuntimeConfigVariable('SHARED_CDN_HOST') ||
            ''}/public/static/images/404.png`}
          title={t('404:title', 'We couldn’t find a page you’re looking for.')}
          subtitle={t(
            '404:subtitle',
            'Please check if the URL in your browser is correct or try this address later.',
          )}
          cta={t('404:cta', 'Home')}
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

export default withTranslation('404')(NotFoundError)
