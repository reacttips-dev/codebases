// Based on the [postcss-pxtorem plugin](https://github.com/cuth/postcss-pxtorem)
import { plugins } from 'glamor'

const minPixelValue = 4
const rootValue = 16
const unitPrecision = 5

// See https://github.com/cuth/postcss-pxtorem/blob/master/lib/pixel-unit-regex.js
const pxRegExp = /"[^"]+"|'[^']+'|url\([^)]+\)|(\d*\.?\d+)px/ig

// Not an exhaustive list but should cover most of our use cases:
// https://developer.mozilla.org/en-US/docs/Web/CSS/Reference
// Order is based on most likely used...
const blacklist = [
  'zIndex',
  'opacity',
  'fontWeight',
  'flex',
  'flexGrow',
  'flexShrink',
  'flexOrder',
  'order',
  'columnCount',
  'strokeMiterlimit',
  'strokeWidth',
  'counterIncrement',
  'counterReset',
]

const isNumberPropBlacklisted = prop =>
  blacklist.some(property => property === prop)

const isValueInRange = value =>
  Math.abs(value) > minPixelValue

const toFixed = (number, precision) => {
  const multiplier = 10 ** (precision + 1)
  const wholeNumber = Math.floor(number * multiplier)
  return (Math.round(wholeNumber / 10) * 10) / multiplier
}

const toRem = (value) => {
  const fixed = toFixed((Number(value) / rootValue), unitPrecision)
  return fixed === 0 ? '0' : `${fixed}rem`
}

const pixelReplace = () => ((pxValue, numValue) => {
  if (!numValue) return pxValue
  if (!isValueInRange(numValue)) return pxValue
  return toRem(numValue)
})

export default function pxtorem({ selector, style }) {
  const newStyle = { ...style }
  const pxReplace = pixelReplace()
  Object.keys(newStyle).forEach((prop) => {
    const value = newStyle[prop]
    if (typeof value === 'number' && isValueInRange(value) && !isNumberPropBlacklisted(prop)) {
      newStyle[prop] = toRem(value)
    } else if (typeof value === 'string' && value.includes('px')) {
      newStyle[prop] = value.replace(pxRegExp, pxReplace)
    }
  })
  return ({ selector, style: newStyle })
}

// Load the plugin
// TODO: Adding the plugin to glamor shouldn't happen in here
plugins.add(pxtorem)

