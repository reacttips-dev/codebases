import {
  HARMONY,
  HARMONY_NAME,
  PROTOTYPE,
  PRESENTATION,
  RHOMBUS,
  RHOMBUS_NAME
} from '../constants/DocumentTypes'

export function getDocumentName (documentType) {
  switch (documentType) {
    case PRESENTATION:
    case PROTOTYPE:
      return 'Prototype'
    case RHOMBUS:
      return RHOMBUS_NAME
    case HARMONY:
      return HARMONY_NAME
    default:
      return documentType && (documentType.charAt(0).toUpperCase() + documentType.substring(1))
  }
}
