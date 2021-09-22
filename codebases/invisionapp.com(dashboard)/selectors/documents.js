import { createSelector } from 'reselect'
import sortBy from 'lodash/sortBy'
import orderBy from 'lodash/orderBy'

import {
  BOARD,
  FREEHAND,
  HARMONY,
  PRESENTATION,
  PROTOTYPE,
  RHOMBUS,
  SPEC,
  UNTITLED
} from '../constants/DocumentTypes'
import {
  DOCUMENTS_PER_PAGE,
  FILTER_BOARDS,
  FILTER_HARMONY,
  FILTER_RHOMBUS,
  FILTER_SPECS,
  FILTER_FREEHANDS,
  FILTER_PROTOTYPES
} from '../constants/FilterTypes'
import * as SortTypes from '../constants/SortTypes'

const getArchivedDocuments = state => state.documents.archivedDocuments
const getConfig = state => state.config
const getDocuments = state => state.documents.documents
const getDocumentType = state => state.filters.documentType
const getErrors = state => state.documents.errors
const getFirstSelected = state => state.selected.firstSelected
const getPage = state => state.documents.page
const getSearch = state => state.filters.search
const getSelected = state => state.selected.selected
const getActiveSelectedDocument = state => state.selected.activeDocument
const getSortType = state => state.filters.documentsSort
const getTeamDocsInHome = state => state.config.teamDocsInHome
const getViewFilter = state => state.filters.viewFilter
const getViewType = state => state.filters.viewType

const getSpaceID = state => state.space.id

export const errorMessage = createSelector(
  getConfig,
  getDocuments,
  getErrors,
  ({ rhombusEnabled }, documents, errors) => {
    const errorDocTypes = {
      BoardsFetchError: 'Boards',
      FreehandsFetchError: 'Freehands',
      PresentationsFetchError: 'Prototypes',
      PrototypesFetchError: 'Prototypes',
      RhombusesFetchError: 'Docs',
      SpacesFetchError: 'Spaces',
      HarmoniesFetchError: 'Designs'
    }

    const documentErrors = errors
      .filter(({ type }) => {
        switch (type) {
          case 'SpacesFetchError':
            return false
          case 'RhombusesFetchError':
            return rhombusEnabled
          default:
            return Object.keys(errorDocTypes).includes(type)
        }
      })
      .map(({ type }) => errorDocTypes[type])

    if (documentErrors.length > 0 && documents.length === 0) { return "Your documents didn't load correctly." }

    if (documentErrors.length > 0 && documents.length > 0) {
      switch (documentErrors.length) {
        case 1:
          return `${documentErrors[0]} didn't load correctly.`
        case 2: {
          if (documentErrors[0] === documentErrors[1]) {
            return `${documentErrors[0]} didn't load correctly.`
          }
          return `${
            documentErrors[0]
          } and ${documentErrors[1].toLowerCase()} didn't load correctly.`
        }

        default: {
          const docList = documentErrors.reduce((acc, val, i) => {
            if (i === 0) return val
            if (i < documentErrors.length - 1) { return `${acc}, ${val.toLowerCase()}` }
            return `${acc} and ${val.toLowerCase()}`
          }, '')
          return `${docList} didn't load correctly.`
        }
      }
    }

    return ''
  }
)

const makeFilterDocuments = isInSpace =>
  createSelector(
    getArchivedDocuments,
    getDocuments,
    getDocumentType,
    getSearch,
    getSortType,
    getViewFilter,
    getSpaceID,
    (
      archivedDocuments,
      documents,
      documentType,
      search,
      sortType,
      viewFilter,
      spaceID
    ) => {
      documents =
        viewFilter === 'archive' ? archivedDocuments || [] : documents || []

      // Space Documents
      if (isInSpace && spaceID && spaceID !== '') {
        documents = documents.filter(doc => {
          return doc.data.spaceID && doc.data.spaceID === spaceID
        })
      }

      // Team/User filtering
      if (viewFilter === 'user') {
        documents = documents.filter(doc => {
          return doc.permissions && doc.permissions.owns
        })
      }

      // Document type filtering
      let docFilter = ''

      switch (documentType) {
        case FILTER_BOARDS:
          docFilter = [BOARD]
          break
        case FILTER_RHOMBUS:
          docFilter = [RHOMBUS]
          break
        case FILTER_SPECS:
          docFilter = [SPEC]
          break
        case FILTER_FREEHANDS:
          docFilter = [FREEHAND]
          break
        case FILTER_PROTOTYPES:
          docFilter = [PROTOTYPE, PRESENTATION]
          break
        case FILTER_HARMONY:
          docFilter = [HARMONY]
          break
      }

      if (docFilter) {
        documents = documents.filter(doc => docFilter.indexOf(doc.type) >= 0)
      }

      // Keyword search
      if (search) {
        const lowerSearch = search.toLowerCase()
        documents = documents.filter(
          doc =>
            (doc.data.name || UNTITLED).toLowerCase().indexOf(lowerSearch) >= 0
        )
      }

      // Sorting
      switch (sortType) {
        case SortTypes.SORT_CREATED:
          documents = sortBy(documents, doc => doc.data.createdAt).reverse()
          break
        case SortTypes.SORT_UPDATED:
          documents = sortBy(documents, doc => doc.data.updatedAt).reverse()
          break
        case SortTypes.SORT_ALPHA:
          documents = sortBy(documents, doc =>
            (doc.data.name || UNTITLED).toLowerCase()
          )
          break
        case SortTypes.SORT_RECENT:
        default:
          documents = orderBy(documents, [
            ({ data }) => data.lastViewed || '',
            ({ data }) => data.updatedAt || ''
          ], [
            'desc',
            'desc'
          ])
          break
      }

      return documents
    }
  )

export const filterDocuments = makeFilterDocuments(false)
export const filterSpaceDocuments = makeFilterDocuments(true)

export const totalPages = createSelector(filterDocuments, documents => {
  return Math.max(Math.ceil(documents.length / DOCUMENTS_PER_PAGE), 1)
})

export const pagedDocuments = createSelector(
  totalPages,
  filterDocuments,
  getPage,
  (totalPages, documents, page) => {
    documents = documents || []
    page = Math.min(page, totalPages - 1)

    return documents.slice(
      page * DOCUMENTS_PER_PAGE,
      (page + 1) * DOCUMENTS_PER_PAGE
    )
  }
)

export const recentDocuments = createSelector(getDocuments, documents => {
  documents = documents.filter(
    doc => doc.permissions && doc.permissions.hasMembership
  )
  documents = sortBy(
    documents,
    doc => doc.data.lastViewed || doc.data.updatedAt
  )
    .reverse()
    .slice(0, 12)
  return documents
})

export const recentTeamDocuments = createSelector(
  getDocuments,
  getTeamDocsInHome,
  (documents, teamDocsInHome) => {
    documents = documents.filter(
      doc => doc.permissions && !doc.permissions.hasMembership
    )
    documents = sortBy(documents, doc => doc.data.updatedAt)
      .reverse()
      .slice(0, 8)

    return teamDocsInHome ? documents : []
  }
)

export const spaceHasArchivedDocuments = createSelector(
  getSpaceID,
  getArchivedDocuments,
  (spaceID, documents) => {
    documents = documents.filter(doc => doc.data.spaceID && doc.data.spaceID === spaceID)
    return documents.length > 0
  }
)

export const hiddenSelectedDocumentCount = createSelector(
  getViewType,
  recentDocuments,
  recentTeamDocuments,
  filterDocuments,
  getSelected,
  (viewType, recents, teamRecents, filteredDocuments, selected) => {
    let hiddenCount = 0

    selected.forEach(sel => {
      if (viewType === 'recents') {
        const inRecents = recents.find(
          doc => doc.type === sel.type && doc.id + '' === sel.id + ''
        )
        if (!inRecents) {
          const inTeamDocs = teamRecents.find(
            doc => doc.type === sel.type && doc.id + '' === sel.id + ''
          )

          if (!inTeamDocs) {
            hiddenCount++
          }
        }
      } else {
        const inDocs = filteredDocuments.find(
          doc => doc.type === sel.type && doc.id + '' === sel.id + ''
        )
        if (!inDocs) {
          hiddenCount++
        }
      }
    })

    return hiddenCount
  }
)

export const disabledSelectedDocuments = createSelector(
  getDocuments,
  getSelected,
  (documents, selected) => {
    let disabledDocuments = []

    selected.forEach(sel => {
      const doc = documents.find(
        doc => doc.type === sel.type && doc.id + '' === sel.id
      )
      if (!doc || (doc && !doc.permissions.canMove)) {
        disabledDocuments.push(sel)
      }
    })

    return disabledDocuments
  }
)

export const selectedDocuments = createSelector(
  getConfig,
  getDocuments,
  getFirstSelected,
  getSelected,
  (config, documents, firstSelected, selected) => {
    const { pagingEnabled } = config

    let returnDocs = []
    let hasFirst = false

    if (pagingEnabled) {
      if (firstSelected.type && firstSelected.id) {
        hasFirst = true
        returnDocs.push({ ...firstSelected })
      }

      if (!hasFirst) {
        returnDocs = selected
      } else {
        returnDocs.push(...selected.filter(sel => {
          if (sel.id === firstSelected.id && sel.type === firstSelected.type) return false
          return true
        }))
      }

      return returnDocs
    }

    if (firstSelected.type && firstSelected.id) {
      const first = documents.find(doc => doc.id + '' === firstSelected.id + '' && doc.type === firstSelected.type)
      if (first) {
        hasFirst = true
        returnDocs.push(first)
      }
    }

    documents.filter(doc => {
      if (hasFirst && doc.id + '' === firstSelected.id + '' && doc.type === firstSelected.type) return false
      return !!selected.find(sel => sel.id + '' === doc.id + '' && sel.type === doc.type)
    }).forEach(doc => returnDocs.push(doc))

    return returnDocs
  }
)

export const makeDocumentsRange = isInSpace => createSelector(
  getActiveSelectedDocument,
  getSelected,
  filterDocuments,
  filterSpaceDocuments,
  (selectedDocument, selected, allDocuments, spaceDocuments) => {
    const listing = isInSpace ? spaceDocuments : allDocuments
    const selectedIndex = listing.findIndex(l => l.id + '' === selectedDocument.id + '' && l.type === selectedDocument.type)
    let prevDocs = []
    let forwardDocs = []
    let prevHit = false
    let forwardHit = false

    if (selectedIndex === -1) return []

    for (let j = selectedIndex; j < listing.length; j++) {
      if (selected.findIndex(s => s.id + '' === listing[j].id + '' && s.type === listing[j].type) >= 0) {
        forwardHit = true
        break
      } else {
        forwardDocs.push({
          type: listing[j].type,
          id: listing[j].id + '',
          title: listing[j].data.name,
          currentSpaceID: listing[j].data.spaceID
        })
      }
    }

    if (!forwardHit) {
      for (let i = selectedIndex - 1; i >= 0; i--) {
        if (selected.findIndex(s => s.id + '' === listing[i].id + '' && s.type === listing[i].type) >= 0) {
          prevHit = true
          break
        } else {
          prevDocs.push({
            type: listing[i].type,
            id: listing[i].id + '',
            title: listing[i].data.name,
            currentSpaceID: listing[i].data.spaceID
          })
        }
      }
    }

    return prevHit ? prevDocs : forwardDocs
  }
)

export const selectedDocumentsRange = makeDocumentsRange(false)
export const selectedSpaceDocumentsRange = makeDocumentsRange(true)
