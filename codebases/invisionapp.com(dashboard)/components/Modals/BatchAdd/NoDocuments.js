import React from 'react'
import PropTypes from 'prop-types'

import { Illustration, Spaced, Text } from '@invisionapp/helios'
import FullSpace from '@invisionapp/helios/illustrations/scene/no-spaces-to-view.svg'
import NoResults from '@invisionapp/helios/illustrations/scene/no-screens-found.svg'

import styles from '../../../css/modals/batch-add/no-documents.css'

const NoComponents = ({ empty }) => {
  const ErrorIllustration = empty ? NoResults : FullSpace
  const title = empty ? 'No results found' : 'You\'ve selected everything'
  const description = empty
    ? 'Try adjusting your search or filter to find what you’re looking for.'
    : 'This is going to be quite the space.'

  const illustrationProps = empty ? {
    width: '386',
    height: '240',
    viewBox: '0 0 615 381'
  } : {}

  return (
    <div className={styles.root}>
      <Illustration order='scene'>
        <ErrorIllustration
          className={styles.image}
          {...illustrationProps}
        />
      </Illustration>

      <Spaced bottom='xs'>
        <Text
          color='text'
          element='div'
          order='subtitle'
          size='larger'>
          {title}
        </Text>
      </Spaced>

      <Text
        color='text'
        element='div'
        order='body'>
        {description}
      </Text>
    </div>
  )
}

NoComponents.propTypes = {
  empty: PropTypes.bool
}

export default NoComponents
