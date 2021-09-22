import {
  PROTOTYPE,
  PRESENTATION,
  PROTOTYPE_UDF,
  PROTOTYPE_FLAT
} from '../constants/document-types'

export default function formatRequestDocuments (documents) {
  return (documents || []).map(doc => {
    let type = doc.type
    if (type === PROTOTYPE_FLAT) {
      type = PROTOTYPE
    } else if (type === PROTOTYPE_UDF) {
      type = PRESENTATION
    }

    return {
      documentType: type,
      documentId: doc.id.toString()
    }
  })
}
