import CreateBoardIcon from '../img/create-board.svg'
import CreateFreehandIcon from '../img/create-freehand.svg'
import CreatePrototypeIcon from '../img/create-prototype.svg'
import CreateSpaceIcon from '../img/create-space.svg'
import CreateRhombus from '../img/create-rhombus.svg'
import CreateSpecIcon from '../img/create-spec.svg'
import CreateStudioIcon from '../img/create-studio.svg'

export const BOARD = 'board'
export const FREEHAND = 'freehand'
export const HARMONY = 'harmony'
export const PRESENTATION = 'presentation'
export const PROJECT = 'project'
export const PROTOTYPE = 'prototype'
export const RHOMBUS = 'rhombus'
export const SPEC = 'spec'
export const STUDIO = 'studio'
export const SPACE = 'space'
export const TOOLS = 'tools'
export const UNKNOWN = 'unknown'

export const HARMONY_NAME = 'Design'
export const RHOMBUS_NAME = 'Doc'
export const RHOMBUS_NAME_PLURAL = 'Docs'

export const UNTITLED = 'Untitled'

export const CREATE_MODAL_TYPES = [
  {
    key: 'createSpace',
    title: 'Space',
    description: 'Keep related documents together, so they’re always easy to find and share.',
    isNew: true,
    buttonText: 'Create Space',
    icon: CreateSpaceIcon,
    iconPosition: {
      left: 0,
      top: 0
    },
    horzDescWidth: 'auto',
    showDuringOnboarding: false,
    image: '',
    label: SPACE
  }, {
    key: 'createProject',
    title: 'Project',
    description: 'Group documents together within your space.',
    isNew: true,
    buttonText: 'Create Project',
    iconPosition: {
      left: 0,
      top: 0
    },
    horzDescWidth: 'auto',
    showDuringOnboarding: false,
    image: '',
    label: PROJECT
  }, {
    key: 'prototypeTypes',
    title: 'Prototype',
    nuxTitle: 'Create a clickable Prototype',
    description: 'Mock up an interactive web, mobile, or wearable experience.',
    nuxDescription: 'Mock up interactive experiences, collect feedback, and get development specs to easily collaborate with your team.',
    isNew: false,
    buttonText: 'Create Prototype',
    nuxButtonText: 'Create new Prototype',
    icon: CreatePrototypeIcon,
    iconPosition: {
      left: 13,
      top: 12
    },
    horzDescWidth: 240,
    showDuringOnboarding: true,
    image: 'prototype-illustration',
    label: PROTOTYPE
  }, {
    key: 'boardTypes',
    title: 'Board',
    description: 'Curate a mood board, design story, or collection.',
    isNew: false,
    buttonText: 'Create Board',
    icon: CreateBoardIcon,
    iconPosition: {
      left: 12,
      top: 11
    },
    horzDescWidth: 270,
    showDuringOnboarding: true,
    image: 'board-illustration',
    label: BOARD
  }, {
    key: 'chooseTools',
    nuxTitle: 'Start with a design tool',
    nuxDescription: 'Download InVision Studio to design from scratch, or the Craft plugin to sync existing files from Sketch or Photoshop.',
    isNew: false,
    nuxButtonText: 'Compare design tools',
    iconPosition: {
      left: 12,
      top: 11
    },
    horzDescWidth: 246,
    showDuringOnboarding: true,
    image: 'download-tools-illustration',
    label: TOOLS
  }, {
    key: 'createFreehand',
    title: 'Freehand',
    nuxTitle: 'Share ideas in Freehand',
    description: 'Sketch, give feedback, or co-draw in real time.',
    nuxDescription: 'Draw, wireframe, and present on a digital whiteboard to make real-time collaboration a key part of your workflow.',
    isNew: false,
    buttonText: 'Create Freehand',
    nuxButtonText: 'Create new Freehand',
    icon: CreateFreehandIcon,
    iconPosition: {
      left: 9,
      top: 11
    },
    horzDescWidth: 246,
    showDuringOnboarding: true,
    image: 'freehand-illustration',
    label: FREEHAND
  }, {
    key: 'createRhombus',
    title: RHOMBUS_NAME,
    description: 'Combine text and visuals in one document.',
    isNew: true,
    buttonText: `Create ${RHOMBUS_NAME}`,
    icon: CreateRhombus,
    iconPosition: {
      left: 13,
      top: 12
    },
    horzDescWidth: 'auto',
    showDuringOnboarding: false,
    image: '',
    label: RHOMBUS_NAME
  },
  {
    key: 'createSpec',
    title: 'Spec',
    description: 'Provide all the context you need for handing off final designs',
    isNew: true,
    buttonText: 'Create Spec',
    icon: CreateSpecIcon,
    iconPosition: {
      left: 13,
      top: 12
    },
    horzDescWidth: 'auto',
    showDuringOnboarding: true,
    image: '',
    label: SPEC
  },
  {
    key: 'createStudio',
    title: 'Studio',
    description: 'Design and prototype using Studio',
    isNew: true,
    buttonText: 'Create Design',
    icon: CreateStudioIcon,
    iconPosition: {
      left: 13,
      top: 12
    },
    horzDescWidth: 'auto',
    showDuringOnboarding: true,
    image: '',
    label: STUDIO
  }
]

export const DOCUMENT_TYPES = {
  [PROTOTYPE]: {
    label: 'Prototype',
    moreMenu: {
      archive: true,
      duplicate: false, // TODO set to true in v7.1 to enable duplicating
      delete: true,
      move: true
    },
    deleteModal: {
      title: 'Are you sure?',
      text: 'Once you delete this prototype, nobody will be able to open it, and there’s no turning back.',
      deleteButton: 'Delete',
      cancelButton: 'Never Mind'
    },
    duplicateText: 'Includes screens, hotspots, templates and assets. This duplicate will not include conversations or collaborators.'
  },
  [BOARD]: {
    label: 'Board',
    moreMenu: {
      archive: true,
      duplicate: false, // TODO set to true in v7.1 to enable duplicating
      delete: true,
      move: true
    },
    deleteModal: {
      title: 'Are you sure?',
      text: 'Once you delete this board, nobody will be able to open it, and there’s no turning back.',
      deleteButton: 'Delete',
      cancelButton: 'Never Mind'
    },
    duplicateText: 'Includes all files and assets. This duplicate will not include conversations or collaborators.'
  },
  [PROJECT]: {
    label: 'Project',
    moreMenu: {
      archive: false,
      duplicate: false,
      delete: true
    },
    deleteModal: {
      title: 'Are you sure?',
      text: 'Once deleted, people won\'t be able to open it. All documents will be moved to {spaceName}',
      deleteButton: 'Yes, Delete',
      cancelButton: 'Never Mind'
    },
    duplicateText: ''
  },
  [SPACE]: {
    label: 'Space',
    moreMenu: {
      archive: false,
      duplicate: false,
      delete: true
    },
    deleteModal: {
      title: 'Are you sure?',
      text: 'Once you delete this space, people won’t be able to open it, but will still keep any documents they’ve already opened.',
      textWithProject: 'Once you delete this Space, people won’t be able to open it or the Projects inside of it, but will still keep any documents they have access to.',
      deleteButton: 'Yes, Delete ',
      cancelButton: 'Never Mind'
    },
    duplicateText: ''
  },
  [FREEHAND]: {
    label: 'Freehand',
    moreMenu: {
      archive: true,
      duplicate: false, // TODO set to true in v7.1 to enable duplicating
      delete: true,
      move: true
    },
    deleteModal: {
      title: 'Are you sure?',
      text: 'Once you delete this freehand, nobody will be able to open it, and there’s no turning back.',
      deleteButton: 'Delete',
      cancelButton: 'Never Mind'
    },
    duplicateText: 'Includes all freehand documents.'
  },
  [RHOMBUS]: {
    label: RHOMBUS_NAME,
    moreMenu: {
      archive: true,
      duplicate: false, // TODO set to true in v7.1 to enable duplicating
      delete: false, // TODO set to true in v7.1 to enable deleting
      move: true
    },
    deleteModal: {
      title: 'Are you sure?',
      text: `Once you delete this ${RHOMBUS_NAME}, nobody will be able to open it, and there’s no turning back.`,
      deleteButton: 'Delete',
      cancelButton: 'Never Mind'
    },
    duplicateText: 'Includes all rhombus documents.'
  },
  [SPEC]: {
    label: 'Spec',
    moreMenu: {
      archive: true,
      duplicate: false,
      delete: true,
      move: true
    },
    deleteModal: {
      title: 'Are you sure?',
      text: 'Once you delete this spec, nobody will be able to open it, and there’s no turning back.',
      deleteButton: 'Delete',
      cancelButton: 'Never Mind'
    },
    duplicateText: ''
  },
  [PRESENTATION]: {
    label: 'Prototype',
    moreMenu: {
      archive: true,
      duplicate: false, // TODO set to true in v7.1 to enable duplicating
      delete: true,
      move: true
    },
    deleteModal: {
      title: 'Are you sure?',
      text: 'Once you delete this prototype, nobody will be able to open it, and there’s no turning back.',
      deleteButton: 'Delete',
      cancelButton: 'Never Mind'
    },
    duplicateText: "Includes all prototype's documents."
  },
  [HARMONY]: {
    label: 'Studio Cloud File',
    moreMenu: {
      archive: false,
      duplicate: false, // TODO set to true in v7.1 to enable duplicating
      delete: true,
      move: true
    },
    deleteModal: {
      title: 'Are you sure?',
      text: 'Once you delete this design, nobody will be able to open it, and there’s no turning back.',
      deleteButton: 'Delete',
      cancelButton: 'Never Mind'
    },
    duplicateText: 'Includes all design documents.'
  },
  external: {
    label: 'External Document',
    moreMenu: {
      archive: false,
      delete: true,
      move: true,
      share: false,
      deleteLabel: 'Remove'
    },
    deleteModal: {
      title: 'Are you sure?',
      text: 'You\'ll remove this file from InVision, but it will not be deleted on its native platform',
      deleteButton: 'Yes, Remove',
      cancelButton: 'Never Mind'
    },
    duplicateText: 'Includes screens, hotspots, templates and assets. This duplicate will not include conversations or collaborators.'
  }
}

export const PERMISSIONS_EMPTY_SET = {
  canArchive: false,
  canDelete: false,
  canDuplicate: false,
  canEdit: false,
  canMove: false
}

export const NO_DOC_CREATION = 'To create prototypes or boards, please ask a team admin to change your enterprise seat type.'
export const FREEHAND_ONLY = 'To create prototypes, boards, or specs, please ask a team admin to change your enterprise seat type.'
