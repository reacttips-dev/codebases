import { routeReducer } from 'redux-simple-router'

import account from './account'
import alert from './alert'
import analytics from './analytics'
import batch from './batch'
import config from './config'
import createModal from './create-modal'
import documents from './documents'
import error from './error'
import filters from './filters'
import icon from './icon'
import metadata from './metadata'
import modals from './modals'
import mqs from './mqs'
import paywall from './paywall'
import projects from './projects'
import project from './project'
import selected from './selected'
import space from './space'
import spaces from './spaces'
import subscription from './subscription'
import templateGalleryModal from './template-gallery-modal'
import tile from './tile'

const reducers = () => ({
  routing: routeReducer,

  account,
  alert,
  analytics,
  batch,
  config,
  createModal,
  documents,
  error,
  filters,
  icon,
  metadata,
  modals,
  mqs,
  paywall,
  projects,
  project,
  selected,
  space,
  spaces,
  subscription,
  templateGalleryModal,
  tile
})

export default reducers
