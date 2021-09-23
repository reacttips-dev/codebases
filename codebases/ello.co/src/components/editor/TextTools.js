import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { LinkIcon } from '../assets/Icons'
import { textToolsPath } from '../../networking/api'
import { css, focus, hover, media, modifier, parent, placeholder, select } from '../../styles/jss'
import * as s from '../../styles/jso'

function prefixLink(text) {
  const linkPrefix = /((ftp|http|https):\/\/.)|mailto(?=:[-.\w]+@)/
  if (!linkPrefix.test(text)) return `http://${text}`
  return text
}

const toolsStyle = css(
  s.fixed,
  s.zIndex2,
  { width: 93, marginLeft: '-1px' },
  s.overflowHidden,
  s.nowrap,
  { transition: `width 0.2s ${s.ease}, opacity 0.2s ${s.ease}` },
  modifier('.asShowLinkForm', { width: 215 }),
  modifier('.isHidden', s.pointerEvents, s.opacity0),
  media(s.maxBreak2, s.displayNone), // TODO: We should really disable the tools
)

const buttonStyle = css(
  s.relative,
  s.zIndex1,
  s.wv30,
  s.hv30,
  s.lh30,
  { marginLeft: '1px', borderRadius: '50%' },
  s.fontSize14,
  s.colorA,
  s.center,
  s.alignMiddle,
  s.bgcWhite,
  { transition: `border-radius 0.2s ${s.ease}, color 0.2s, width 0.2s ${s.ease}` },
  hover(s.colorBlack),
  modifier('.isActive', s.colorBlack),
  select('&.forItalic > em', s.monoRegular, s.italic, { marginLeft: '-2px' }),
  select('.TextTools.asShowLinkForm &.forBold', { width: 0 }),
  select('.TextTools.asShowLinkForm &.forItalic', { width: 0 }),
  select('.TextTools.asShowLinkForm &.forLink', { borderRadius: '50% 0 0 50%' }),
)

const formStyle = css(
  s.zIndex0,
  s.inlineBlock,
  s.hv30,
  s.alignMiddle,
  s.transitionTransform,
  parent('.TextTools.asShowLinkForm', { transform: 'translateX(-30px)' }),
)

const inputStyle = css(
  s.inlineBlock,
  s.hv30,
  { width: 210, padding: '0 10px 0 35px', borderRadius: 15 },
  s.fontSize14,
  s.colorBlack,
  s.alignBaseline,
  s.bgcWhite,
  { border: 0, outline: 0 },
  { transition: `background-color 0.2s ${s.ease}, color 0.2s ${s.ease}, width 0.2s ${s.ease}, height 0.2s ${s.ease}` },
  focus({ outline: 0 }),
  placeholder(s.colorA),
)

export default class TextTools extends PureComponent {

  static propTypes = {
    activeTools: PropTypes.object,
    coordinates: PropTypes.object,
    isHidden: PropTypes.bool,
    text: PropTypes.string,
  }

  static defaultProps = {
    isHidden: true,
    activeTools: {
      isBoldActive: false,
      isItalicActive: false,
      isLinkActive: false,
    },
    coordinates: null,
    text: '',
  }

  componentWillMount() {
    const { activeTools, text } = this.props
    const { isBoldActive, isItalicActive, isLinkActive } = activeTools
    this.state = {
      hasFocus: false,
      hasValue: text && text.length,
      isInitialValue: true,
      isBoldActive,
      isItalicActive,
      isLinkActive,
      isLinkInputOpen: false,
      text,
    }
    this.initialValue = text
  }

  handleChange = (e) => {
    const val = e.target.value
    this.setState({
      text: val,
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { text } = this.state
    this.restoreSelection()
    if (text.length) {
      this.createLink(text)
    } else {
      this.removeLink()
    }
  }

  handleBoldToggle = () => {
    const { isBoldActive } = this.state
    this.setState({ isBoldActive: !isBoldActive })
    document.execCommand('bold', false, true)
    this.saveSelection()
  }

  handleItalicToggle = () => {
    const { isItalicActive } = this.state
    this.setState({ isItalicActive: !isItalicActive })
    document.execCommand('italic', false, true)
    this.saveSelection()
  }

  handleLinkToggle = () => {
    const { isLinkActive, isLinkInputOpen } = this.state
    if (isLinkActive && !isLinkInputOpen) {
      this.removeLink()
    } else {
      this.setState({ isLinkInputOpen: !isLinkInputOpen })
    }
    this.saveSelection()
  }

  createLink(text) {
    this.setState({ isLinkActive: true, isLinkInputOpen: false })
    requestAnimationFrame(() => {
      document.execCommand('createLink', false, prefixLink(text))
      this.saveSelection()
    })
  }

  removeLink() {
    this.setState({ isLinkActive: false, isLinkInputOpen: false, text: '' })
    document.execCommand('unlink', false, null)
    this.saveSelection()
  }

  saveSelection() {
    const sel = window.getSelection()
    if (sel) this.range = sel.getRangeAt(0)
  }

  restoreSelection() {
    if (!this.range) return
    const sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(this.range)
  }

  render() {
    const { isBoldActive, isItalicActive, isLinkActive, isLinkInputOpen, text } = this.state
    const { coordinates, isHidden } = this.props
    const asShowLinkForm = isLinkInputOpen
    const style = coordinates ? { left: coordinates.get('left'), top: coordinates.get('top') - 40 } : null
    return (
      <div
        style={style}
        className={classNames(`TextTools ${toolsStyle}`, { asShowLinkForm, isHidden })}
      >
        <button
          className={classNames(`TextToolButton forBold ${buttonStyle}`, { isActive: isBoldActive })}
          onClick={this.handleBoldToggle}
        >
          <strong>B</strong>
        </button>
        <button
          className={classNames(`TextToolButton forItalic ${buttonStyle}`, { isActive: isItalicActive })}
          onClick={this.handleItalicToggle}
        >
          <em>I</em>
        </button>
        <button
          className={classNames(`TextToolButton forLink ${buttonStyle}`, { isActive: isLinkActive })}
          onClick={this.handleLinkToggle}
        >
          <LinkIcon />
        </button>
        <form
          action={textToolsPath().path}
          className={`TextToolForm ${formStyle}`}
          method="POST"
          noValidate="novalidate"
          onSubmit={this.handleSubmit}
        >
          <input
            className={`TextToolLinkInput ${inputStyle}`}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            placeholder="Add Link..."
            tabIndex="0"
            type="url"
            value={text}
          />
        </form>
      </div>
    )
  }
}

