// Subdomain must be at least 2 chars and cannot be more than 125 chars
// we allow: alphanumeric characters and hyphens

module.exports = {
  subdomain: {
    format: {
      pattern: '[0-9a-z-]{2,125}',
      flags: 'i'
    }
  }
}
