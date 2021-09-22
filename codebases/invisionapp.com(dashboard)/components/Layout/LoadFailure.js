import React from 'react'
import PropTypes from 'prop-types'

import { Link, Spaced, Text } from '@invisionapp/helios'

import LoadFailureImg from '../../img/load-failure.svg'
import { image, link, message, root } from '../../css/home/load-failure.css'

const LoadFailure = ({ onClick, type }) => (
  <div className={root}>
    <LoadFailureImg className={image} />
    <Spaced bottom='m'>
      <div>
        <Text order='title'><span>Well, that didn't work</span></Text>
      </div>
    </Spaced>
    <div className={message}><Text order='body'><span>We hoped we'd never have to say this: Your {type} didn't load correctly.</span></Text></div>
    <div><Link className={link} onClick={onClick}>Let's try again</Link></div>
  </div>
)

LoadFailure.propTypes = {
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default LoadFailure
