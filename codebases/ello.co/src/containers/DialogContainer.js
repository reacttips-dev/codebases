import { connect } from 'react-redux'
import Dialog from '../components/dialogs/Dialog'
import { closeAlert } from '../actions/modals'

export default connect(
  null,
  { closeAlert },
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    onClick: dispatchProps.closeAlert,
  }),
)(Dialog)
