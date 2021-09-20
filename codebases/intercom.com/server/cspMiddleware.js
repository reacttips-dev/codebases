const generatePolicyString = require('../content-security-policy')
const { v4: uuid } = require('uuid')

const NONCE_TEMPLATE = '___CSP_NONCE_TO_BE_REPLACED_BY_NGINX___'

/**
 * This middleware adds our Content Security Policy.
 */
module.exports = function cspMiddleware(req, res, next) {
  const nonce = Buffer.from(uuid()).toString('base64')

  req.nonce = nonce
  res.set('Content-Security-Policy', generatePolicyString('default', nonce))
  res.set('X-Nonce', nonce) // This will be used by NGINX to replace all NONCE_TEMPLATE occurrences

  next()
}

module.exports.NONCE_TEMPLATE = NONCE_TEMPLATE
