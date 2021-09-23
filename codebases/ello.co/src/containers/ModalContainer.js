import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Mousetrap from 'mousetrap'
import { closeModal, closeAlert } from '../actions/modals'
import { Modal } from '../components/modals/Modal'
import { SHORTCUT_KEYS } from '../constants/application_types'

export function mapStateToProps(state) {
  return {
    classList: state.modal.get('classList'),
    component: state.modal.get('component'),
    isActive: state.modal.get('isActive'),
    kind: state.modal.get('kind'),
  }
}

class ModalContainer extends PureComponent {
  static propTypes = {
    classList: PropTypes.string,
    component: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    kind: PropTypes.string.isRequired,
  }

  static defaultProps = {
    classList: null,
    component: null,
  }

  componentDidMount() {
    Mousetrap.bind(SHORTCUT_KEYS.ESC, () => { this.close() })
  }

  componentDidUpdate() {
    const { isActive, kind } = this.props
    if (kind === 'Modal' && isActive) {
      document.body.classList.add('isModalActive')
    } else if (kind === 'Modal' && !isActive) {
      document.body.classList.remove('isModalActive')
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind(SHORTCUT_KEYS.ESC)
  }

  onClickModal = (e) => {
    const classList = e.target.classList
    if (classList.contains('Modal') ||
        classList.contains('Alert') ||
        classList.contains('CloseModal')) {
      this.close()
    }
  }

  close() {
    const { dispatch, isActive, kind } = this.props
    if (isActive) {
      dispatch(kind === 'Modal' ? closeModal() : closeAlert())
    }
  }

  render() {
    const { isActive, classList, component, kind } = this.props
    const elementProps = { classList, component, isActive, kind }
    if (isActive) {
      elementProps.onClickModal = this.onClickModal
    }
    return <Modal {...elementProps} />
  }
}

export default connect(mapStateToProps)(ModalContainer)

