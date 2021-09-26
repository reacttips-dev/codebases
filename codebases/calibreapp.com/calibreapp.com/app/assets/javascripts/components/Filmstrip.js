import React from 'react'
import { RichFormatter } from '../utils/MetricFormatter'

const Filmstrip = ({ screenshots }) => {
  return (
    <div className="filmstrip">
      <div
        className="filmstrip__clip"
        style={{ width: `${110 * screenshots.length + 1}px` }}
      >
        {screenshots.map((screenshot, id) => {
          return (
            <div key={id} className="filmstrip__frame">
              <RichFormatter
                value={parseInt(screenshot.timing)}
                formatter="humanDuration"
              />
              <img width="140" src={screenshot.url} loading="lazy" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

Filmstrip.defaultProps = {
  screenshots: []
}

export default Filmstrip
