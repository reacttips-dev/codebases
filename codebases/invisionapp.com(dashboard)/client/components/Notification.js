import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Link as RouterLink } from 'react-router'
import { Link, Alert } from '@invisionapp/helios'
import { selectNotification, showNotification } from '../stores/notifications'

const mapStateToProps = state => {
  return {
    ...selectNotification(state),
    showNotification: showNotification(state)
  }
}

const NotificationComponent = ({ linkLabel, linkTo, message, showNotification, type }) =>
  showNotification && (
    <WrappedNotification status={showNotification ? type : undefined}>
      {message}{' '}
      {linkLabel && (
        <Link order="primary" element={RouterLink} to={linkTo}>
          {linkLabel}
        </Link>
      )}
    </WrappedNotification>
  )

const WrappedNotification = styled(Alert)`
  margin-bottom: ${props => props.theme.spacing.m};
`

export default connect(mapStateToProps)(NotificationComponent)
