import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import styled from 'styled-components'
import ModalContent from '../Modal/ModalContent'
import { selectTransferOwnershipTo } from '../../stores/team'
import Loading from '../Loading'
import { getMemberName } from '../../stores/members'

class TransferOwnershipConfirm extends React.Component {
  constructor(props) {
    super(props)

    // Let the spinner animate for 2.5s. Seemed like a good amount of time before suceeding
    setTimeout(this.requestCloseModal, 2500)
  }

  state = {
    success: false
  }

  requestCloseModal = () => {
    this.setState({ success: true })
    // Wait 1s after the success checkmark is shown, then close the portal
    setTimeout(this.closePortal, 1000)
  }

  closePortal = () => {
    browserHistory.push(this.props.route.afterVerify)
  }

  render() {
    const { isVisible, transferUser } = this.props
    const name = getMemberName(transferUser) || 'Unknown'

    return (
      <StyledModal closePortal={this.closePortal} isVisible={isVisible}>
        <Loading
          textLoading="Passing the baton..."
          textSuccess="You are all set!"
          subtitleSuccess={`${name} is now the owner, and youʼre an admin`}
          visible
          showLogo
          success={this.state.success}
        />
      </StyledModal>
    )
  }
}

const StyledModal = styled(ModalContent)`
  .modal-content {
    width: 100%;
    height: 100%;
  }
`

const mapStateToProps = state => ({
  transferUser: selectTransferOwnershipTo(state)
})

export default connect(mapStateToProps)(TransferOwnershipConfirm)
