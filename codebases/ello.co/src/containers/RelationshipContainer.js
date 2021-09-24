import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import { createSelector } from 'reselect'
import { openModal, closeModal } from '../actions/modals'
import { updateRelationship } from '../actions/relationships'
import { flagUser } from '../actions/user'
import BlockMuteDialog from '../components/dialogs/BlockMuteDialog'
import FlagDialog from '../components/dialogs/FlagDialog'
import BlockMuteButton from '../components/relationships/BlockMuteButton'
import Relationship from '../components/relationships/Relationship'
import FollowButton from '../components/relationships/FollowButton'
import { RELATIONSHIP_PRIORITY } from '../constants/relationship_types'
import { selectIsLoggedIn } from '../selectors/authentication'
import { selectDeviceSize } from '../selectors/gui'
import { selectPathname, selectPreviousPath } from '../selectors/routing'
import {
  selectUserId,
  selectUserRelationshipPriority,
  selectUserUsername,
} from '../selectors/user'

const selectRelationshipPriority = (state, props) => props.relationshipPriority
const selectHasBlockMuteButton = (state, props) => props.hasBlockMuteButton

const selectOnClickCallback = createSelector(
  [selectIsLoggedIn, selectRelationshipPriority], (isLoggedIn, relationshipPriority) => {
    if (!isLoggedIn) { return 'onOpenSignupModal' }
    const isBlockedOrMuted = (relationshipPriority &&
      relationshipPriority === RELATIONSHIP_PRIORITY.BLOCK) ||
      relationshipPriority === RELATIONSHIP_PRIORITY.MUTE
    return isBlockedOrMuted ? 'onOpenBlockMuteModal' : 'onRelationshipUpdate'
  },
)

const selectShouldRenderBlockMuteButton = createSelector(
  [selectIsLoggedIn, selectRelationshipPriority, selectHasBlockMuteButton],
  (isLoggedIn, relationshipPriority, hasBlockMuteButton) =>
    isLoggedIn && hasBlockMuteButton && relationshipPriority !== RELATIONSHIP_PRIORITY.SELF,
)

// TODO: move this to a selector and test it
export function getNextBlockMutePriority(currentPriority, requestedPriority) {
  switch (currentPriority) {
    case RELATIONSHIP_PRIORITY.BLOCK:
    case RELATIONSHIP_PRIORITY.MUTE:
      return RELATIONSHIP_PRIORITY.INACTIVE
    default:
      switch (requestedPriority) {
        case RELATIONSHIP_PRIORITY.BLOCK:
          return RELATIONSHIP_PRIORITY.BLOCK
        case RELATIONSHIP_PRIORITY.MUTE:
          return RELATIONSHIP_PRIORITY.MUTE
        default:
          return RELATIONSHIP_PRIORITY.INACTIVE
      }
  }
}

// TODO: Try and get rid of deviceSize
function mapStateToProps(state, props) {
  const onClickCallback = selectOnClickCallback(state, props)
  const shouldRenderBlockMute = selectShouldRenderBlockMuteButton(state, props)
  return {
    deviceSize: selectDeviceSize(state),
    id: selectUserId(state, props),
    onClickCallback,
    pathname: selectPathname(state),
    previousPath: selectPreviousPath(state),
    relationshipPriority: selectUserRelationshipPriority(state, props),
    shouldRenderBlockMute,
    username: selectUserUsername(state, props),
  }
}

class RelationshipContainer extends PureComponent {

  static propTypes = {
    className: PropTypes.string,
    deviceSize: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    id: PropTypes.string,
    onClickCallback: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    previousPath: PropTypes.string,
    relationshipPriority: PropTypes.string,
    shouldRenderBlockMute: PropTypes.bool,
    username: PropTypes.string,
  }

  static defaultProps = {
    className: null,
    id: null,
    previousPath: null,
    relationshipPriority: null,
    shouldRenderBlockMute: false,
    username: null,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func,
  }

  onCloseModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  onConfirmBlockUser = () => {
    const { dispatch, id, previousPath, relationshipPriority } = this.props
    this.onRelationshipUpdate({
      userId: id,
      priority: getNextBlockMutePriority(relationshipPriority, RELATIONSHIP_PRIORITY.BLOCK),
      existing: relationshipPriority,
    })
    this.onCloseModal()
    if (relationshipPriority !== RELATIONSHIP_PRIORITY.BLOCK) {
      dispatch(replace(previousPath || '/'))
    }
  }

  onConfirmFlagUser = () => {
    const { deviceSize, dispatch } = this.props
    this.onCloseModal()
    dispatch(openModal(
      <FlagDialog
        deviceSize={deviceSize}
        onConfirm={this.onCloseModal}
        onResponse={this.onUserWasFlagged}
      />))
  }

  onConfirmMuteUser = () => {
    const { id, relationshipPriority } = this.props
    this.onRelationshipUpdate({
      userId: id,
      priority: getNextBlockMutePriority(relationshipPriority, RELATIONSHIP_PRIORITY.MUTE),
      existing: relationshipPriority,
    })
    this.onCloseModal()
  }

  onOpenBlockMuteModal = () => {
    const { dispatch, relationshipPriority, username } = this.props
    dispatch(openModal(
      <BlockMuteDialog
        isBlockActive={relationshipPriority === RELATIONSHIP_PRIORITY.BLOCK}
        isMuteActive={relationshipPriority === RELATIONSHIP_PRIORITY.MUTE}
        onBlock={this.onConfirmBlockUser}
        onFlag={this.onConfirmFlagUser}
        onMute={this.onConfirmMuteUser}
        username={username}
      />
      , 'isDangerZone'))
  }

  onOpenSignupModal = () => {
    const { onClickOpenRegistrationRequestDialog } = this.context
    onClickOpenRegistrationRequestDialog('follow-button')
  }

  onRelationshipUpdate = ({ userId, priority, existing }) => {
    const { dispatch, pathname } = this.props
    const isInternal = !!(pathname && (/^\/onboarding/).test(pathname))
    dispatch(updateRelationship(userId, priority, existing, isInternal))
  }

  onUserWasFlagged = ({ flag }) => {
    const { dispatch, username } = this.props
    dispatch(flagUser(username, flag))
  }

  render() {
    const { className, id, relationshipPriority } = this.props
    const { onClickCallback, shouldRenderBlockMute } = this.props
    return (
      <Relationship
        className={className}
        data-priority={relationshipPriority}
      >
        {shouldRenderBlockMute &&
          <BlockMuteButton
            className={className}
            onClick={this.onOpenBlockMuteModal}
            priority={relationshipPriority}
            userId={id}
          />
        }
        {!shouldRenderBlockMute &&
          <FollowButton
            className={className}
            onClick={this[onClickCallback]}
            priority={relationshipPriority}
            userId={id}
          />
        }
      </Relationship>
    )
  }
}

export default connect(mapStateToProps)(RelationshipContainer)

