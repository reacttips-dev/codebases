import React from 'react'

import { useRouter } from 'next/router'

import { Button, EmptyCard, NonIdealState } from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

const GuestEmptyFeed = () => {
  const { push } = useRouter()
  const { t } = useTranslation()

  return (
    <NonIdealState
      icon={<EmptyCard />}
      title={t('home:feed.empty.title', 'Personalize your briefing')}
      description={t(
        'home:feed.empty.subtitle',
        'You haven’t posted anything yet. Join a space to publish your first post!',
      )}
    >
      <Button buttonType="primary" onClick={() => push('/spaces')}>
        <Trans i18nKey="home:feed.empty.button" defaults="Add Posts" />
      </Button>
    </NonIdealState>
  )
}

export default GuestEmptyFeed
