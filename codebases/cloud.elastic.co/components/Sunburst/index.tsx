/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import { Component } from 'react'
import ReactFauxDOM from 'react-faux-dom'

import * as d3 from 'd3'

import { Node, NodeWithValue } from './hierarchy'

import './sunburst.scss'

type Props = {
  width: number
  height: number
  segmentClasses: { [segment: string]: string }
  data: Node
  title: string
}

type State = {
  highlightIndices: number[] | null
  centerTitle: string | null
  centerValue: number | null
}

export function splitTitle(title: string, splitLimit: number): string[] {
  let index

  if (title.length > splitLimit) {
    // Try to split on the space character nearest the middle
    const middleIndex = Math.trunc(title.length / 2)

    if (title[middleIndex] === ` `) {
      index = middleIndex
    } else {
      for (let i = middleIndex - 1, j = middleIndex + 1; i > 0 && j < title.length; i--, j++) {
        if (title[i] === ` `) {
          index = i
          break
        } else if (title[j] === ` `) {
          index = j
          break
        }
      }
    }
  }

  return index ? [title.substr(0, index), title.substr(index + 1)] : [title]
}

/**
 * https://bl.ocks.org/kerryrodden/766f8f6d31f645c39f488a0befa1e3c8#index.html
 */
class Sunburst extends Component<Props, State> {
  svg: any

  static defaultProps = {
    title: `Total`,
  }

  state: State = {
    highlightIndices: null,
    centerTitle: null,
    centerValue: null,
  }

  render() {
    const { width, height, data, segmentClasses, title } = this.props

    const container = ReactFauxDOM.createElementNS(`http://www.w3.org/2000/svg`, `svg`)

    // Set the basic SVG dimension and append a group that is translated (moved) to the center of the image.
    const svg = d3
      .select(container)
      .attr(`class`, `sunburst`)
      .attr(`width`, width)
      .attr(`height`, height)
      .on(`mouseleave`, this.onMouseleave)
      .append(`g`)
      .attr(`transform`, `translate(${width / 2},${height / 2})`)

    this.svg = svg

    const radius = Math.min(width, height) / 2

    const partition = d3.partition().size([2 * Math.PI, radius * radius])

    const arc = d3
      .arc()

      // @ts-ignore
      .startAngle((d) => d.x0)

      // @ts-ignore
      .endAngle((d) => d.x1)

      // @ts-ignore
      .innerRadius((d) => Math.sqrt(d.y0))

      // @ts-ignore
      .outerRadius((d) => Math.sqrt(d.y1))

    // Bounding circle underneath the sunburst, to make it easier to detect
    // when the mouse leaves the parent g.
    svg.append(`svg:circle`).attr(`r`, radius).attr(`class`, `transparent`)

    // Turn the data into a d3 hierarchy and calculate the sums.
    const root = d3
      .hierarchy(data)
      .sum((d) => (d as NodeWithValue).size)
      .sort((a, b) => b.value! - a.value!)

    // For efficiency, filter nodes to keep only those large enough to see.
    const nodes = partition(root)
      .descendants()
      .filter((d) => d.x1 - d.x0 > 0.005) // 0.005 radians = 0.29 degrees

    const paths = svg
      .data([data])
      .selectAll(`path`)
      .data(nodes)
      .enter()
      .append(`svg:path`)
      .attr(`display`, (d) => (d.depth ? null : `none`))

      // @ts-ignore
      .attr(`d`, arc)
      .attr(`fill-rule`, `evenodd`)
      .attr(`class`, (d) => segmentClasses[(d.data as any).name])
      .style(`opacity`, this.shouldHighlight)
      .on(`mouseover`, this.onMouseover)

    // Get total size of the tree = value of root node from partition.
    const centerTitle = this.state.centerTitle != null ? this.state.centerTitle : title

    // Rounding these values to handle the case of 0 shards, but need to provide a > 0 value for the viz to draw
    const centerValue =
      this.state.centerValue != null
        ? Math.round(this.state.centerValue)
        : Math.round(paths.datum().value || 0)

    this.centerText(centerTitle!, centerValue)

    return container.toReact()
  }

  shouldHighlight = () => {
    const { highlightIndices } = this.state
    return highlightIndices === null ? 1.0 : 0.3
  }

  centerText(title: string, value: number) {
    const text = this.svg.append(`text`).attr(`class`, `center-text`).attr(`text-anchor`, `middle`)

    // This is a little hacky, and determined empirically given the font
    // sizing in ./sunburst.scss. Basically, if a title is too long to
    // fit comfortably, split it in two.
    const split = splitTitle(title, 13)

    if (split.length > 1) {
      text.append(`tspan`).attr(`class`, `title`).attr(`x`, 0).attr(`y`, `-1.5em`).text(split[0])

      text.append(`tspan`).attr(`class`, `title`).attr(`x`, 0).attr(`y`, `-0.5em`).text(split[1])
    } else {
      text.append(`tspan`).attr(`class`, `title`).attr(`x`, 0).attr(`y`, `-0.5em`).text(split[0])
    }

    text
      .append(`tspan`)
      .attr(`class`, `value`)
      .attr(`x`, 0)
      .attr(`y`, `0.75em`)
      .text(`${value}`)
      .on(`click`, this.onMouseleave)
  }

  onMouseover = (_e, datum) => {
    const sequenceArray = datum.ancestors().reverse()
    sequenceArray.shift() // remove root node from the array

    const highlightIndices: number[] = []

    this.svg.selectAll(`path`).each((datum2, index2) => {
      if (sequenceArray.indexOf(datum2) >= 0) {
        highlightIndices.push(index2)
      }
    })

    this.setState({
      highlightIndices,
      centerTitle: datum.data.name,
      centerValue: datum.value, // this is the sum of the values in the hierarchy
    })
  }

  onMouseleave = () => {
    this.setState({
      highlightIndices: null,
      centerTitle: null,
      centerValue: null,
    })
  }
}

export default Sunburst
