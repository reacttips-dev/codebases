import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { connect } from 'react-redux'
import { trackEvent } from '../actions/analytics'
import { setLastAnnouncementSeen, setNotificationScrollY, toggleNotifications } from '../actions/gui'
import { loadNotifications, markAnnouncementRead } from '../actions/notifications'
import {
  BubbleIcon,
  HeartIcon,
  RepostIcon,
  RelationshipIcon,
} from '../components/assets/Icons'
import { AnnouncementNotification } from '../components/notifications/NotificationRenderables'
import { Paginator } from '../components/streams/Paginator'
import { TabListButtons, TabListLinks } from '../components/tabs/TabList'
import { MainView } from '../components/views/MainView'
import { ADD_NEW_IDS_TO_RESULT, CLEAR_PAGE_RESULT, GUI, LOAD_STREAM_SUCCESS } from '../constants/action_types'
import StreamContainer from '../containers/StreamContainer'
import { scrollToPosition } from '../lib/jello'
import {
  selectActiveNotificationScrollPosition,
  selectActiveNotificationsType,
  selectIsNotificationsUnread,
} from '../selectors/gui'
import {
  selectAnnouncementBody,
  selectAnnouncementCTACaption,
  selectAnnouncementCTAHref,
  selectAnnouncementId,
  selectAnnouncementImage,
  selectAnnouncementIsEmpty,
  selectAnnouncementIsStaffPreview,
  selectAnnouncementTitle,
} from '../selectors/notifications'
import { selectPropsPathname } from '../selectors/routing'
import { selectStreamType } from '../selectors/stream'

const TABS = [
  { to: '/notifications', type: 'all', children: 'All' },
  { to: '/notifications/comments', type: 'comments', children: <BubbleIcon /> },
  { to: '/notifications/mentions', type: 'mentions', children: '@' },
  { to: '/notifications/loves', type: 'loves', children: <HeartIcon /> },
  { to: '/notifications/reposts', type: 'reposts', children: <RepostIcon /> },
  { to: '/notifications/relationships', type: 'relationships', children: <RelationshipIcon /> },
]

function mapStateToProps(state, props) {
  const activeTabType = props.isModal ? selectActiveNotificationsType(state) : get(props, 'params.type', 'all')
  return {
    activeTabType,
    announcementBody: selectAnnouncementBody(state),
    announcementCTACaption: selectAnnouncementCTACaption(state),
    announcementCTAHref: selectAnnouncementCTAHref(state),
    announcementId: selectAnnouncementId(state),
    announcementImage: selectAnnouncementImage(state),
    announcementIsEmpty: selectAnnouncementIsEmpty(state),
    announcementIsStaffPreview: selectAnnouncementIsStaffPreview(state),
    announcementTitle: selectAnnouncementTitle(state),
    isNotificationsUnread: selectIsNotificationsUnread(state),
    notificationScrollPosition: selectActiveNotificationScrollPosition(state),
    pathname: selectPropsPathname(state, props),
    streamAction: loadNotifications({ category: activeTabType }),
    streamType: selectStreamType(state),
  }
}

class NotificationsContainer extends Component {
  static propTypes = {
    activeTabType: PropTypes.string,
    announcementBody: PropTypes.string,
    announcementCTACaption: PropTypes.string,
    announcementCTAHref: PropTypes.string,
    announcementId: PropTypes.string,
    announcementImage: PropTypes.string,
    announcementIsEmpty: PropTypes.bool.isRequired,
    announcementIsStaffPreview: PropTypes.bool.isRequired,
    announcementTitle: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    isModal: PropTypes.bool,
    isNotificationsUnread: PropTypes.bool,
    notificationScrollPosition: PropTypes.number.isRequired,
    pathname: PropTypes.string,
    streamAction: PropTypes.object,
    streamType: PropTypes.string, // eslint-disable-line
  }

  static defaultProps = {
    activeTabType: 'all',
    announcementId: '',
    announcementBody: '',
    announcementCTACaption: null,
    announcementCTAHref: null,
    announcementImage: null,
    announcementTitle: '',
    isModal: false,
    isNotificationsUnread: false,
    pathname: null,
    streamAction: null,
    streamType: null,
  }

  static childContextTypes = {
    onClickAnnouncementNotification: PropTypes.func.isRequired,
  }

  getChildContext() {
    return {
      onClickAnnouncementNotification: this.onClickAnnouncementNotification,
    }
  }

  componentWillMount() {
    this.state = { isReloading: false, scrollContainer: null }
  }

  componentDidMount() {
    if (this.props.isModal) {
      document.addEventListener('click', this.onClickDocument)
      document.addEventListener('touchstart', this.onClickDocument)
    }
    const { announcementId, announcementIsEmpty, dispatch } = this.props
    if (!announcementIsEmpty) {
      const { announcementBody, announcementTitle } = this.props
      const trackTitle = announcementTitle || announcementBody
      const trackProps = { name: trackTitle, announcement: announcementId }
      dispatch(trackEvent('announcement_viewed', trackProps))
    }
    if (announcementId && announcementId.length) {
      dispatch(setLastAnnouncementSeen({ id: announcementId }))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.streamType === LOAD_STREAM_SUCCESS) {
      this.setState({ isReloading: false })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return ['activeTabType', 'announcementIsEmpty', 'pathname'].some(prop =>
      nextProps[prop] !== this.props[prop],
    ) || ['isReloading', 'scrollContainer'].some(prop => nextState[prop] !== this.state[prop])
  }

  componentDidUpdate(prevProps, prevState) {
    const { dispatch, isNotificationsUnread, notificationScrollPosition } = this.props
    const { scrollContainer } = this.state
    if (isNotificationsUnread) {
      // reset active tab type to all
      dispatch({
        type: GUI.NOTIFICATIONS_TAB,
        payload: { activeTabType: 'all' },
      })
      // scroll back to the top
      scrollToPosition(0, 0, { el: scrollContainer })
      // clear page results for notifications
      // reset all notification scroll positions
      TABS.forEach((tab) => {
        dispatch({ type: CLEAR_PAGE_RESULT, payload: { resultKey: tab.to } })
        dispatch(setNotificationScrollY(tab.type, 0))
      })
      // load all again
      dispatch(loadNotifications({ category: 'all' }))
    } else if ((!prevState.scrollContainer && scrollContainer) ||
        prevProps.notificationScrollPosition !== notificationScrollPosition) {
      scrollContainer.scrollTop = notificationScrollPosition
    }
  }

  componentWillUnmount() {
    if (this.props.isModal) {
      document.removeEventListener('click', this.onClickDocument)
      document.removeEventListener('touchstart', this.onClickDocument)
    }
    this.onMouseOut()
  }

  onClickAnnouncementNotification = (e) => {
    const { announcementBody, announcementTitle, announcementId, dispatch } = this.props
    const el = e.target.tagName === 'IMG' ? e.target.parentNode : e.target
    const trackType = el.classList.contains('js-ANCTA') ? 'clicked' : 'closed'
    const trackTitle = announcementTitle || announcementBody
    const trackProps = { name: trackTitle, announcement: announcementId }
    const trackAction = trackEvent(`announcement_${trackType}`, trackProps)
    if (trackType === 'closed') {
      dispatch(markAnnouncementRead())
    }
    dispatch(trackAction)
  }

  onClickDocument = (e) => {
    if (e.target.classList.contains('js-closeAnnouncement') ||
      (typeof e.target.closest === 'function' && e.target.closest('.NotificationsContainer'))) {
      return
    }
    const { dispatch } = this.props
    dispatch(toggleNotifications({ isActive: false }))
    this.onMouseOut()
  }

  onClickTab = ({ type }) => {
    const { activeTabType, dispatch, streamAction } = this.props
    const { scrollContainer } = this.state
    if (activeTabType === type) {
      scrollToPosition(0, 0, { el: scrollContainer })
      dispatch({ type: ADD_NEW_IDS_TO_RESULT, payload: { resultKey: streamAction.meta.resultKey } })
      dispatch(streamAction)
      this.setState({ isReloading: true })
    } else {
      dispatch({
        type: GUI.NOTIFICATIONS_TAB,
        payload: { activeTabType: type },
      })
    }
  }

  onMouseOver = () => {
    document.body.classList.add('isNotificationsScrolling')
  }

  onMouseOut = () => {
    document.body.classList.remove('isNotificationsScrolling')
  }

  render() {
    const {
      activeTabType,
      announcementBody,
      announcementCTACaption,
      announcementCTAHref,
      announcementImage,
      announcementIsEmpty,
      announcementIsStaffPreview,
      announcementTitle,
      isModal,
      pathname,
      streamAction,
    } = this.props
    const { isReloading, scrollContainer } = this.state
    const shared = []
    if (isReloading) {
      shared.push(
        <Paginator
          className="NotificationReload"
          isHidden={false}
          key="notificationReloadingPaginator"
        />,
      )
    }
    if (!announcementIsEmpty) {
      shared.push(
        <AnnouncementNotification
          body={announcementBody}
          ctaCaption={announcementCTACaption}
          ctaHref={announcementCTAHref}
          isStaffPreview={announcementIsStaffPreview}
          key="announcementNotification"
          src={announcementImage}
          title={announcementTitle}
        />,
      )
    }
    return isModal ?
      (
        <div
          className="NotificationsContainer"
          onMouseEnter={this.onMouseOver}
          onMouseLeave={this.onMouseOut}
        >
          <TabListButtons
            activeType={activeTabType}
            className="IconTabList NotificationsContainerTabs"
            onTabClick={this.onClickTab}
            tabClasses="IconTab"
            tabs={TABS}
          />
          <div
            className="Scrollable"
            ref={(comp) => { this.setState({ scrollContainer: comp }) }}
          >
            {shared}
            <StreamContainer
              action={streamAction}
              className="isFullWidth"
              isModalComponent
              key={`notificationView_${activeTabType}`}
              scrollContainer={scrollContainer}
            />
          </div>
        </div>
      ) :
      (
        <MainView className="Notifications">
          <TabListLinks
            activePath={pathname}
            className="IconTabList NotificationsContainerTabs"
            onTabClick={this.onClickTab}
            tabClasses="IconTab"
            tabs={TABS}
          />
          {shared}
          <StreamContainer
            action={streamAction}
            className="isFullWidth"
            key={`notificationView_${activeTabType}`}
          />
        </MainView>
      )
  }
}

export default connect(mapStateToProps)(NotificationsContainer)

