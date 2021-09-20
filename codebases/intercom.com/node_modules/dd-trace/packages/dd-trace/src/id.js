'use strict'

const platform = require('./platform')

const UINT_MAX = 4294967296

const zeroId = new Uint8Array(8)

// Cryptographically secure local seeds to mitigate Math.random() seed reuse.
const seed = new Uint32Array(2)

if (platform.crypto) {
  platform.crypto.getRandomValues(seed)
}

const map = Array.prototype.map
const pad = byte => `${byte < 16 ? '0' : ''}${byte.toString(16)}`

// Internal representation of a trace or span ID.
class Identifier {
  constructor (value, radix) {
    this._isUint64BE = true // msgpack-lite compatibility
    this._buffer = typeof radix === 'number'
      ? fromString(value, radix)
      : createBuffer(value)
  }

  toString (radix) {
    return typeof radix === 'number'
      ? toNumberString(this._buffer, radix)
      : toHexString(this._buffer)
  }

  toBuffer () {
    return this._buffer
  }

  // msgpack-lite compatibility
  toArray () {
    if (this._buffer.length === 8) {
      return this._buffer
    }
    return this._buffer.subarray(-8)
  }

  toJSON () {
    return this.toString()
  }
}

// Create a buffer, using an optional hexadecimal value if provided.
function createBuffer (value) {
  if (value === '0') return zeroId
  if (!value) return pseudoRandom()

  const size = Math.ceil(value.length / 2)
  const buffer = new Uint8Array(size)

  for (let i = 0; i < size; i++) {
    buffer[i] = parseInt(value.substring(i * 2, i * 2 + 2), 16)
  }

  return buffer
}

// Convert a numerical string to a buffer using the specified radix.
function fromString (str, raddix) {
  const buffer = new Uint8Array(8)
  const len = str.length

  let pos = 0
  let high = 0
  let low = 0

  if (str[0] === '-') pos++

  const sign = pos

  while (pos < len) {
    const chr = parseInt(str[pos++], raddix)

    if (!(chr >= 0)) break // NaN

    low = low * raddix + chr
    high = high * raddix + Math.floor(low / UINT_MAX)
    low %= UINT_MAX
  }

  if (sign) {
    high = ~high

    if (low) {
      low = UINT_MAX - low
    } else {
      high++
    }
  }

  writeUInt32BE(buffer, high, 0)
  writeUInt32BE(buffer, low, 4)

  return buffer
}

// Convert a buffer to a numerical string.
function toNumberString (buffer, radix) {
  let high = readInt32(buffer, 0)
  let low = readInt32(buffer, 4)
  let str = ''

  radix = radix || 10

  while (1) {
    const mod = (high % radix) * UINT_MAX + low

    high = Math.floor(high / radix)
    low = Math.floor(mod / radix)
    str = (mod % radix).toString(radix) + str

    if (!high && !low) break
  }

  return str
}

// Convert a buffer to a hexadecimal string.
function toHexString (buffer) {
  return map.call(buffer, pad).join('')
}

// Simple pseudo-random 64-bit ID generator.
function pseudoRandom () {
  const buffer = new Uint8Array(8)

  const hi = randomUInt32(seed[0]) & 0x7FFFFFFF // only positive int64
  const lo = randomUInt32(seed[1])

  writeUInt32BE(buffer, hi, 0)
  writeUInt32BE(buffer, lo, 4)

  return buffer
}

// Generate a random unsigned 32-bit integer.
function randomUInt32 (seed) {
  return seed ^ Math.floor(Math.random() * (0xFFFFFFFF + 1))
}

// Read a buffer to unsigned integer bytes.
function readInt32 (buffer, offset) {
  return (buffer[offset + 0] * 16777216) +
    (buffer[offset + 1] << 16) +
    (buffer[offset + 2] << 8) +
    buffer[offset + 3]
}

// Write unsigned integer bytes to a buffer.
function writeUInt32BE (buffer, value, offset) {
  buffer[3 + offset] = value & 255
  value = value >> 8
  buffer[2 + offset] = value & 255
  value = value >> 8
  buffer[1 + offset] = value & 255
  value = value >> 8
  buffer[0 + offset] = value & 255
}

module.exports = (value, radix) => new Identifier(value, radix)
