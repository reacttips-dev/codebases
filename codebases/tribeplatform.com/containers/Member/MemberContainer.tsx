import React from 'react'

import ViewMember from './components/ViewMember'

const MemberContainer = ({ memberId }: { memberId: string }) => (
  <ViewMember memberId={memberId} />
)

export default MemberContainer
