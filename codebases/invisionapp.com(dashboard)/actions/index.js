import * as ActionTypes from '../constants/ActionTypes'
import { getSubviewDocumentLabel } from '../utils/analytics'

export function configLoaded (config) {
  return {
    type: ActionTypes.CONFIG_LOADED,
    data: {
      config
    }
  }
}

export function documentMoved (documentType, documentID, spaceCUID, spaceTitle) {
  return {
    type: ActionTypes.DOCUMENT_MOVED,
    data: {
      documentType,
      documentID,
      spaceCUID,
      spaceTitle
    }
  }
}

export function setViewType (type, isTeam, isArchived) {
  return {
    type: ActionTypes.SET_VIEW_TYPE,
    data: {
      type,
      isTeam,
      isArchived
    }
  }
}

export function clearSelectedDocuments () {
  return {
    type: ActionTypes.CLEAR_SELECTED_DOCUMENTS,
    data: {}
  }
}

export function deselectDocuments (documents) {
  return {
    type: ActionTypes.DESELECT_DOCUMENTS,
    data: {
      documents
    }
  }
}

export function toggleHasSeenSpacesCTA (hasSeenSpacesCTA) {
  return {
    type: ActionTypes.TOGGLE_HAS_SEEN_SPACES_CTA,
    data: hasSeenSpacesCTA
  }
}

export function toggleHasSeenSpacesDocsCTA (hasSeenSpacesCTA) {
  return {
    type: ActionTypes.TOGGLE_HAS_SEEN_SPACES_DOCS_CTA,
    data: hasSeenSpacesCTA
  }
}

export function filterSpaces (searchTerm) {
  return {
    type: ActionTypes.FILTER_SPACES,
    data: searchTerm
  }
}

export function setSearchSpacesResourceLoading () {
  return {
    type: ActionTypes.SET_SPACES_SEARCH_RESOURCE_LOADING,
    data: {}
  }
}

export function toggleSelectDocument (type, id, currentSpaceID, title, extraDocuments = []) {
  return {
    type: ActionTypes.TOGGLE_SELECT_DOCUMENT,
    data: {
      type,
      id,
      currentSpaceID,
      title,
      extraDocuments
    }
  }
}

export function setActiveSelectedDocument (type, id) {
  return {
    type: ActionTypes.SET_ACTIVE_SELECTED_DOCUMENT,
    data: {
      type,
      id
    }
  }
}

export function updateSpaceTitle (title) {
  return {
    type: ActionTypes.UPDATE_SPACE_TITLE,
    data: title
  }
}

export function updateSpaceColor (color) {
  return {
    type: ActionTypes.UPDATE_SPACE_COLOR,
    data: color
  }
}

export function setShowFilters (show) {
  return {
    type: ActionTypes.SET_SHOW_FILTERS,
    data: show
  }
}

export function setShowGetInspired (show) {
  return {
    type: ActionTypes.SET_SHOW_GET_INSPIRED,
    data: show
  }
}

// In the case of displaying search results, we need to update filters but
// we only want to track analytics in the case of an explicit filter click action,
// so you can opt out of tracking a filter change event with the third arg here.
export function updateFilters (type, value, opts = { noTrack: false }) {
  return {
    type: ActionTypes.UPDATE_FILTERS,
    data: {
      type,
      value,
      opts
    }
  }
}

export function resetFilters () {
  return {
    type: ActionTypes.RESET_FILTERS
  }
}

export function gotoPage (page) {
  return {
    type: ActionTypes.GOTO_PAGE,
    data: {
      page
    }
  }
}

export function pageOpened ({ page, homeView }) {
  return {
    type: ActionTypes.PAGE_OPENED,
    data: {
      page,
      homeView,
      sidebarEnabled: true
    }
  }
}

export function toggleMoreMenu (type, id) {
  return {
    type: ActionTypes.TOGGLE_MORE_MENU,
    data: {
      type,
      id
    }
  }
}

export function toggleArchiveModal (document) {
  return {
    type: ActionTypes.TOGGLE_ARCHIVE_MODAL,
    data: {
      document
    }
  }
}

export function toggleDeleteModal (document) {
  return {
    type: ActionTypes.TOGGLE_DELETE_MODAL,
    data: {
      document
    }
  }
}

export function toggleTemplateGalleryModal () {
  return {
    type: ActionTypes.TOGGLE_TEMPLATE_GALLERY_MODAL,
    data: {}
  }
}

export function toggleMoveDocumentModal (doc = null) {
  return {
    type: ActionTypes.TOGGLE_MOVE_DOCUMENT_MODAL,
    data: {
      doc
    }
  }
}

export function toggleManageAccessModal () {
  return {
    type: ActionTypes.TOGGLE_MANAGE_ACCESS_MODAL,
    data: {}
  }
}

export function toggleAccessSetting (setting, value) {
  return {
    type: ActionTypes.TOGGLE_ACCESS_SETTING,
    data: {
      setting,
      value
    }
  }
}
export function selectSpaceResult (space) {
  return {
    type: ActionTypes.SELECT_SPACE_RESULT,
    data: space
  }
}

export function showAlert (type, message, retryLink = false) {
  return {
    type: ActionTypes.SHOW_ALERT,
    data: {
      type,
      message,
      retryLink
    }
  }
}

export function setBrowserInfo (osType, showMobileWarning) {
  return {
    type: ActionTypes.SET_BROWSER_INFO,
    data: {
      showMobileWarning,
      osType
    }
  }
}

export function loadStoredSorts () {
  return {
    type: ActionTypes.LOAD_STORED_SORTS
  }
}

// Error Modal
export function toggleErrorModal (message) {
  return {
    type: ActionTypes.TOGGLE_ERROR_MODAL,
    data: {
      message
    }
  }
}

// Create Modal
export function createModalOpen (subview) {
  return {
    type: ActionTypes.CREATE_MODAL_OPEN,
    data: {
      subview
    }
  }
}

// Create Modal from onboarding
export function createModalOpenOnboarding (subview) {
  return {
    type: ActionTypes.CREATE_MODAL_OPEN_ONBOARDING,
    data: {
      subview
    }
  }
}

export function createModalClose () {
  return {
    type: ActionTypes.CREATE_MODAL_CLOSE
  }
}

export function createModalSuccess (project) {
  return {
    type: ActionTypes.CREATE_MODAL_SUCCESS,
    data: project
  }
}

export function createModalFail (error) {
  return {
    type: ActionTypes.CREATE_MODAL_FAIL,
    data: error
  }
}

export function createModalRemoveError () {
  return {
    type: ActionTypes.CREATE_MODAL_REMOVE_ERROR
  }
}

export function createModalReset () {
  return {
    type: ActionTypes.CREATE_MODAL_RESET
  }
}

export function updateAccessManagement (data) {
  return {
    type: ActionTypes.UPDATE_ACCESS_MANAGEMENT,
    data
  }
}

export function setSpacePermission (isPublic) {
  return {
    type: ActionTypes.SET_SPACE_TYPE,
    data: {
      isPublic
    }
  }
}

// Analytics
export function analyticsSetContext (data) {
  return {
    type: ActionTypes.ANALYTICS_SET_CONTEXT,
    data
  }
}

export function trackCreateClick (documentSubview) {
  return {
    type: ActionTypes.ANALYTICS_TRACK_CREATE_CLICK,
    data: { documentType: getSubviewDocumentLabel(documentSubview) }
  }
}

// Space Details
export function descriptionLinkClicked () {
  return {
    type: ActionTypes.DESCRIPTION_LINK_CLICKED
  }
}

export function navigateActiveDocument (direction) {
  return {
    type: ActionTypes.NAVIGATE_ACTIVE_DOCUMENT,
    data: direction
  }
}

export function openBatchAddModal (addContext) {
  return {
    type: ActionTypes.OPEN_BATCH_ADD_MODAL,
    data: {
      addContext
    }
  }
}

export function openMigratedDocsModal () {
  return {
    type: ActionTypes.OPEN_MIGRATED_DOCS_MODAL,
    data: {}
  }
}

export function selectSpace (id, title, isPublic) {
  return {
    type: ActionTypes.SELECT_SPACE,
    data: {
      id,
      title,
      isPublic
    }
  }
}

export function joinedSpace (spaceId, pagingEnabled) {
  return {
    type: ActionTypes.JOINED_SPACE,
    data: {
      spaceId,
      pagingEnabled
    }
  }
}

export function setActiveDocument (index) {
  return {
    type: ActionTypes.SET_ACTIVE_DOCUMENT,
    data: index
  }
}

export function startDescriptionEdit (description) {
  const charCount = description.length

  return {
    type: ActionTypes.START_DESCRIPTION_EDIT,
    data: {
      charCount,
      contentState: (charCount <= 0) ? 'empty' : 'filled'
    }
  }
}

export function stopDescriptionEdit () {
  return {
    type: ActionTypes.STOP_DESCRIPTION_EDIT
  }
}

export function updateBatchFilterText (text) {
  return {
    type: ActionTypes.UPDATE_BATCH_FILTER_TEXT,
    data: text
  }
}

export function closeModal () {
  return {
    type: ActionTypes.CLOSE_MODAL
  }
}

export function removeSelectedDocument (index, type) {
  return {
    type: ActionTypes.REMOVE_SELECTED_DOCUMENT,
    data: {
      index,
      type
    }
  }
}

export function selectActiveDocument (doc) {
  return {
    type: ActionTypes.SELECT_ACTIVE_DOCUMENT,
    data: doc
  }
}

export function selectLastDocument () {
  return {
    type: ActionTypes.SELECT_LAST_DOCUMENT
  }
}

export function resetSpace () {
  return {
    type: ActionTypes.RESET_SPACE
  }
}

export function openManageAccessModal (open = true) {
  return {
    type: ActionTypes.OPEN_MANAGE_ACCESS_MODAL,
    data: open
  }
}

export function setDragSelections (docs, shiftKey) {
  return {
    type: ActionTypes.SET_DRAG_SELECTIONS,
    data: {
      docs,
      shiftKey
    }
  }
}

/**
 * Drop to Sidebar
 */
export function startDocumentDrag (first, allSelected, hasPublic, hasPrivate) {
  return {
    type: ActionTypes.START_DOCUMENT_DRAG,
    data: {
      first,
      allSelected,
      hasPublic,
      hasPrivate
    }
  }
}

export function endDocumentDrag (clearDocuments) {
  return {
    type: ActionTypes.END_DOCUMENT_DRAG,
    data: clearDocuments
  }
}

/**
 * Tile Breakpoints
 */

export const checkIfMQsChanged = () => ({
  type: ActionTypes.CHECK_IF_BROWSER_MQS_CHANGED
})

export const browserMQsChanged = (mqs) => ({
  type: ActionTypes.BROWSER_MQS_CHANGED,
  payload: mqs
})

// Toggle to show expanded space row to display projects within
export function showProjectInSpace (index, isOpen) {
  return {
    type: ActionTypes.SHOW_PROJECTS_IN_SPACE,
    data: {
      index,
      isOpen
    }
  }
}

export function setProjectCount (count) {
  return {
    type: ActionTypes.SET_PROJECT_COUNT,
    data: count
  }
}

export function expandSpaceInSidebar (spaceId) {
  return {
    type: ActionTypes.SIDEBAR_EXPAND_SPACE,
    data: {
      spaceId
    }
  }
}

export function setPaywall (paywall) {
  return {
    type: ActionTypes.SET_PAYWALL,
    data: paywall
  }
}
