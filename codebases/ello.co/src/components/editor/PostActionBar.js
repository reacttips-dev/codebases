import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { selectInnerWidth } from '../../selectors/gui'
import CategoryPostSelector from './CategoryPostSelector'
import { openModal, closeModal } from '../../actions/modals'
import { trackEvent } from '../../actions/analytics'
import { updateBuyLink, updateCategoryId, clearCategoryId } from '../../actions/editor'
import BuyLinkDialog from '../dialogs/BuyLinkDialog'
import {
  selectFeaturedInCategories,
  selectPostSelectedCategories,
  selectSubscribedCategories,
  selectUnsubscribedCategories,
} from '../../selectors/categories'
import {
  ArrowIcon,
  BrowseIcon,
  MoneyIconCircle,
  ReplyAllIcon,
  XIconLG,
} from '../assets/Icons'
import { css, disabled, hover, media, modifier, parent, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const wrapperStyle = css(
  s.flex,
  s.flexWrap,
  s.justifySpaceBetween,
  s.hv40,
  s.lh40,
  s.mt10,
  parent('.PostGrid .isPostReposting',
    { height: 'auto' },
  ),
  media(s.maxBreak2,
    { height: 'auto' },
  ),
  select('& .category-post-selector',
    s.mr10,
    s.ml10,
  ),
)

const leftStyle = css(
  select('& button', s.mr10),
  select('& button:last-child', s.mr0),
  // manage cancel buttons
  media(s.minBreak2,
    select('.PostDetail & .isComment.forCancel.icon-text', s.displayNone),
  ),
  media('(min-width: 20.0625em)',
    select('& .isPost.forCancel.icon-text', s.displayNone),
  ),
)

const rightStyle = css(
  select('& button + button', s.ml10),
  select('& button:first-child', s.ml0),
  // manage cancel buttons
  select('.PostDetail & .isComment.forCancel.label', s.displayNone),
  media(s.minBreak2,
    select('.PostGrid & .isComment.forCancel.label', s.displayNone),
    select('.PostDetail & .isComment.forCancel.label', s.inlineBlock),
  ),
  media('(max-width: 20em)',
    select('& .isPost.forCancel.label', s.displayNone),
  ),
)

const buttonStyle = css(
  s.inlineFlex,
  s.pl10,
  s.pr10,
  s.itemsCenter,
  s.contentCenter,
  s.justifySpaceBetween,
  s.fullWidth,
  s.fullHeight,
  s.bgcBlack,
  s.colorWhite,
  s.hv40,
  s.wv40,
  s.lh40,
  s.nowrap,
  {
    borderRadius: 5,
    transition: `background-color 0.2s ease, color 0.2s ease, width 0.2s ${s.ease}`,
  },
  disabled(s.pointerNone, s.bgcA),
  hover({ backgroundColor: '#6a6a6a' }),
  media(
    s.minBreak3,
    s.pl20,
    s.pr20,
    { width: 'auto' },
    select('&.forSubmit',
      { minWidth: 120 },
    ),
    select('&.isComment, &.isComment',
      s.pl10,
      s.pr10,
    ),
  ),
  select('&.forSubmit',
    s.pl20,
    s.pr20,
    { minWidth: 120 },
  ),
  modifier('.isBuyLinked', s.bgcGreen),
  modifier(
    '.forComment',
    parent(
      '.isComment',
      s.wv40,
      disabled(s.bgcA),
      media(
        s.maxBreak3,
        s.pl10,
        s.pr10,
      ),
    ),
    parent(
      '.PostGrid .isComment',
      s.wv40,
    ),
  ),
  parent('.PostGrid .isPostReposting',
    s.pl10,
    s.pr10,
    select('&.forSubmit',
      s.pl20,
      s.pr20,
    ),
  ),
  modifier('.forSubmit', s.bgcGreen, disabled(s.bgcA), hover({ backgroundColor: '#02b302' }), { width: 'auto' }),
  select('&.isComment', s.wv40, media(s.minBreak2, s.wv40)),
  select('&.isComment.forSubmit',
    s.wv40,
    { minWidth: 0 },
    media(s.maxBreak2,
      s.pl20,
      s.pr20,
      { width: 'auto' },
      select('& .SVGIcon',
        s.displayNone,
      ),
    ),
  ),
  parent('.PostGrid', s.wv40, media(s.minBreak2, s.wv40)),
  parent('.PostGrid .isComment.forComment', s.displayNone),
)

const cancelTextButtonStyle = css(
  s.colorA,
  s.px10,
  { width: 'auto' },
  hover({ color: '#6a6a6a' }),
  media(s.minBreak2,
    s.pl0,
  ),
)

const labelStyle = css(
  s.displayNone,
  s.m0,
  media(
    s.minBreak3,
    s.inlineBlock,
    { marginRight: 10 },
  ),
  parent('.isComment', s.displayNone),
  parent('.PostGrid', s.displayNone),
  parent('.isComment.forSubmit', s.displayNone),
  parent('.forSubmit',
    s.inlineBlock,
    select('& + .SVGIcon', { transform: 'scale(1.2)' }),
  ),
  media(s.maxBreak2,
    parent('.isComment.forSubmit', s.inlineBlock),
    parent('.isComment.forSubmit .SVGIcon', s.displayNone),
  ),
)

const hide = css(s.hide)

function mapStateToProps(state, props) {
  return {
    featuredInCategories: selectFeaturedInCategories(state, props),
    innerWidth: selectInnerWidth(state),
    selectedCategories: selectPostSelectedCategories(state, props),
    subscribedCategories: selectSubscribedCategories(state, props),
    unsubscribedCategories: selectUnsubscribedCategories(state, props),
  }
}

class PostActionBar extends Component {
  static propTypes = {
    buyLink: PropTypes.string,
    cancelAction: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    disableSubmitAction: PropTypes.bool.isRequired,
    editorId: PropTypes.string.isRequired,
    featuredInCategories: PropTypes.array.isRequired,
    handleFileAction: PropTypes.func.isRequired,
    hasMedia: PropTypes.bool,
    inlineEditor: PropTypes.bool.isRequired,
    innerWidth: PropTypes.number.isRequired,
    isComment: PropTypes.bool.isRequired,
    isGridMode: PropTypes.bool.isRequired,
    isPostEditing: PropTypes.bool.isRequired,
    isPostReposting: PropTypes.bool.isRequired,
    postCategories: PropTypes.object,
    postIntoCategory: PropTypes.bool.isRequired,
    replyAllAction: PropTypes.func,
    submitAction: PropTypes.func.isRequired,
    submitText: PropTypes.string.isRequired,
    subscribedCategories: PropTypes.array.isRequired,
    selectedCategories: PropTypes.array.isRequired,
    unsubscribedCategories: PropTypes.array.isRequired,
  }

  static defaultProps = {
    buyLink: null,
    hasMedia: false,
    postCategories: null,
    replyAllAction: null,
  }

  constructor(props) {
    super(props)
    this.state = {
      resetCategorySelection: false,
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // reset the resets
    if (!prevState.resetCategorySelection && this.state.resetCategorySelection) {
      this.refreshResets()
    }
  }

  onAddBuyLink = ({ value }) => {
    const { dispatch, editorId } = this.props
    dispatch(updateBuyLink(editorId, value))
    this.onCloseModal()
  }

  onCloseModal = () => {
    const { dispatch } = this.props
    dispatch(closeModal())
  }

  onSelectCategory = (category) => {
    const { dispatch, editorId } = this.props
    dispatch(updateCategoryId(editorId, category.get('id')))

    this.setState({
      resetCategorySelection: true,
    })
  }

  onClearCategory = () => {
    const { dispatch, editorId } = this.props
    dispatch(clearCategoryId(editorId))
  }

  onTrackEvent = (eventName, eventData) => {
    const { dispatch } = this.props
    dispatch(trackEvent(eventName, eventData))
  }

  submitted = () => {
    const { submitAction } = this.props
    submitAction()
  }

  handleFileBrowser = (e) => {
    const { handleFileAction } = this.props
    handleFileAction(e)
    this.fileBrowser.value = ''
  }

  browse = () => {
    this.browseButton.blur()
    this.fileBrowser.click()
  }

  cancel = () => {
    this.props.cancelAction()
  }

  money = () => {
    const { dispatch, buyLink, submitText } = this.props
    dispatch(openModal(
      <BuyLinkDialog
        dispatch={dispatch}
        onConfirm={this.onAddBuyLink}
        onDismiss={this.onCloseModal}
        text={buyLink}
        editorType={submitText}
      />))
  }

  refreshResets = () => {
    this.setState({
      resetCategorySelection: false,
    })
  }

  render() {
    const {
      disableSubmitAction,
      editorId,
      featuredInCategories,
      hasMedia,
      inlineEditor,
      innerWidth,
      isGridMode,
      isPostEditing,
      isPostReposting,
      isComment,
      postCategories,
      postIntoCategory,
      replyAllAction,
      selectedCategories,
      submitText,
      subscribedCategories,
      unsubscribedCategories,
    } = this.props
    const { resetCategorySelection } = this.state
    const isBuyLinked = this.props.buyLink && this.props.buyLink.length
    let hasPostIntoCategory = false
    if (!inlineEditor && postIntoCategory &&
      (!isPostEditing ||
      (isPostEditing && postCategories && postCategories.size > 0))) {
      hasPostIntoCategory = true
    }

    // post version
    if (!isComment) {
      // desktop post version
      if ((innerWidth > 639 && !isPostReposting) ||
        (innerWidth > 639 && isPostReposting && !isGridMode)) {
        return (
          <div className={wrapperStyle} id={editorId}>
            <div className={leftStyle}>
              <button className={`PostActionButton forCancel label ${cancelTextButtonStyle}`} onClick={this.cancel}>
                <span>Cancel</span>
              </button>
            </div>

            <div className={rightStyle}>
              <button
                className={`PostActionButton forUpload ${buttonStyle}`}
                onClick={this.browse}
                ref={(comp) => { this.browseButton = comp }}
              >
                <span className={labelStyle}>Upload</span>
                <BrowseIcon />
              </button>
              <button
                className={classNames('PostActionButton forMoney', { isBuyLinked }, `${buttonStyle}`)}
                disabled={!hasMedia}
                onClick={this.money}
              >
                <span className={labelStyle}>Sell</span>
                <MoneyIconCircle />
              </button>
              {hasPostIntoCategory &&
                <CategoryPostSelector
                  featuredInCategories={featuredInCategories}
                  isPostEditing={isPostEditing}
                  onSelect={this.onSelectCategory}
                  onClear={this.onClearCategory}
                  postCategories={postCategories}
                  resetSelection={resetCategorySelection}
                  selectedCategories={selectedCategories}
                  subscribedCategories={subscribedCategories}
                  trackEvent={this.onTrackEvent}
                  unsubscribedCategories={unsubscribedCategories}
                />
              }
              <button
                className={`PostActionButton forSubmit for${submitText} ${buttonStyle}`}
                disabled={disableSubmitAction}
                ref={(comp) => { this.submitButton = comp }}
                onClick={this.submitted}
              >
                <span className={labelStyle}>{submitText}</span>
                <ArrowIcon />
              </button>
            </div>
            <input
              className={hide}
              onChange={this.handleFileBrowser}
              ref={(comp) => { this.fileBrowser = comp }}
              type="file"
              accept="image/*"
              multiple
            />
          </div>
        )
      }

      // mobile post version
      return (
        <div className={wrapperStyle} id={editorId}>
          {hasPostIntoCategory &&
            <CategoryPostSelector
              featuredInCategories={featuredInCategories}
              isPostEditing={isPostEditing}
              onSelect={this.onSelectCategory}
              onClear={this.onClearCategory}
              postCategories={postCategories}
              resetSelection={resetCategorySelection}
              selectedCategories={selectedCategories}
              subscribedCategories={subscribedCategories}
              trackEvent={this.onTrackEvent}
              unsubscribedCategories={unsubscribedCategories}
            />
          }
          <div className={leftStyle}>
            <button
              className={`PostActionButton forUpload ${buttonStyle}`}
              onClick={this.browse}
              ref={(comp) => { this.browseButton = comp }}
            >
              <span className={labelStyle}>Upload</span>
              <BrowseIcon />
            </button>
            <button
              className={classNames('PostActionButton forMoney', { isBuyLinked }, `${buttonStyle}`)}
              disabled={!hasMedia}
              onClick={this.money}
            >
              <span className={labelStyle}>Sell</span>
              <MoneyIconCircle />
            </button>
            <button
              className={`PostActionButton isPost forCancel icon-text ${buttonStyle}`}
              onClick={this.cancel}
              disabled={disableSubmitAction}
            >
              <span className={labelStyle}>Cancel</span>
              <XIconLG />
            </button>
          </div>

          <div className={rightStyle}>
            <button className={`PostActionButton isPost forCancel label ${cancelTextButtonStyle}`} onClick={this.cancel}>
              <span>Cancel</span>
            </button>
            <button
              className={`PostActionButton forSubmit for${submitText} ${buttonStyle}`}
              disabled={disableSubmitAction}
              ref={(comp) => { this.submitButton = comp }}
              onClick={this.submitted}
            >
              <span className={labelStyle}>{submitText}</span>
              <ArrowIcon />
            </button>
          </div>
          <input
            className={hide}
            onChange={this.handleFileBrowser}
            ref={(comp) => { this.fileBrowser = comp }}
            type="file"
            accept="image/*"
            multiple
          />
        </div>
      )
    }

    // comment version
    return (
      <div className={wrapperStyle} id={editorId}>
        <div className={leftStyle}>
          <button
            className={`PostActionButton isComment forUpload ${buttonStyle}`}
            onClick={this.browse}
            ref={(comp) => { this.browseButton = comp }}
          >
            <span className={labelStyle}>Upload</span>
            <BrowseIcon />
          </button>
          {replyAllAction &&
            <button className={`PostActionButton isComment forReplyAll ${buttonStyle}`} onClick={replyAllAction}>
              <span className={labelStyle}>Reply All</span>
              <ReplyAllIcon />
            </button>
          }
          <button
            className={`PostActionButton isComment forCancel icon-text ${buttonStyle}`}
            onClick={this.cancel}
            disabled={disableSubmitAction}
          >
            <span className={labelStyle}>Cancel</span>
            <XIconLG />
          </button>
        </div>

        <div className={rightStyle}>
          <button className={`PostActionButton isComment forCancel label ${cancelTextButtonStyle}`} onClick={this.cancel}>
            <span>Cancel</span>
          </button>
          <button
            className={`PostActionButton isComment forSubmit for${submitText} ${buttonStyle}`}
            disabled={disableSubmitAction}
            ref={(comp) => { this.submitButton = comp }}
            onClick={this.submitted}
          >
            <span className={labelStyle}>{submitText}</span>
            <ArrowIcon />
          </button>
        </div>
        <input
          className={hide}
          onChange={this.handleFileBrowser}
          ref={(comp) => { this.fileBrowser = comp }}
          type="file"
          accept="image/*"
          multiple
        />
      </div>
    )
  }
}

export default connect(mapStateToProps)(PostActionBar)

