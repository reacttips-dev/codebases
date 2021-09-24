import React from 'react'

import Error from '../components/Error'
import Button from '../components/Button'

import NotFound from '../components/templates/NotFound'

import safeError from '../utils/safeError'
import Bugtracker from '../utils/bugtracker'

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    Bugtracker.notify(error)
    return { hasError: true, error }
  }

  render() {
    const { hasError, error } = this.state
    const { children } = this.props

    if (!hasError) return children

    if (
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Failed to load resource')
    ) {
      return (
        <Error title="We have a new version of Calibre for you. Just press the button below.">
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Reload the page
          </Button>
        </Error>
      )
    }

    let message = safeError(error)
    if (message.includes('Team not found')) {
      return <NotFound id="team" />
    }

    if (message.includes('Site not found')) {
      return <NotFound id="site" />
    }

    return (
      <Error
        title="There was an unexpected error"
        message="Our team has been notified."
      />
    )
  }
}

export default ErrorBoundary
