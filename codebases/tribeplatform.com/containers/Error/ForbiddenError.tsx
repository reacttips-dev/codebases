import React from 'react'

import { Center, Container } from '@chakra-ui/react'

import { useTranslation, withTranslation } from 'tribe-translation'

import { HeroEmptyState } from 'containers/common'

import { getRuntimeConfigVariable } from 'utils/config'

export const ErrorForbidden = () => {
  const { t } = useTranslation()

  return (
    <Container maxW="container.2xl">
      <Center h="100vh">
        <HeroEmptyState
          image={`${getRuntimeConfigVariable('SHARED_CDN_HOST') ||
            ''}/public/static/images/forbidden.png`}
          title={t(
            'error:forbidden.title',
            'You don’t have access to view this page.',
          )}
          subtitle={t(
            'error:forbidden.subtitle',
            'You can always contact the community admin if you think this is a mistake.',
          )}
          cta={t('error:forbidden.cta', 'Home')}
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

export default withTranslation('error')(ErrorForbidden)
