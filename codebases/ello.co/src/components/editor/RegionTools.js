import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { openModal, closeModal } from '../../actions/modals'
import { DragIcon, XIcon } from '../assets/Icons'
import ConfirmDialog from '../dialogs/ConfirmDialog'
import { css, hover, media, parent } from '../../styles/jss'
import * as s from '../../styles/jso'

const toolsStyle = css(
  s.absolute,
  { top: 10, right: 20 },
  s.zIndex2,
  s.colorA,
  media(s.minBreak2, { right: 40 }, parent('.isComment', { right: 30 })),
  parent('.BlockPlaceholder >', s.displayNone),
  parent('.ZeroState', s.displayNone),
)

const dragButtonStyle = css(
  s.displayNone,
  s.rotate90,
  { cursor: 'move' },
  hover(s.colorBlack),
  parent('.no-touch', s.inlineBlock),
  parent('.editor-region[data-num-blocks="1"]', s.displayNone),
)

const removeButtonStyle = css(
  hover(s.colorBlack),
  parent('.editor:not(.hasContent)', s.displayNone),
)

class RegionTools extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    editorId: PropTypes.string.isRequired,
    onRemoveBlock: PropTypes.func.isRequired,
  }

  closeModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  deleteContentConfirmed = () => {
    const { onRemoveBlock } = this.props
    this.closeModal()
    onRemoveBlock()
  }

  handleDeleteBlock = () => {
    const { dispatch } = this.props
    dispatch(openModal(
      <ConfirmDialog
        title="Remove this content?"
        onConfirm={this.deleteContentConfirmed}
        onDismiss={this.closeModal}
      />))
  }

  render() {
    const { editorId } = this.props
    return (
      <div className={`RegionTools ${toolsStyle}`}>
        <button className={`BlockRemove ${removeButtonStyle}`} onClick={this.handleDeleteBlock}>
          <XIcon />
        </button>
        <button className={`DragHandler ${dragButtonStyle}`} data-drag-id={editorId}>
          <DragIcon />
        </button>
      </div>
    )
  }
}

export default connect()(RegionTools)

