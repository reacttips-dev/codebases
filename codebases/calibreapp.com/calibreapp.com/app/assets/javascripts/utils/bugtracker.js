const Bugtracker = {
  notify: (err, options) => {
    if (typeof bugsnagClient !== 'undefined') {
      //eslint-disable-next-line no-undef
      bugsnagClient.notify(err, options)
    } else {
      console.warn('[No Bugsnag Client] Debug Error:', err, options)
    }
  }
}

export default Bugtracker
