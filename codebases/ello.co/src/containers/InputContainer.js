import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import debounce from 'lodash/debounce'
import { EDITOR } from '../constants/action_types'
import { selectCompletions } from '../selectors/editor'
import {
  autoCompleteUsers,
  loadEmojis,
  replaceText,
  setIsCompleterActive,
  setIsTextToolsActive,
  setTextToolsCoordinates,
} from '../actions/editor'
import { autoCompleteLocation } from '../actions/profile'
import Completer from '../components/completers/Completer'
import TextTools from '../components/editor/TextTools'
import { addInputObject, removeInputObject } from '../components/editor/InputComponent'
import { replaceWordFromSelection } from '../components/editor/SelectionUtil'
import { selectEmojis } from '../selectors/emoji'
import {
  selectDeviceSize,
  selectIsCompleterActive,
  selectIsTextToolsActive,
  selectTextToolsCoordinates,
  selectTextToolsStates,
} from '../selectors/gui'
import { css } from '../styles/jss'
import * as s from '../styles/jso'

const containerStyle = css(s.fixed, { top: 0, left: 0 }, s.zTools)

function mapStateToProps(state) {
  return {
    completions: selectCompletions(state),
    deviceSize: selectDeviceSize(state),
    emojis: selectEmojis(state),
    isCompleterActive: selectIsCompleterActive(state),
    isTextToolsActive: selectIsTextToolsActive(state),
    textToolsCoordinates: selectTextToolsCoordinates(state),
    textToolsStates: selectTextToolsStates(state),
  }
}

class InputContainer extends PureComponent {

  static propTypes = {
    deviceSize: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    completions: PropTypes.object,
    emojis: PropTypes.object,
    isCompleterActive: PropTypes.bool.isRequired,
    isTextToolsActive: PropTypes.bool.isRequired,
    textToolsCoordinates: PropTypes.object.isRequired,
    textToolsStates: PropTypes.object.isRequired,
  }

  static defaultProps = {
    completions: null,
    emojis: null,
  }

  componentWillMount() {
    this.onUserCompleter = debounce(this.onUserCompleter, 300)
    this.onLocationCompleter = debounce(this.onLocationCompleter, 300)
  }

  componentDidMount() {
    addInputObject(this)
  }

  componentWillUnmount() {
    removeInputObject(this)
    this.onCancelAutoCompleter()
  }

  onSubmitPost() {
    this.onCancelAutoCompleter()
  }

  onCancelAutoCompleter = () => {
    const { dispatch } = this.props
    dispatch({ type: EDITOR.CLEAR_AUTO_COMPLETERS })
    this.onHideCompleter()
    this.onHideTextTools()
  }

  onCompletion = ({ value }) => {
    const { dispatch } = this.props
    requestAnimationFrame(() => {
      const { collectionId, editorId } = document.activeElement.parentNode.dataset
      if (collectionId && editorId) {
        replaceWordFromSelection(value)
        dispatch(replaceText(collectionId, editorId))
      }
    })
    this.onCancelAutoCompleter()
  }

  onLocationCompletion = ({ value }) => {
    document.querySelector('input.LocationControl').value = value
    this.onCancelAutoCompleter()
  }

  onHideCompleter() {
    const { completions, dispatch, isCompleterActive } = this.props
    if (isCompleterActive) {
      dispatch(setIsCompleterActive({ isActive: false }))
    }
    if (completions) {
      dispatch({ type: EDITOR.CLEAR_AUTO_COMPLETERS })
    }
  }

  onUserCompleter({ word }) {
    const { dispatch, isCompleterActive } = this.props
    if (!isCompleterActive) {
      dispatch(setIsCompleterActive({ isActive: true }))
    }
    dispatch(autoCompleteUsers('user', word))
  }

  onEmojiCompleter({ word }) {
    const { dispatch, emojis, isCompleterActive } = this.props
    if (!isCompleterActive) {
      dispatch(setIsCompleterActive({ isActive: true }))
    }
    if (emojis && emojis.length) {
      dispatch({
        type: EDITOR.EMOJI_COMPLETER_SUCCESS,
        payload: {
          response: { emojis },
          type: 'emoji',
          word,
        },
      })
    } else {
      dispatch(loadEmojis('emoji', word))
    }
  }

  onLocationCompleter({ location }) {
    const { dispatch, isCompleterActive } = this.props
    if (!isCompleterActive) {
      dispatch(setIsCompleterActive({ isActive: true }))
    }
    dispatch(autoCompleteLocation(location))
  }

  onPositionChange({ coordinates }) {
    const { dispatch } = this.props
    dispatch(setTextToolsCoordinates({ textToolsCoordinates: coordinates }))
  }

  onHideTextTools() {
    const { dispatch, isTextToolsActive } = this.props
    if (isTextToolsActive) {
      dispatch(setIsTextToolsActive({ isActive: false }))
    }
  }

  onShowTextTools({ activeTools }) {
    const { dispatch, isTextToolsActive, textToolsStates } = this.props
    if (!isTextToolsActive && activeTools !== textToolsStates) {
      dispatch(setIsTextToolsActive({ isActive: true, textToolsStates: activeTools }))
    }
  }

  render() {
    const { completions, deviceSize, isCompleterActive } = this.props
    const { isTextToolsActive, textToolsStates, textToolsCoordinates } = this.props
    const onCompletion = completions && completions.get('type') === 'location' ?
      this.onLocationCompletion : this.onCompletion
    return (
      <div className={`Popovers ${containerStyle}`}>
        {isCompleterActive && completions ?
          <Completer
            completions={completions}
            deviceSize={deviceSize}
            onCancel={this.onCancelAutoCompleter}
            onCompletion={onCompletion}
          /> :
          null
        }
        {isTextToolsActive ?
          <TextTools
            activeTools={textToolsStates}
            isHidden={!isTextToolsActive}
            coordinates={textToolsCoordinates}
            key={JSON.stringify(textToolsStates)}
          /> :
          null
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(InputContainer)

