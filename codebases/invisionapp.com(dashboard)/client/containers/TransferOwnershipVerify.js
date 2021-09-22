import { connect } from 'react-redux'
import VerifyAccount from '../components/modals/VerifyAccount'
import { selectUser, sendCode, clearValidation } from '../stores/user'
import {
  selectTransferOwnershipTo,
  transferOwnership as transferOwnershipAction,
  selectTeam
} from '../stores/team'
import { bindActionToPromise } from '../stores/utils/promiseActions'

const mapStateToProps = state => {
  return {
    user: selectUser(state),
    data: {
      toMember: selectTransferOwnershipTo(state)
    },
    team: selectTeam(state)
  }
}

const mapDispatchToProps = dispatch => {
  const transferOwnership = bindActionToPromise(dispatch, transferOwnershipAction.request)

  return {
    sendCode: () => {
      dispatch(sendCode.request('transferOwnership'))
    },
    onValidate: (code, done, data) => {
      transferOwnership({
        data: {
          action: 'transferOwnership',
          code,
          transferToUserId: data?.toMember?.userID
        }
      })
        .then(() => true)
        .catch(() => false)
        .then(isValid => {
          done(isValid)
        })
    },
    clearValidation: () => {
      dispatch(clearValidation())
    },
    onSuccess: () => {},
    shouldDisplay: data => {
      if (data?.toMember) {
        return true
      }

      return false
    }
  }
}

const TransferOwnershipVerify = connect(mapStateToProps, mapDispatchToProps)(VerifyAccount)

export default TransferOwnershipVerify
