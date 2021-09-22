import React from 'react'

import { Link, Text } from '@invisionapp/helios'

import { PROTOTYPE, PRESENTATION, HARMONY, HARMONY_NAME } from '../../constants/DocumentTypes'
import { APP_SPACE_OPENED } from '../../constants/TrackingEvents'
import { trackEvent } from '../../utils/analytics'
import { GenerateIDURL } from '../../utils/urlIDParser'

import styles from '../../css/tiles/tile.css'

const handleTracking = (space) => () => {
  const event = {
    spaceId: space.id,
    spaceType: space.data && !space.data.isPublic ? 'invite-only' : 'team',
    spaceContext: 'document_card'
  }

  trackEvent(APP_SPACE_OPENED, event)
}

export default function renderSpaceName (props, documentType) {
  const { canCreateSpaces, data = {}, location, handleMoveDocument } = props
  const { isArchived } = data

  const id = data.space ? data.space.id || '' : ''
  const title = data.space ? data.space.title || '' : ''
  const discoverable = data.space ? data.space.discoverable : true

  const isViewingSpace = id && location.pathname.includes(id)

  // space create pernissions are stores in the user account...
  const isInSpace = title !== ''

  switch (documentType) {
    case PRESENTATION:
    case PROTOTYPE:
      documentType = 'Prototype'
      break
    case HARMONY:
      documentType = HARMONY_NAME
      break
    default:
      documentType = documentType && (documentType.charAt(0).toUpperCase() + documentType.substring(1))
  }

  if (!isInSpace && !isArchived && canCreateSpaces && discoverable) {
    return (
      <Text order='body' size='smallest' color='text-lighter'>
        <Link
          onClick={handleMoveDocument}
          order='primary'

        >
          <span>Add to space</span>
        </Link>
      </Text>
    )
  }

  if (!isViewingSpace && discoverable && id && title) {
    return (
      <Text
        className={styles.spaceName}
        color='text-lighter'
        order='body'
        size='smallest'
      >
        <Link
          href={`/spaces/${GenerateIDURL(id, title)}`}
          data-app-shell-behavior='prevent-default'
          order='secondary'
          onClick={handleTracking(props.data.space, location)}
        >
          {title}
        </Link>
      </Text>
    )
  }

  if (!isViewingSpace && !discoverable) {
    return (
      <Text
        className={styles.spaceName}
        color='text-lighter'
        order='body'
        size='smallest'
      >
        Private space
      </Text>
    )
  }

  return null
}
