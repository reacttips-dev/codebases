import React, { useContext } from 'react'

import { DisplayPostTopicsModal } from 'containers/Topic/components/DisplayPostTopicModal'
import { TopicsStore } from 'containers/Topic/providers/TopicProvider'

export const FeedTopicsModal = () => {
  const { state: displayTopicsModalState, hideTopicsModal } = useContext(
    TopicsStore,
  )
  return (
    <DisplayPostTopicsModal
      slug={displayTopicsModalState?.slug}
      onClose={() => hideTopicsModal()}
      isOpen={displayTopicsModalState?.visibility}
      topics={displayTopicsModalState?.topics}
    />
  )
}
