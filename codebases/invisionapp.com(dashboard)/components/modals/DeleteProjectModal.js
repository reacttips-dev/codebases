import React from 'react'
import PropTypes from 'prop-types'

const DeleteProjectModal = ({
  spaceName
}) => {
  return (
    <>
      Once deleted, people won't be able to open it. All documents will be moved to <strong>{spaceName}</strong>.
    </>
  )
}

DeleteProjectModal.propTypes = {
  spaceName: PropTypes.string.isRequired
}

export default DeleteProjectModal
