import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { is } from 'immutable'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { trackEvent } from '../actions/analytics'
import { checkAvailability, resetAvailability } from '../actions/profile'
import { getEmailStateFromClient, getEmailStateFromServer } from '../components/forms/Validators'
import { Footer } from '../components/footer/FooterRenderables'
import { LOAD_NEXT_CONTENT_REQUEST, SET_LAYOUT_MODE, V3 } from '../constants/action_types'
import { FOOTER_LINKS as links } from '../constants/locales/en'
import { FORM_CONTROL_STATUS as STATUS } from '../constants/status_types'
import { isIOS, scrollToPosition } from '../lib/jello'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectIsGridMode,
  selectIsLayoutToolHidden,
  selectIsMobile,
} from '../selectors/gui'
import { selectIsModalActive } from '../selectors/modal'
import { selectAvailability } from '../selectors/profile'
import {
  selectPathname,
  selectViewNameFromRoute,
  selectIsPostDetail,
} from '../selectors/routing'
import { selectStreamType } from '../selectors/stream'

let emailValue = ''

function mapStateToProps(state, props) {
  const streamType = selectStreamType(state)
  const pathname = selectPathname(state)
  const isEditorial = selectViewNameFromRoute(state, props) === 'editorial'
  const isPostDetail = selectIsPostDetail(state, props)
  const isDiscoverAll = selectViewNameFromRoute(state, props) === 'discoverAll'
  let isLayoutToolHidden = selectIsLayoutToolHidden(state, props)
  // hide the layout tool on the editorial homepage
  if (isEditorial) { isLayoutToolHidden = true }
  return {
    availability: selectAvailability(state),
    formActionPath: checkAvailability().payload.endpoint.path,
    isEditorial,
    isPostDetail,
    isDiscoverAll,
    isGridMode: selectIsGridMode(state),
    isLayoutToolHidden,
    isLoggedIn: selectIsLoggedIn(state),
    isMobile: selectIsMobile(state),
    isModalActive: selectIsModalActive(state),
    isPaginatoring: streamType === LOAD_NEXT_CONTENT_REQUEST ||
      streamType === V3.LOAD_NEXT_CONTENT_REQUEST,
    pathname,
  }
}

class FooterContainer extends Component {
  static propTypes = {
    availability: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    formActionPath: PropTypes.string.isRequired,
    isDiscoverAll: PropTypes.bool.isRequired,
    isEditorial: PropTypes.bool.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isLayoutToolHidden: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    isModalActive: PropTypes.bool.isRequired,
    isPaginatoring: PropTypes.bool.isRequired,
    isPostDetail: PropTypes.bool.isRequired,
    pathname: PropTypes.string.isRequired,
  }

  static defaultProps = {
    availability: null,
  }

  static childContextTypes = {
    onClickScrollToTop: PropTypes.func.isRequired,
    onClickToggleLayoutMode: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onSubmit: PropTypes.func,
  }

  getChildContext() {
    const { isLoggedIn } = this.props
    return {
      onClickScrollToTop: this.onClickScrollToTop,
      onClickToggleLayoutMode: this.onClickToggleLayoutMode,
      onBlur: !isLoggedIn ? this.onBlur : null,
      onChange: !isLoggedIn ? this.onChange : null,
      onFocus: !isLoggedIn ? this.onFocus : null,
      onSubmit: !isLoggedIn ? this.onSubmit : null,
    }
  }

  componentWillMount() {
    this.state = {
      emailStatus: STATUS.INDETERMINATE,
      formMessage: '',
      formStatus: STATUS.INDETERMINATE,
      isFormDisabled: true,
      isFormFocused: false,
    }
    emailValue = ''
  }

  componentWillReceiveProps(nextProps) {
    const { availability, isModalActive } = nextProps
    if (!availability || isModalActive) { return }
    if (availability.has('email')) {
      this.validateEmailResponse(availability)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { isLoggedIn } = this.props
    return !is(nextProps.availability, this.props.availability) ||
      ['isGridMode', 'isPostDetail', 'isDiscoverAll', 'isLayoutToolHidden', 'isLoggedIn', 'isMobile', 'isPaginatoring'].some(prop =>
        nextProps[prop] !== this.props[prop],
      ) ||
      (!isLoggedIn && ['emailStatus', 'formMessage', 'formStatus', 'isFormDisabled', 'isFormFocused'].some(prop =>
        nextState[prop] !== this.state[prop],
      ))
  }

  onChange = ({ FooterEmailInput: email }) => {
    emailValue = email
    const { emailStatus, isFormDisabled, formStatus } = this.state
    const currentStatus = emailStatus
    const clientState = getEmailStateFromClient({ value: email, currentStatus, formStatus })
    if (formStatus !== STATUS.INDETERMINATE) {
      this.setState({ formStatus: STATUS.INDETERMINATE, formMessage: '' })
    }
    if (clientState.status === STATUS.SUCCESS && isFormDisabled) {
      this.setState({ emailStatus: STATUS.SUCCESS, isFormDisabled: false })
      return
    }
    if (currentStatus !== clientState.status) {
      this.setState({
        emailStatus: clientState.status,
        isFormDisabled: true,
      })
    }
  }

  // Only happens on iOS
  onBlur = () => {
    this.setState({ isFormFocused: false })
    if (isIOS() && document && document.body) {
      document.body.classList.remove('isModalActive')
    }
  }

  // Only happens on iOS
  onFocus = () => {
    if (isIOS() && document && document.body) {
      document.body.classList.add('isModalActive')
    }
    this.setState({ isFormFocused: true })
  }

  onClickScrollToTop = () => {
    scrollToPosition(0, 0)

    // scroll the post detail panel and sidebar (if they exists)
    const postList = document.getElementsByClassName('PostList')
    const postSideBar = document.getElementsByClassName('PostSideBar')
    if (postList.length) {
      scrollToPosition(0, 0, { el: postList[0] })
    }
    if (postSideBar.length) {
      scrollToPosition(0, 0, { el: postSideBar[0] })
    }
  }

  onClickToggleLayoutMode = () => {
    const { dispatch, isGridMode } = this.props
    const newMode = isGridMode ? 'list' : 'grid'
    dispatch({ type: SET_LAYOUT_MODE, payload: { mode: newMode } })
  }

  onSubmit = (e: Event) => {
    const { dispatch } = this.props
    e.preventDefault()
    dispatch(checkAvailability({ email: emailValue, is_signup: true }))
  }

  validateEmailResponse(availability) {
    // only validate if we are in the footer input
    if (!get(document, 'activeElement.classList', { contains: () => false }).contains('inFooter')) { return }
    const { dispatch, pathname } = this.props
    const { formStatus } = this.state
    const newState = getEmailStateFromServer({ availability, currentStatus: formStatus })
    if (newState.status === STATUS.SUCCESS) {
      this.setState({ formStatus: STATUS.SUCCESS, formMessage: 'Subscribed. See you tomorrow' })
      dispatch(trackEvent('Newsletter_signup_footer', { pathname }))
      dispatch(resetAvailability())
      setTimeout(() => {
        const el = document.getElementById('FooterEmailInput')
        // $FlowFixMe
        if (el) { el.value = '' }
        emailValue = ''
        this.setState({
          emailStatus: STATUS.INDETERMINATE,
          formMessage: '',
          formStatus: STATUS.INDETERMINATE,
          isFormDisabled: true,
          isFormFocused: false,
        })
      }, 1666)
    } else {
      this.setState({ formStatus: newState.status, formMessage: newState.message })
    }
  }

  render() {
    const props = {
      formActionPath: this.props.formActionPath,
      formMessage: this.state.formMessage,
      formStatus: this.state.formStatus,
      isEditorial: this.props.isEditorial,
      isPostDetail: this.props.isPostDetail,
      isDiscoverAll: this.props.isDiscoverAll,
      isFormDisabled: this.state.isFormDisabled,
      isFormFocused: this.state.isFormFocused,
      isGridMode: this.props.isGridMode,
      isLayoutToolHidden: this.props.isLayoutToolHidden,
      isLoggedIn: this.props.isLoggedIn,
      isMobile: this.props.isMobile,
      isPaginatoring: this.props.isPaginatoring,
      links,
    }
    return <Footer {...props} />
  }
}

export default connect(mapStateToProps)(FooterContainer)
