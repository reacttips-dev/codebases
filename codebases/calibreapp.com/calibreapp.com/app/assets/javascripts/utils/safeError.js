import Bugtracker from './bugtracker'

const cleanError = error => {
  if (error.match(/^Network error:/))
    return 'There was an unexpected error. Please try again.'

  return error.replace(/^GraphQL error:/, '')
}

const safeError = error => {
  try {
    if (typeof error === String) return error

    if (error.message) {
      return cleanError(error.message)
    }

    const graphQLError = error.graphQLErrors[0]
    if (graphQLError.message) {
      return cleanError(graphQLError.message)
    }

    if (graphQLError.extensions)
      return cleanError(graphQLError.extensions.problems[0].explanation)

    return `${error}`
  } catch (e) {
    Bugtracker.notify(e)
    return `There was an error. Please try again.`
  }
}

export default safeError
