import React, { PureComponent } from 'react'
import Mousetrap from 'mousetrap'
import { SHORTCUT_KEYS } from '../../constants/application_types'
import { css } from '../../styles/jss'
import * as s from '../../styles/jso'

export const whatUpdated = (thisProps, nextProps) =>
  Object.keys(nextProps).filter(prop => nextProps[prop] !== thisProps[prop])

/* eslint-disable quotes */
const svgHorizontalLines = `<line stroke='rgba(255,0,255,0.5)' stroke-dasharray='8, 2' x1='0' y1='19.5' x2='40' y2='19.5'/><line stroke='rgb(255,0,255)' x1='0' y1='39.5' x2='40' y2='39.5'/>`
const svgVerticalLines = `<line stroke='rgba(255,0,255,0.5)' stroke-dasharray='8, 2' x1='19.5' y1='0' x2='19.5' y2='40'/><line stroke='rgb(255,0,255)' x1='39.5' y1='0' x2='39.5' y2='40'/>`
const svgUrlString = gridLines => `data:image/svg+xml;charset=utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><g fill='none' stroke-miter-limit='10'>${gridLines}</g></svg>`
/* eslint-enable quotes */

const gridStyle = css(
  s.fixed,
  s.flood,
  s.zGrid,
  s.pointerNone,
  { opacity: 0.15 },
  { background: 'transparent 0 0 repeat' },
)

const horizontalGridStyle = css({ backgroundImage: `url("${svgUrlString(svgHorizontalLines)}")` })
const verticalGridStyle = css({ backgroundImage: `url("${svgUrlString(svgVerticalLines)}")` })

export default class DevTools extends PureComponent {

  state = {
    isHorizontalGridVisible: false,
    isVerticalGridVisible: false,
  }

  componentDidMount() {
    Mousetrap.bind(SHORTCUT_KEYS.DT_GRID_TOGGLE, () => {
      this.nextGridForToggle()
    })

    Mousetrap.bind(SHORTCUT_KEYS.DT_GRID_CYCLE, () => {
      this.nextGridForCycle()
    })
  }

  componentWillUnmount() {
    Mousetrap.unbind(SHORTCUT_KEYS.DT_GRID_TOGGLE)
    Mousetrap.unbind(SHORTCUT_KEYS.DT_GRID_CYCLE)
  }

  // Toggles the full grid overlay.
  nextGridForToggle() {
    const { isHorizontalGridVisible, isVerticalGridVisible } = this.state
    if (isHorizontalGridVisible && isVerticalGridVisible) {
      this.setState({ isHorizontalGridVisible: false, isVerticalGridVisible: false })
    } else if (!isHorizontalGridVisible && !isVerticalGridVisible) {
      this.setState({ isHorizontalGridVisible: true, isVerticalGridVisible: true })
    } else if (isHorizontalGridVisible && !isVerticalGridVisible) {
      this.setState({ isHorizontalGridVisible, isVerticalGridVisible: true })
    } else if (!isHorizontalGridVisible && isVerticalGridVisible) {
      this.setState({ isHorizontalGridVisible: true, isVerticalGridVisible })
    }
  }

  // Cycles through horizontal and vertical grid lines being on.
  nextGridForCycle() {
    const { isHorizontalGridVisible, isVerticalGridVisible } = this.state
    if (isHorizontalGridVisible && isVerticalGridVisible) {
      this.setState({ isHorizontalGridVisible: false, isVerticalGridVisible })
    } else if (!isHorizontalGridVisible && !isVerticalGridVisible) {
      this.setState({ isHorizontalGridVisible, isVerticalGridVisible: true })
    } else if (isHorizontalGridVisible && !isVerticalGridVisible) {
      this.setState({ isHorizontalGridVisible: false, isVerticalGridVisible: true })
    } else if (!isHorizontalGridVisible && isVerticalGridVisible) {
      this.setState({ isHorizontalGridVisible: true, isVerticalGridVisible: false })
    }
  }


  render() {
    const { isHorizontalGridVisible, isVerticalGridVisible } = this.state
    return (
      <div className="DevTools">
        { isHorizontalGridVisible && <div className={`${gridStyle} ${horizontalGridStyle}`} /> }
        { isVerticalGridVisible && <div className={`${gridStyle} ${verticalGridStyle}`} /> }
      </div>
    )
  }
}

