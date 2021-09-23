import React from 'react'

import { useRouter } from 'next/router'

import { Button, EmptyCard, NonIdealState } from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import useGetMember from 'containers/Member/hooks/useGetMember'

import useAuthMember from 'hooks/useAuthMember'

export const MemberFeedEmpty = ({ memberId }: { memberId: string }) => {
  const { member } = useGetMember(memberId)
  const { authUser } = useAuthMember()
  const { push } = useRouter()
  const { t } = useTranslation()

  if (memberId === authUser?.id) {
    return (
      <NonIdealState
        icon={<EmptyCard />}
        title={t('common:profile.feed.empty.title', 'No posts')}
        description={t(
          'common:profile.feed.empty.subtitle',
          'You haven’t posted anything yet. Join a space to publish your first post!',
        )}
      >
        <Button onClick={() => push('/spaces')}>
          <Trans
            i18nKey="common:profile.feed.empty.explore"
            defaults="Explore spaces"
          />
        </Button>
      </NonIdealState>
    )
  }

  return (
    <NonIdealState
      icon={<EmptyCard />}
      title={t('common:profile.feed.empty.title', 'No posts')}
      description={t(
        'common:profile.feed.empty.guestSubtitle',
        '{{ username }} hasn’t posted yet.',
        {
          username: member?.name,
        },
      )}
    />
  )
}
