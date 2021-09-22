/**
 * This is a prototype for UI testing.  This should never be seen
 * by customers :)
 */
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as actionCreators from '../../actions/index'

import CreateModalContainer from '../Modals/Create/CreateModalContainer'
import DeleteContainer from '../Modals/Delete/DeleteContainer'
import ModalPortal from '../Modals/ModalPortal'

import mapDispatchToServerAction from '../../utils/mapDispatchToServerActions'

const ModalWrapper = ({ projectId }) => {
  const dispatch = useDispatch()

  const [serverActions] = useState(mapDispatchToServerAction(dispatch))
  const [actions] = useState(bindActionCreators(actionCreators, dispatch))

  const filteredState = useSelector(state => ({
    account: state.account,
    config: state.config,
    createModal: state.createModal,
    space: state.space,
    tile: state.tile,
    filters: state.filters
  }))

  return (
    <>
      {filteredState.tile.deleteModal.showModal
        ? <DeleteContainer
          account={filteredState.account}
          actions={actions}
          config={filteredState.config}
          document={filteredState.tile.deleteModal.document}
          handleCloseModal={() => actions.toggleDeleteModal({})}
          isDeleting={filteredState.tile.deleteModal.isDeleting}
          serverActions={serverActions}
        />
        : null}

      {filteredState.createModal.showModal
        // During the onboarding walkthrough, we need the transition to happen
        // immediately as it's the first thing a new user sees
        ? <ModalPortal noScroll transitionTime={1000}>
          <CreateModalContainer
            account={filteredState.account}
            actions={actions}
            config={filteredState.config}
            viewType={filteredState.filters.viewType}
            createModal={filteredState.createModal}
            handleCancelModal={() => actions.createModalClose()}
            hasRhombus={false}
            hasSpaces
            serverActions={serverActions}
            projectId={projectId}
            space={filteredState.space}
            user={filteredState.account.user}
            filters={filteredState.filters}
          />
        </ModalPortal>
        : null}
    </>
  )
}

export default ModalWrapper
