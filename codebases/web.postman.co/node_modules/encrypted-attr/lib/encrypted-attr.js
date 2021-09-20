'use strict'

const alg = 'aes-256-gcm'
const crypto = require('crypto')
const { get, set } = require('lodash')

function EncryptedAttributes (attributes, options) {
  options = options || {}

  let prefix = Buffer.from(`${alg}$`).toString('base64')

  function encryptAttribute (obj, val) {
    // Encrypted attributes are prefixed with "aes-256-gcm$", the base64
    // encoding of which is in `prefix`. Nulls are not encrypted.
    if (val == null || (typeof val === 'string' && val.startsWith(prefix))) {
      return val
    }
    if (typeof val !== 'string') {
      throw new Error('Encrypted attribute must be a string')
    }
    if (options.verifyId && !obj.id) {
      throw new Error('Cannot encrypt without \'id\' attribute')
    }
    // Recommended 96-bit nonce with AES-GCM.
    let iv = crypto.randomBytes(12)
    let aad = Buffer.from(
      `aes-256-gcm$${options.verifyId ? obj.id.toString() : ''}$${options.keyId}`)
    let key = Buffer.from(options.keys[options.keyId], 'base64')
    let gcm = crypto.createCipheriv('aes-256-gcm', key, iv).setAAD(aad)
    let result = gcm.update(val, 'utf8', 'base64') + gcm.final('base64')

    return aad.toString('base64') + '$' +
           iv.toString('base64') + '$' +
           result + '$' +
           gcm.getAuthTag().toString('base64').slice(0, 22)
  }

  function encryptAll (obj) {
    for (let attr of attributes) {
      let val = get(obj, attr)
      if (val != null) {
        set(obj, attr, encryptAttribute(obj, val))
      }
    }
    return obj
  }

  function decryptAttribute (obj, val) {
    // Encrypted attributes are prefixed with "aes-256-gcm$", the base64
    // encoding of which is in `prefix`. Nulls are not encrypted.
    if (typeof val !== 'string' || !val.startsWith(prefix)) {
      return val
    }
    if (options.verifyId && !obj.id) {
      throw new Error('Cannot decrypt without \'id\' attribute')
    }
    let [aad, iv, payload, tag] = val.split('$').map((x) => Buffer.from(x, 'base64'))
    let [, id, keyId] = aad.toString().split('$')
    if (options.verifyId && (id !== obj.id.toString())) {
      throw new Error('Encrypted attribute has invalid id')
    }
    if (!options.keys[keyId]) {
      throw new Error('Encrypted attribute has invalid key id')
    }
    let key = Buffer.from(options.keys[keyId], 'base64')
    let gcm = crypto.createDecipheriv('aes-256-gcm', key, iv).setAAD(aad).setAuthTag(tag)

    return gcm.update(payload, 'binary', 'utf8') + gcm.final('utf8')
  }

  function decryptAll (obj) {
    for (let attr of attributes) {
      let val = get(obj, attr)
      if (val != null) {
        set(obj, attr, decryptAttribute(obj, val))
      }
    }
    return obj
  }

  return {
    attributes,
    options,
    encryptAttribute,
    encryptAll,
    decryptAttribute,
    decryptAll
  }
}

module.exports = EncryptedAttributes
