import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debounce from 'lodash/debounce'
import sortBy from 'lodash/sortBy'

import styles from '../../css/drag-select.css'

import { APP_HOME_SELECTION_CLICKDRAGGED } from '../../constants/TrackingEvents'
import { trackEvent } from '../../utils/analytics'

// Elements that should not trigger a drag when mousedown'd on
const INTERACTIVE_ELEMENTS = [
  'a',
  'input',
  'textarea',
  'label',
  'select',
  'radio',
  'button',
  'ul',
  '[class*="responsive-tile"]',
  'body[class*="modal-portal__open"]',
  'html[class*="modal__"]',
  'div[class*="dialog__"]',
  'div[class*="filters_"]',
  '[aria-modal="true"]',
  '[class*="inbox-loader"]',
  '[id*="feedback_container"]',
  '[class*="_hj-"]',
  '[data-id*="global-search-ui"]'
]

// Elements that should not clear the selected documents when clicking
const INTERACTIVE_CLICK_ELEMENTS = INTERACTIVE_ELEMENTS.concat([
  '[class*="global-navigation"]',
  '[class*="multiselect"]',
  '[id*="sidebar-root"]'
])

export const DOCUMENT_SELECTOR = '[data-selectable="true"]'

class DragSelect extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    gridRef: PropTypes.object.isRequired,
    onSelection: PropTypes.func.isRequired,
    permissions: PropTypes.object.isRequired
  }

  state = {
    eventsAdded: false,
    isDragging: false,

    // Sets the bounds for where dragging is allowed to
    // start from (the container boundaries)
    boundsX: 0,
    boundsY: 0,

    // Coordinates where the user initially clicked in the
    // DOM and where the mouse is now (used to calculate the
    // visual bounds for the dragger on-screen)
    currentX: -10,
    currentY: -10,
    startX: -10,
    startY: -10
  }

  dragSourceScope = null

  isDragHandling = false
  isScrollHandling = false
  scrollBase = 0

  availableNodes = []
  selectedNodes = []
  prevSelectedNodes = '[]'

  componentDidMount () {
    const appContext = window.inGlobalContext && window.inGlobalContext.appShell && window.inGlobalContext.appShell.getFeatureContext('home')
    this.dragSourceScope = (appContext && appContext.getFeatureRootElement && appContext.getFeatureRootElement()) || document

    if (this.canDrag() && this.getContainer(this.props) && !this.state.eventsAdded) {
      this.initEvents()
    }

    if (!this.props.config.dragDropEnabled) {
      this.dragSourceScope.addEventListener('click', this.handleNoflagClick, true)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (!prevProps.config.dragDropEnabled && this.props.config.dragDropEnabled) {
      this.dragSourceScope.removeEventListener('click', this.handleNoflagClick, true)
    }

    if (!prevState.eventsAdded && this.getContainer(this.props) && this.canDrag()) {
      this.initEvents()
    }
  }

  componentWillUnmount () {
    this.dragSourceScope.removeEventListener('mousedown', this.handleMouseDown, false)
    // this.dragSourceScope.removeEventListener('touchstart', this.handleMouseDown, { passive: false })
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.handleResize)
    this.dragSourceScope.removeEventListener('click', this.handleNoflagClick, true)

    this.dragSourceScope = null
  }

  // Checks the feature flag to make sure dragging is enabled,
  // and then makes sure the user has any permissions around
  // moving documents.
  canDrag = () => {
    const { config: { dragDropEnabled }, permissions = {} } = this.props

    if (!dragDropEnabled) return false

    for (let key in permissions) {
      if (permissions[key].canMove) {
        return true
      }
    }

    return false
  }

  getContainer = (props = this.props) => {
    return props.gridRef.current &&
      props.gridRef.current.props &&
      props.gridRef.current.props.className
      ? props.gridRef.current.props.className
      : null
  }

  handleNoflagClick = e => {
    if (INTERACTIVE_CLICK_ELEMENTS.some(c => !!e.target.closest(c))) return
    this.props.actions.clearSelectedDocuments()
  }

  initEvents = () => {
    this.scrollBase = window.scrollY
    if (!this.state.eventsAdded) {
      this.dragSourceScope.addEventListener('mousedown', this.handleMouseDown, false)
      // Commenting this out for now, going to leave it in to potentially add later once we
      // have more mobile/tablet support
      // this.dragSourceScope.addEventListener('touchstart', this.handleMouseDown, { passive: false })
      window.addEventListener('scroll', this.handleScroll)
      window.addEventListener('resize', this.handleResize)
    }
    this.setState({ ...this.getBounds(), eventsAdded: true })
  }

  calculateAvailableNodes = (initial = true, scrollAmount = 0) => {
    if (initial) this.availableNodes = []

    const selections = [...document.querySelectorAll(DOCUMENT_SELECTOR)].map(n => {
      const { id, type, title, currentSpace } = n.dataset
      const { x, y, width: w, height: h } = n.getBoundingClientRect()
      return {
        id,
        type,
        x,
        y,
        w,
        h,
        title,
        currentSpaceID: currentSpace
      }
    })

    selections.forEach(s => {
      let idx = -1
      if (!initial) {
        idx = this.availableNodes.findIndex(n => n.id === s.id && n.type === s.type)
      }

      if (idx === -1) {
        this.availableNodes.push(s)
      } else {
        this.availableNodes[idx].y = s.y
      }
    })

    // If we're scrolling, we need to track all of the items
    // that could be virtualized and append the scroll to their
    // y value
    if (!initial && scrollAmount !== 0 && this.availableNodes.length !== selections.length) {
      const removedNodes = this.availableNodes.filter(n => !selections.find(s => s.id === n.id && s.type === n.type))
      removedNodes.forEach(r => {
        const idx = this.availableNodes.findIndex(n => n.id === r.id && n.type === r.type)
        if (idx >= 0) {
          this.availableNodes[idx].y -= scrollAmount
        }
      })
    }
  }

  checkSelections = () => {
    this.selectedNodes = []

    this.availableNodes.forEach(n => {
      if (this.isColliding(n)) {
        this.selectedNodes.push(n)
      }
    })

    this.handleSelection(this.selectedNodes)
  }

  getBounds = () => {
    if (!this.getContainer()) return { boundsX: 0, boundsY: 0 }

    const wrapper = document.querySelector('.' + this.getContainer().split(' ')[0])
    if (!wrapper) {
      return { boundsX: 0, boundsY: 0 }
    }

    const rect = wrapper.getBoundingClientRect()
    return {
      boundsX: Math.max(rect.x - 30, 0),
      boundsY: rect.y - 75
    }
  }

  getDimensions = () => {
    const adjustedCurrentX = Math.max(this.state.boundsX, this.state.currentX)

    return {
      top: Math.min(this.state.currentY, this.state.startY),
      left: Math.min(adjustedCurrentX, this.state.startX),
      width: Math.abs(adjustedCurrentX - this.state.startX),
      height: Math.abs(this.state.currentY - this.state.startY)
    }
  }

  handleMouseDown = e => {
    // No right clicks
    if (e.which === 3) return

    // Make sure mouse click is in acceptable bounds
    if (e.clientX < this.state.boundsX || e.clientY < this.state.boundsY) {
      // If the click is out of bounds, trigger a one-time event that clears the selections
      // _if_ the user has clicked in the main whitespace
      window.addEventListener('mouseup', e => {
        if (INTERACTIVE_CLICK_ELEMENTS.some(c => !!e.target.closest(c))) return
        this.props.actions.clearSelectedDocuments()
      }, { once: true })

      return
    }

    // Detect element being clicked on
    if (INTERACTIVE_ELEMENTS.some(c => !!e.target.closest(c))) return

    // Fixes a touch-specific bug
    // if (e.type === 'touchstart') e.preventDefault()

    // This class is to disable any pointer-events on items
    // while scrolling (prevents weird animations and unintended
    // interactions)
    if (!document.body.classList.contains('is-dragging')) {
      document.body.classList.add('is-dragging')
    }

    document.addEventListener('mousemove', this.handleMouseMove, true)
    // document.addEventListener('touchmove', this.handleMouseMove, true)
    window.addEventListener('mouseup', this.handleMouseUp, true)
    // window.addEventListener('touchend', this.handleMouseUp, true)

    this.calculateAvailableNodes()

    this.setState({
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY
    })
  }

  handleMouseMove = e => {
    if (!this.state.isDragging) return

    e.preventDefault()

    if (!this.isDragHandling) {
      window.requestAnimationFrame(() => {
        if (this.state.isDragging) {
          this.setState({
            currentX: e.clientX,
            currentY: e.clientY
          }, () => this.checkSelections())
        }

        this.isDragHandling = false
      })

      this.isDragHandling = true
    }
  }

  handleMouseUp = e => {
    if (!this.state.isDragging) return

    if (document.body.classList.contains('is-dragging')) {
      document.body.classList.remove('is-dragging')
    }

    // Remove the handlers created on mousedown/touchstart
    document.removeEventListener('mousemove', this.handleMouseMove, true)
    // this.dragSourceScope.removeEventListener('touchmove', this.handleMouseMove, true)
    window.removeEventListener('mouseup', this.handleMouseUp, true)
    // window.removeEventListener('touchend', this.handleMouseUp, true)

    // Process the selections
    this.props.actions.setDragSelections(sortBy(this.selectedNodes, 'y', 'x'), e.shiftKey)
    trackEvent(APP_HOME_SELECTION_CLICKDRAGGED)
    this.selectedNodes = []
    this.availableNodes = []
    this.setState(this.resetDragging())
  }

  handleResize = debounce(() => {
    this.setState({
      ...this.resetDragging(),
      ...this.getBounds()
    })
  }, 100)

  handleScroll = e => {
    if (window.scrollY !== this.scrollBase) {
      if (!this.isScrollHandling) {
        window.requestAnimationFrame(() => {
          let cb = function () {}
          let newState = this.getBounds()
          if (this.state.isDragging) {
            newState.startY = this.state.startY - (window.scrollY - this.scrollBase)
            this.checkSelections()
            cb = this.calculateAvailableNodes(false, window.scrollY - this.scrollBase)
          }

          this.setState(newState, cb)

          this.scrollBase = window.scrollY
          this.isScrollHandling = false
        })

        this.isScrollHandling = true
      }
    }
  }

  handleSelection = (selected) => {
    const parsedNodes = JSON.stringify(sortBy(selected, 'y', 'x'))

    if (parsedNodes !== this.prevSelectedNodes) {
      this.props.onSelection(parsedNodes)
      this.prevSelectedNodes = parsedNodes
    }
  }

  isColliding = elementBounds => {
    const { top: sy, left: sx, width: sw, height: sh } = this.getDimensions()
    const { x: ex, y: ey, h: eh, w: ew } = elementBounds

    return (
      sx < ex + ew &&
      sx + sw > ex &&
      sy < ey + eh &&
      sh + sy > ey
    )
  }

  resetDragging = () => {
    this.handleSelection([])
    return {
      isDragging: false,
      startX: -10,
      startY: -10,
      currentX: -10,
      currentY: -10
    }
  }

  render () {
    return <>
      {this.state.isDragging && <div style={this.getDimensions()} className={styles.root} />}
    </>
  }
}

export default DragSelect
