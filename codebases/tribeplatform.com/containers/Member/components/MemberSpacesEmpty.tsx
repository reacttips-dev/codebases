import React from 'react'

import { useRouter } from 'next/router'

import { Button, EmptySpaces, NonIdealState } from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import useGetMember from 'containers/Member/hooks/useGetMember'

import useAuthMember from 'hooks/useAuthMember'

export const MemberSpacesEmpty = ({ memberId }: { memberId: string }) => {
  const { member } = useGetMember(memberId)
  const { authUser } = useAuthMember()
  const { push } = useRouter()
  const { t } = useTranslation()

  if (memberId === authUser?.id) {
    return (
      <NonIdealState
        icon={<EmptySpaces />}
        title={t('common:profile.spaces.empty.title', 'No spaces')}
        description={t(
          'common:profile.spaces.empty.subtitle',
          'You’re not a member of any spaces yet.',
        )}
      >
        <Button onClick={() => push('/spaces')}>
          <Trans
            i18nKey="common:profile.spaces.empty.explore"
            defaults="Explore spaces"
          />
        </Button>
      </NonIdealState>
    )
  }

  return (
    <NonIdealState
      icon={<EmptySpaces />}
      title={t('common:profile.spaces.empty.title', 'No spaces')}
      description={t(
        'common:profile.spaces.empty.guestSubtitle',
        '{{ username }} isn’t a member of any spaces yet.',
        {
          username: member?.name,
        },
      )}
    />
  )
}
