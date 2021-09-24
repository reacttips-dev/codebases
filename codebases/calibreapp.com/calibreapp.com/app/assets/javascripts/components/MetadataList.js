import React from 'react'

import Text from './Type'

const MetadataList = ({ items, ...props }) => (
  <Text as="div" {...props}>
    {items.map((item, index) => (
      <React.Fragment key={index}>
        {item}
        {index === items.length - 1 ? null : ' ∙ '}
      </React.Fragment>
    ))}
  </Text>
)

MetadataList.defaultProps = {
  fontSize: 0
}

export default MetadataList
