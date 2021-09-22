import { connect } from 'react-redux'
import once from 'lodash/once'
import App from '../layouts/App'
import { selectLogo } from '../stores/logo'
import { selectTeam, checkPaywall } from '../stores/team'
import { hideFlash, showFlash } from '../stores/flash'
import { undo } from '../stores/undo'
import { selectPermissions } from '../stores/permissions'
import { updateLocation } from '../stores/location'
import { selectFeatureFlags } from '../stores/featureFlags'
import { blockInviteUsers, selectPaywall } from '../auth/blockerSelectors'
import { getSearchByKey } from '../helpers/url'
import app from '../stores/app'
import { clickedInvite } from '../stores/pageHeader'

const mapStateToProps = state => {
  return {
    logo: selectLogo(state),
    team: selectTeam(state),
    permissions: selectPermissions(state),
    flash: state.flash,
    showPaywall: blockInviteUsers(state),
    featureFlags: selectFeatureFlags(state),
    lockedBodyScroll: app.selectLockedBodyScroll(state),
    paywall: selectPaywall(state)
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    checkPaywall(paywallResponse) {
      dispatch(checkPaywall.request())
      paywallResponse
        .checkPaywall('invite-members.blocker.v1')
        .then(response => dispatch(checkPaywall.success(response, paywallResponse)))
    },
    checkAction() {
      const action = getSearchByKey('action')
      let message
      switch (true) {
        case action.REQUEST_ACCESS_SETTINGS_UPDATED:
          message = 'Request Access settings have been updated'
          break
        case action.SCIM_DISABLED:
          message = 'SCIM provisioning has been disabled'
          break
        case action['2FA_DISABLED']:
          message = 'Two-step authentication was successfully turned off'
          break
        case action['2FA_TEAM_ENABLED']:
          message = 'Two-step authentication has been enabled for your team'
          break
        case action['2FA_TEAM_DISABLED']:
          message = 'Two-step authentication has been disabled for your team'
          break
        default:
      }

      if (message) {
        dispatch(
          showFlash({
            message,
            status: 'success'
          })
        )
      }
    },
    flashUndo(undoId) {
      dispatch(hideFlash())
      dispatch(undo(undoId))
    },
    startLocationListener: once(() => {
      const updateLocationStore = () =>
        dispatch(updateLocation(props.router.getCurrentLocation()))

      props.router.listen(() => updateLocationStore())
      updateLocationStore()
    }),
    handleInviteClick() {
      dispatch(clickedInvite())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
