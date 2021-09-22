import React from 'react'
import FreehandNoResults from '../components/Document/FreehandNoResults'

export const DOCUMENTS_PER_PAGE = 40

export const FILTER_ALL = 'All documents'
export const FILTER_HARMONY = 'Designs'
export const FILTER_PROTOTYPES = 'Prototypes'
export const FILTER_BOARDS = 'Boards'
export const FILTER_SPECS = 'Specs'
export const FILTER_FREEHANDS = 'Freehands'
export const FILTER_RHOMBUS = 'Docs'

// FreehandX Filters
export const FILTER_INVISION = 'InVision'
export const FILTER_ARCHIVED_ONLY = 'Archived only'
export const FILTER_CREATED_BY_ANYONE = 'Created by anyone'
export const FILTER_CREATED_BY_ME = 'Created by me'

export const FILTER_PATHS = {
  boards: FILTER_BOARDS,
  designs: FILTER_HARMONY,
  docs: FILTER_RHOMBUS,
  freehands: FILTER_FREEHANDS,
  prototypes: FILTER_PROTOTYPES,
  specs: FILTER_SPECS,
  all: FILTER_ALL
}

export const FILTER_URL_PATHS = {
  [FILTER_ALL]: 'all',
  [FILTER_BOARDS]: 'boards',
  [FILTER_HARMONY]: 'designs',
  [FILTER_RHOMBUS]: 'docs',
  [FILTER_FREEHANDS]: 'freehands',
  [FILTER_PROTOTYPES]: 'prototypes',
  [FILTER_SPECS]: 'specs'
}

export const FILTER_CREATE_TYPES = {
  [FILTER_BOARDS]: 'board',
  [FILTER_FREEHANDS]: 'freehand',
  [FILTER_HARMONY]: 'harmony',
  [FILTER_PROTOTYPES]: 'prototype',
  [FILTER_RHOMBUS]: 'rhombus',
  [FILTER_SPECS]: 'spec'
}

export const FILTER_CREATE_STATES = {
  [FILTER_BOARDS]: 'boardTypes',
  [FILTER_FREEHANDS]: 'createFreehand',
  [FILTER_PROTOTYPES]: 'prototypeTypes',
  [FILTER_SPECS]: 'createSpec',
  [FILTER_HARMONY]: 'createHarmony'
}

export const FILTER_CREATE_TITLES = {
  [FILTER_BOARDS]: 'Create Board',
  [FILTER_FREEHANDS]: 'Create Freehand',
  [FILTER_PROTOTYPES]: 'Create Prototype',
  [FILTER_SPECS]: 'Create Spec',
  [FILTER_HARMONY]: 'Create Design'
}

export const FILTER_FREEHANDX_TITLES = {
  [FILTER_ALL]: 'All documents',
  [FILTER_INVISION]: 'InVision documents',
  [FILTER_ARCHIVED_ONLY]: 'Archived documents'
}

/**
 * This can store custom empty state per filtered document
 * type
 */
export const FILTER_EMPTY_STATES = {
  // [FILTER_HARMONY]: (<div>I am empty</div>)
  [FILTER_FREEHANDS]: (<FreehandNoResults />)
}

export const ALL_FILTER_TYPES = [FILTER_ALL, FILTER_PROTOTYPES, FILTER_HARMONY, FILTER_FREEHANDS, FILTER_BOARDS, FILTER_RHOMBUS, FILTER_SPECS]
export const DEFAULT_FILTER_TYPE = ALL_FILTER_TYPES[0]
export const ALL_FREEHAND_X_FILTER_TYPES = [FILTER_ALL, FILTER_INVISION]
export const CREATED_BY_FILTER_TYPE = [FILTER_CREATED_BY_ANYONE, FILTER_CREATED_BY_ME]
