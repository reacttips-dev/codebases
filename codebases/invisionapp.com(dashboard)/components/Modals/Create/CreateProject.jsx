import React from 'react'
import PropTypes from 'prop-types'

import { NewUserExperience } from '@invisionapp/nux-tools-ui'
import { trackEvent } from '../../../utils/analytics'

import {
  BOARD,
  FREEHAND,
  PROTOTYPE,
  SPEC
} from '../../../constants/DocumentTypes'

import typeStyles from '../../../css/modals/project-types.css'

const CreateProject = (props) => {
  const {
    canCreateDocuments,
    canCreateSpaces,
    documentPermissions,
    hasSpaces,
    isHiding,
    onboardingRole,
    onClose,
    onOptionClick,
    showStudio,
    showSpec
  } = props

  const allowedOptions = getCreationOptions({
    canCreateDocuments,
    canCreateSpaces,
    documentPermissions,
    hasSpaces,
    showSpec
  })

  return (
    <div className={typeStyles.root}>
      <NewUserExperience
        allowedOptions={allowedOptions}
        isHiding={isHiding}
        onClose={onClose}
        onOptionClick={onOptionClick}
        showStudio={showStudio}
        track={trackEvent}
        userRole={onboardingRole}
      />
    </div>
  )
}

CreateProject.propTypes = {
  canCreateDocuments: PropTypes.bool,
  canCreateSpaces: PropTypes.bool,
  documentPermissions: PropTypes.object,
  hasSpaces: PropTypes.bool,
  isHiding: PropTypes.bool,
  onboardingRole: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onOptionClick: PropTypes.func,
  showStudio: PropTypes.bool,
  showSpec: PropTypes.bool
}

const getCreationOptions = ({
  canCreateDocuments = false,
  canCreateSpaces = false,
  documentPermissions = {},
  hasSpaces = false,
  showSpec = false
}) => {
  const options = []
  const optionTypes = {
    BOARD: 'boardTypes',
    FREEHAND: 'createFreehand',
    PROTOTYPE: 'prototypeTypes',
    SPACE: 'createSpace',
    SPEC: 'createSpec'
  }

  if (canCreateSpaces && hasSpaces) {
    options.push(optionTypes.SPACE)
  }

  if (canCreateDocuments) {
    if (documentPermissions[PROTOTYPE]) options.push(optionTypes.PROTOTYPE)
    if (documentPermissions[BOARD]) options.push(optionTypes.BOARD)
    if (documentPermissions[FREEHAND]) options.push(optionTypes.FREEHAND)
  }

  if (showSpec) {
    if (documentPermissions[SPEC]) options.push(optionTypes.SPEC)
  }

  return options
}

export default CreateProject
