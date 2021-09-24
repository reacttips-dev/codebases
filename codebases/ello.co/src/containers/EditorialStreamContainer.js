import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ElloMark } from '../components/assets/Icons'
import { ErrorStateEditorial } from '../components/errors/Errors'
import { ZeroStateEditorial } from '../components/zeros/Zeros'
import { postsAsPostStream } from '../components/streams/StreamRenderables'
import * as ACTION_TYPES from '../constants/action_types'
import { selectStream } from '../selectors/store'
import {
  selectStreamFilteredResult,
} from '../selectors/stream'

function makeMapStateToProps() {
  return (state, props) =>
    ({
      result: selectStreamFilteredResult(state, props),
      stream: selectStream(state),
    })
}

function renderError() {
  return (
    <section className="StreamContainer isError">
      <ErrorStateEditorial />
    </section>
  )
}

function renderZeroState() {
  return (
    <section className="StreamContainer empty">
      <ZeroStateEditorial />
    </section>
  )
}

function renderLoading() {
  return (
    <section className="StreamContainer isBusy inEditorial" >
      <div className="StreamBusyIndicator">
        <ElloMark className="isSpinner" />
      </div>
    </section>
  )
}

class EditorialStreamContainer extends Component {

  static propTypes = {
    action: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    result: PropTypes.object.isRequired,
    stream: PropTypes.object.isRequired,
  }

  static defaultProps = {
    action: null,
  }

  static contextTypes = {
    onClickOpenRegistrationRequestDialog: PropTypes.func,
  }

  componentWillMount() {
    const { action, dispatch } = this.props
    this.state = { action, renderType: ACTION_TYPES.LOAD_STREAM_REQUEST }
    if (action) {
      dispatch(action)
    }
  }

  render() {
    const {
      result,
      stream,
    } = this.props
    const { action, renderType } = this.state
    if (!action) { return null }
    if (!result.get('ids').size) {
      switch (renderType) {
        case ACTION_TYPES.LOAD_STREAM_SUCCESS:
        case ACTION_TYPES.V3.LOAD_STREAM_SUCCESS:
          return renderZeroState()
        case ACTION_TYPES.LOAD_STREAM_REQUEST:
        case ACTION_TYPES.V3.LOAD_STREAM_REQUEST:
          return renderLoading()
        case ACTION_TYPES.LOAD_STREAM_FAILURE:
        case ACTION_TYPES.V3.LOAD_STREAM_FAILURE:
          if (stream.error) {
            return renderError()
          }
          return null
        default:
          return null
      }
    }
    const { meta } = action

    return (
      <section className="StreamContainer inEditorial">
        {postsAsPostStream(result.get('ids'), meta.renderProps)}
      </section>
    )
  }
}

export default connect(makeMapStateToProps)(EditorialStreamContainer)

