import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { ElloBuyButton } from '../editor/ElloBuyButton'

const EmbedRegion = ({ detailPath, region }) => {
  const data = {}
  data[`data-${region.getIn(['data', 'service'])}-id`] = region.getIn(['data', 'id'])
  return (
    <div className={`EmbedRegion ${region.getIn(['data', 'service'])}`}>
      <div className="embetter" {...data}>
        <Link className="EmbedRegionContent" to={detailPath || region.getIn(['data', 'url'])}>
          <img src={region.getIn(['data', 'thumbnailLargeUrl'])} alt={region.getIn(['data', 'service'])} />
        </Link>
        {
          region.get('linkUrl') && region.get('linkUrl').size ?
            <ElloBuyButton to={region.get('linkUrl')} /> :
            null
        }
      </div>
    </div>
  )
}
EmbedRegion.propTypes = {
  detailPath: PropTypes.string,
  region: PropTypes.object.isRequired,
}
EmbedRegion.defaultProps = {
  detailPath: null,
}

export default EmbedRegion

