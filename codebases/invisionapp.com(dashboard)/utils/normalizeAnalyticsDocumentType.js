import {
  PROTOTYPE,
  PRESENTATION
} from '../constants/DocumentTypes'

export default function normalizeAnalyticsDocumentType (type) {
  let returnType = type

  if (type === PROTOTYPE) {
    returnType = 'prototype-flat'
  } else if (type === PRESENTATION) {
    returnType = 'prototype-udf'
  }

  return returnType
}
