import React from 'react'
import LighthouseAuditItem from './LighthouseAuditItem'

class LighthouseAggregationGroup extends React.Component {
  render() {
    return (
      <ul className="list-group m--b4">
        {Object.keys(this.props.audits)
          .map(key => this.props.audits[key])
          .sort((a, b) => a.score - b.score)
          .map((item, i) => (
            <LighthouseAuditItem key={i} {...item} />
          ))}
      </ul>
    )
  }
}

export default LighthouseAggregationGroup
