import Immutable from 'immutable'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import classNames from 'classnames'
import { setNotificationScrollY } from '../actions/gui'
import { getQueryParamValue } from '../helpers/uri_helper'
import { ElloMark } from '../components/assets/Icons'
import { reloadPlayers } from '../components/editor/EmbedBlock'
import { ErrorState4xx } from '../components/errors/Errors'
import { Paginator } from '../components/streams/Paginator'
import {
  addScrollObject,
  addScrollTarget,
  removeScrollObject,
  removeScrollTarget,
} from '../components/viewport/ScrollComponent'
import * as ACTION_TYPES from '../constants/action_types'
import { runningFetches } from '../sagas/requester'
import { v3IsRunning } from '../sagas/v3_requester'
import { selectIsLoggedIn } from '../selectors/authentication'
import {
  selectColumnCount,
  selectHasLaunchedSignupModal,
  selectInnerHeight,
  selectInnerWidth,
  selectIsCategoryDrawerOpen,
  selectIsGridMode,
} from '../selectors/gui'
import { selectOmnibar, selectStream } from '../selectors/store'
import {
  selectStreamFilteredResult,
  selectStreamResultPath,
} from '../selectors/stream'

const selectActionPath = props =>
  get(props, ['action', 'payload', 'endpoint', 'path'])

function makeMapStateToProps() {
  return (state, props) =>
    ({
      columnCount: selectColumnCount(state),
      hasLaunchedSignupModal: selectHasLaunchedSignupModal(state),
      innerHeight: selectInnerHeight(state),
      innerWidth: selectInnerWidth(state),
      isCategoryDrawerOpen: selectIsCategoryDrawerOpen(state),
      isLoggedIn: selectIsLoggedIn(state),
      isGridMode: selectIsGridMode(state),
      omnibar: selectOmnibar(state),
      result: selectStreamFilteredResult(state, props),
      resultPath: selectStreamResultPath(state, props),
      stream: selectStream(state),
    })
}

function buildNextPageAction(action, pagination) {
  const { meta } = action
  const next = pagination.get('next')
  // V3/GraphQL pagination
  if (pagination.get('query')) {
    const variables = pagination.get('variables', {})
    return {
      ...action,
      type: ACTION_TYPES.V3.LOAD_NEXT_CONTENT,
      payload: {
        query: pagination.get('query'),
        variables: variables.merge({ before: next }),
      },
      meta: {
        mappingType: meta.mappingType,
        resultFilter: meta.resultFilter,
        resultKey: meta.resultKey,
      },
    }
  }
  return {
    ...action,
    type: ACTION_TYPES.LOAD_NEXT_CONTENT,
    payload: {
      endpoint: { path: next },
    },
    meta: {
      mappingType: meta.mappingType,
      resultFilter: meta.resultFilter,
      resultKey: meta.resultKey,
    },
  }
}

function lastPage(action, stream, pagination) {
  return (!action.payload.endpoint && !action.payload.query) ||
    !pagination.get('next') ||
    Number(pagination.get('totalPagesRemaining')) === 0 ||
    pagination.get('isLastPage', false) === true ||
    (stream.get('type') === ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS && stream.getIn(['payload', 'serverStatus']) === 204)
}

function nextPageInFlight(pagination) {
  return runningFetches[pagination.next] || v3IsRunning(pagination)
}

class StreamContainer extends Component {

  static propTypes = {
    action: PropTypes.object,
    className: PropTypes.string,
    columnCount: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
    hasLaunchedSignupModal: PropTypes.bool.isRequired,
    hasShowMoreButton: PropTypes.bool,
    isCategoryDrawerOpen: PropTypes.bool,
    isGridMode: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isModalComponent: PropTypes.bool,
    isPostHeaderHidden: PropTypes.bool,
    omnibar: PropTypes.object.isRequired,
    paginatorCentered: PropTypes.bool,
    paginatorText: PropTypes.string,
    paginatorTo: PropTypes.string,
    result: PropTypes.object.isRequired,
    resultPath: PropTypes.string.isRequired,
    scrollContainer: PropTypes.object,
    shouldInfiniteScroll: PropTypes.bool,
    stream: PropTypes.object.isRequired,
    sendResultStatus: PropTypes.func,
  }

  static defaultProps = {
    action: null,
    className: '',
    hasShowMoreButton: true,
    isCategoryDrawerOpen: false,
    isModalComponent: false,
    isPostHeaderHidden: false,
    paginatorCentered: true,
    paginatorText: 'Loading',
    paginatorTo: null,
    scrollContainer: null,
    shouldInfiniteScroll: true,
    sendResultStatus: null,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func,
  }

  componentWillMount() {
    const { action, dispatch, omnibar } = this.props
    this.state = { action, renderType: ACTION_TYPES.LOAD_STREAM_REQUEST }
    if (action) {
      dispatch(action)
    }
    this.wasOmnibarActive = omnibar.isActive
    this.setScroll = debounce(this.setScroll, 333)
  }

  componentDidMount() {
    reloadPlayers()
    const { isModalComponent, scrollContainer } = this.props
    if (isModalComponent && scrollContainer) {
      this.scrollObject = { component: this, element: scrollContainer }
      addScrollTarget(this.scrollObject)
    } else if (!isModalComponent) {
      this.scrollObject = this
      addScrollObject(this.scrollObject)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { scrollContainer, stream } = nextProps
    const { isModalComponent } = this.props
    const { action } = this.state
    if (isModalComponent && !this.props.scrollContainer && scrollContainer) {
      this.scrollObject = { component: this, element: scrollContainer }
      addScrollTarget(this.scrollObject)
    }
    if (!action) { return }
    if (stream.get('type') === ACTION_TYPES.LOAD_NEXT_CONTENT_SUCCESS ||
      stream.get('type') === ACTION_TYPES.V3.LOAD_NEXT_CONTENT_SUCCESS) {
      this.setState({ hidePaginator: true })
    }
    if (selectActionPath(this.props) === nextProps.stream.getIn(['payload', 'endpoint', 'path'])) {
      this.setState({ renderType: stream.get('type') })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // when hitting the back button the result can update and
    // try to feed wrong results to the actions render method
    // thus causing errors when trying to render wrong results
    if (nextProps.resultPath !== this.props.resultPath) {
      return false
    }
    return !Immutable.is(nextProps.result, this.props.result) ||
      ['columnCount', 'isCategoryDrawerOpen', 'isGridMode', 'isLoggedIn'].some(prop =>
        nextProps[prop] !== this.props[prop],
      ) ||
      ['hidePaginator', 'renderType'].some(prop =>
        nextState[prop] !== this.state[prop],
      )
  }

  componentDidUpdate() {
    if (window.embetter) {
      window.embetter.reloadPlayers()
    }
    const { omnibar, result, sendResultStatus } = this.props

    this.wasOmnibarActive = omnibar.get('isActive')

    // bubble up the number of results (if necessary)
    if (sendResultStatus) {
      const numberResults = result.get('ids').size
      sendResultStatus(numberResults)
    }
  }

  componentWillUnmount() {
    if (window.embetter) {
      window.embetter.stopPlayers()
    }
    removeScrollObject(this.scrollObject)
    removeScrollTarget(this.scrollObject)
  }

  onScroll() {
    if (!this.props.shouldInfiniteScroll) { return }
    this.setScroll()
  }

  onScrollTarget() {
    if (!this.props.shouldInfiniteScroll) { return }
    this.setScroll()
  }

  onScrollBottom() {
    const { result, shouldInfiniteScroll } = this.props
    if (!shouldInfiniteScroll || !result.get('ids').size) { return }
    this.onLoadNextPage()
  }

  onScrollBottomTarget() {
    if (!this.props.shouldInfiniteScroll) { return }
    this.onLoadNextPage()
  }

  onLoadNextPage = () => {
    const { hasLaunchedSignupModal, isLoggedIn } = this.props
    if (!isLoggedIn && !hasLaunchedSignupModal) {
      const { onClickOpenRegistrationRequestDialog } = this.context
      onClickOpenRegistrationRequestDialog('scroll')
    }
    this.loadPage('next')
  }

  setScroll() {
    const path = selectActionPath(this.state)
    if (!path) { return }
    if (/\/notifications/.test(path)) {
      const category = getQueryParamValue('category', path) || 'all'
      const { dispatch, isModalComponent, scrollContainer } = this.props
      if (isModalComponent && scrollContainer) {
        dispatch(setNotificationScrollY(category, scrollContainer.scrollTop))
      }
    }
  }


  loadPage(rel) {
    const { dispatch, result, stream } = this.props
    const { action } = this.state
    if (!action) { return }
    const pagination = result.get('pagination')
    if (lastPage(action, stream, pagination)) { return }
    if (nextPageInFlight(pagination)) { return }
    this.setState({ hidePaginator: false })
    const infiniteAction = buildNextPageAction(action, pagination, rel)
    // this is used for updating the postId on a comment
    // so that the post exsists in the store after load
    if (action.payload.postIdOrToken) {
      infiniteAction.payload.postIdOrToken = action.payload.postIdOrToken
    }
    dispatch(infiniteAction)
  }

  renderError() {
    const { action } = this.props
    const { meta } = action
    return (
      <section className="StreamContainer isError">
        {meta && meta.renderStream && meta.renderStream.asError ?
          meta.renderStream.asError :
          <ErrorState4xx />
        }
      </section>
    )
  }

  renderLoading() {
    const { className } = this.props
    return (
      <section className={classNames('StreamContainer isBusy', className)} >
        <div className="StreamBusyIndicator">
          <ElloMark className="isSpinner" />
        </div>
      </section>
    )
  }

  renderZeroState() {
    const { action } = this.props
    if (!action) { return null }
    const { meta } = action
    return (
      <section className="StreamContainer empty">
        {meta && meta.renderStream && meta.renderStream.asZero ?
          meta.renderStream.asZero :
          null
        }
      </section>
    )
  }

  render() {
    const {
      className,
      columnCount,
      hasShowMoreButton,
      isCategoryDrawerOpen,
      isGridMode,
      isPostHeaderHidden,
      paginatorCentered,
      paginatorText,
      paginatorTo,
      result,
      stream,
      resultPath,
    } = this.props
    const { action, hidePaginator, renderType } = this.state
    if (!action) { return null }
    if (!result.get('ids').size) {
      switch (renderType) {
        case ACTION_TYPES.LOAD_STREAM_SUCCESS:
        case ACTION_TYPES.V3.LOAD_STREAM_SUCCESS:
          return this.renderZeroState()
        case ACTION_TYPES.LOAD_STREAM_REQUEST:
        case ACTION_TYPES.V3.LOAD_STREAM_REQUEST:
          return this.renderLoading()
        case ACTION_TYPES.LOAD_STREAM_FAILURE:
        case ACTION_TYPES.V3.LOAD_STREAM_FAILURE:
          if (stream.error) {
            return this.renderError()
          }
          return null
        default:
          return null
      }
    }
    const { meta } = action
    const renderMethod = isGridMode ? 'asGrid' : 'asList'
    const pagination = result.get('pagination')
    const isLastPage = pagination.get('isLastPage', false)
    const finalColumnCount =
      (isCategoryDrawerOpen && (innerWidth > 959)) ? (columnCount - 1) : columnCount
    let nextPagePath = null
    if (!isLastPage && (resultPath.includes('/discover') || resultPath === '/')) {
      nextPagePath = `${resultPath}?before=${pagination.get('next')}`
    }

    return (
      <section className={classNames('StreamContainer', className)}>
        {meta.renderStream[renderMethod](result.get('ids'), finalColumnCount, isPostHeaderHidden, meta.renderProps)}

        {!isLastPage &&
          <Paginator
            hasShowMoreButton={
              ((hasShowMoreButton && stream.getIn(['payload', 'serverStatus']) !== 204) && !pagination.get('isLastPage', false)) ||
              (typeof meta.resultKey !== 'undefined' && typeof meta.updateKey !== 'undefined')
            }
            isCentered={paginatorCentered}
            isHidden={hidePaginator}
            loadNextPage={this.onLoadNextPage}
            messageText={paginatorText}
            to={paginatorTo}
            totalPages={Number(pagination.get('totalPages'))}
            nextPagePath={nextPagePath}
            totalPagesRemaining={Number(pagination.get('totalPagesRemaining'))}
          />
        }
      </section>
    )
  }
}

export default connect(makeMapStateToProps)(StreamContainer)

