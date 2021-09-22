import { createSelector } from 'reselect'

import sortBy from 'lodash/sortBy'
import { UNTITLED } from '../constants/DocumentTypes'

const batchFilterSelector = state => state.batch.filterText
const selectedDocumentSelector = state => state.batch.selected
const getSpaceID = state => state.space.id

export const documentsSelector = state => state.documents.documents

export const getSpaceDocuments = createSelector(
  documentsSelector,
  getSpaceID,
  (documents, spaceID) => {
    return documents.filter(doc => doc.data && doc.data.spaceID && doc.data.spaceID === spaceID)
  }
)

export const filterAllDocuments = createSelector(
  batchFilterSelector,
  documentsSelector,
  selectedDocumentSelector,
  getSpaceDocuments,
  (filterText, documents, selected, spaceDocuments) => {
    const searchValue = filterText.toLowerCase()

    const filteredDocuments = documents.filter(doc => {
      if (!doc.permissions.canMove) return false

      if ((doc.data.name || UNTITLED).toLowerCase().indexOf(searchValue) === -1) {
        return false
      }

      const inSelected = selected.some(sel => {
        return sel.type === doc.type && sel.id + '' === doc.id + ''
      })

      const inSpace = spaceDocuments.some(sel => {
        return sel.type === doc.type && sel.id + '' === doc.id + ''
      })

      return !inSelected && !inSpace
    })

    return sortBy(filteredDocuments, doc => doc.data.updatedAt).reverse()
  }
)

export const analyticsSpaceTypeSelector = state => state.analytics.spaceType
