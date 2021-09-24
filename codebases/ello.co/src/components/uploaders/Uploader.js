import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import * as ElloAndroidInterface from '../../lib/android_interface'
import { before, css, media, modifier, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const uploaderStyle = css(
  s.relative,
  s.zIndex2,
  before(s.absolute, s.flood, s.zIndex2, s.bgcTransparent, s.transitionBgColor, { content: '""' }),
  modifier('.isAvatarUploader', s.center, before({ borderRadius: '50%' })),
  modifier('.isCoverUploader', s.block, s.fullWidth, { height: 220 }),
  media(s.minBreak2, modifier('.isCoverUploader', { height: 330 })),
  parent('.Onboarding', media(s.minBreak2, modifier('.isCoverUploader', { height: 220 }))),
  modifier('.isXLUploader', { width: 220, paddingTop: 240 }, before({ width: 220, height: 220 })),
  modifier('.isLGUploader',
    { width: 120, paddingTop: 140 },
    before({ width: 120, height: 120 }),
    media(s.minBreak2,
      { width: 180, paddingTop: 200 },
      before({ width: 180, height: 180 }),
    ),
  ),
  modifier('.isSettingsAvatarUploader',
    s.fullWidth,
    s.pt20,
    s.leftAlign,
    { paddingLeft: 140 },
    media(
      s.minBreak2,
      s.fullWidth,
      s.px10,
      s.pt0,
      { maxWidth: 400, minHeight: 180, paddingTop: 200 },
    ),
  ),
  modifier('.hasDragOver', before({ backgroundColor: 'rgba(0, 0, 0, 0.4)' })),
  modifier('.isAvatarBlank', before({ backgroundColor: '#f0f0f0' })),
  modifier('.isCoverBlank', before({ backgroundColor: '#f0f0f0' })),
)

const buttonStyle = css(
  s.relative,
  s.zIndex3,
  s.inlineBlock,
  { minWidth: 160, borderRadius: 5 },
  s.hv40,
  s.lh40,
  s.py0,
  s.px20,
  s.fontSize14,
  s.colorA,
  s.center,
  s.bgcWhite,
  s.borderA,
  { transition: `background-color 0.2s ${s.ease}, border-color 0.2s ${s.ease}, color 0.2s ${s.ease}, width 0.2s ${s.ease}, opacity 0.2s` },
  parent('.isAvatarBlank', s.colorWhite, s.bgcGreen, s.borderGreen),
  parent('.isCoverImageBlank', s.colorWhite, s.bgcGreen, s.borderGreen),
  parent('.hasDragOver', s.colorWhite, { backgroundColor: '#00b100', borderColor: '#00b100' }),
  parent('.no-touch .Uploader:hover', s.colorWhite, { backgroundColor: '#00b100', borderColor: '#00b100' }),
)

const messageStyle = css(
  s.relative,
  s.zIndex3,
  { maxWidth: 160 },
  s.mxAuto,
  s.colorA,
  select('& > p', s.mb0),
  select('& > p + p', s.mt0),
  parent('.SettingsAvatarPicker', { width: 160, margin: 0 }),
  media(s.minBreak2,
    parent(
      '.Uploader.isCoverUploader',
      s.absolute,
      s.leftAlign,
      { bottom: -30, maxWidth: '100%', right: 0 },
      select('& p', s.inlineBlock, s.ml10),
    ),
  ),
)

class Uploader extends PureComponent {

  static propTypes = {
    className: PropTypes.string,
    kind: PropTypes.string,
    line1: PropTypes.string,
    line2: PropTypes.string,
    line3: PropTypes.string,
    saveAction: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  }

  static defaultProps = {
    className: '',
    kind: null,
    line1: null,
    line2: null,
    line3: null,
  }

  componentWillMount() {
    this.state = {
      hasDragOver: false,
    }
  }

  onFileBrowse = (e) => {
    const file = e.target.files[0]
    return this.props.saveAction(file)
  }

  onClickFileBrowser = () => {
    if (ElloAndroidInterface.supportsNativeImagePicker()) {
      ElloAndroidInterface.launchImagePicker(this.props.kind)
    } else {
      this.fileBrowser.click()
    }
  }

  onDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files[0]
    this.setState({ hasDragOver: false })
    return this.props.saveAction(file)
  }

  onDragOver = (e) => {
    e.preventDefault()
    this.setState({ hasDragOver: true })
  }

  onDragLeave = (e) => {
    e.preventDefault()
    this.setState({ hasDragOver: false })
  }

  render() {
    const { className, title, line1, line2, line3 } = this.props
    const classList = classNames(
      `Uploader ${uploaderStyle}`,
      className,
      { hasDragOver: this.state.hasDragOver },
    )

    return (
      <button
        className={classList}
        onClick={this.onClickFileBrowser}
        onDrop={this.onDrop}
        onDragOver={this.onDragOver}
        onDragLeave={this.onDragLeave}
      >
        <span className={buttonStyle}>
          {title}
        </span>
        <div className={messageStyle}>
          {line1 && <p>{line1}</p>}
          {line2 && <p>{line2}</p>}
          {line3 && <p>{line3}</p>}
        </div>
        <input
          className="hidden"
          onChange={this.onFileBrowse}
          ref={(comp) => { this.fileBrowser = comp }}
          type="file"
          accept="image/*"
        />
      </button>
    )
  }
}

export default Uploader

