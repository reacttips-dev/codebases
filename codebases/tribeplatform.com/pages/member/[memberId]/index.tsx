import React from 'react'

import { NextPageContextApp, SidebarKind } from '@types'
import { useRouter } from 'next/router'

import { GET_MEMBER_BY_ID } from 'tribe-api/graphql'
import { Member } from 'tribe-api/interfaces'

import MemberContainer from 'containers/Member/MemberContainer'

import { memberSeo } from 'utils/seo.utils'

import Error from '../../../containers/Error'

const MemberPage = () => {
  const router = useRouter()
  const { memberId } = router.query

  if (typeof memberId === 'string') {
    return <MemberContainer memberId={memberId} />
  }

  return <Error />
}

MemberPage.getInitialProps = async (
  context: NextPageContextApp,
  { isServer },
) => {
  const { apolloClient, query } = context
  const { memberId } = query || {}

  const res = await apolloClient?.query({
    query: GET_MEMBER_BY_ID,
    variables: {
      memberId,
    },
    fetchPolicy: isServer ? 'network-only' : 'cache-only',
  })
  const data = res?.data

  const member = data?.getMember as Member

  return {
    namespacesRequired: ['common', 'userimport', 'settings', 'member'],
    sidebarKind: SidebarKind.spaces,
    seo: memberSeo(member),
  }
}

export default MemberPage
