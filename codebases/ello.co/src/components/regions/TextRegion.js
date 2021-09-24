/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-danger */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class TextRegion extends PureComponent {
  static propTypes = {
    content: PropTypes.string.isRequired,
    detailPath: PropTypes.string.isRequired,
    isGridMode: PropTypes.bool.isRequired,
  }

  static contextTypes = {
    onClickRenderedContent: PropTypes.func,
  }

  render() {
    const { content, isGridMode, detailPath } = this.props
    const isHot = isGridMode && detailPath
    return (
      <div className="TextRegion">
        <div
          className={classNames('RegionContent', { isHot })}
          dangerouslySetInnerHTML={{ __html: content }}
          onClick={e => this.context.onClickRenderedContent(e, detailPath)}
        />
      </div>
    )
  }
}

