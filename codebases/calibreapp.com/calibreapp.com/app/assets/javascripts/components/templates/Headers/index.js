import React from 'react'

import { LoadingLine } from '../../Loading'
import { Box } from '../../Grid'

import Header from './Header'
import AddHeader from './Add'

const Headers = ({
  loading,
  headers,
  parentHeaders,
  onUpdate,
  buttonVariant
}) => {
  const handleSave = (index, attributes) => {
    const updatedHeaders = Object.assign([], headers)
    updatedHeaders[index] = attributes
    onUpdate(updatedHeaders)
  }

  const handleRemove = index => {
    if (confirm('Are you sure?')) {
      const updatedHeaders = Object.assign([], headers)
      updatedHeaders.splice(index, 1)
      onUpdate(updatedHeaders)
    }
  }

  return (
    <>
      {loading ? (
        <Box mb={4}>
          <LoadingLine />
        </Box>
      ) : (
        Object.keys(headers).map((id, index) => (
          <Header
            key={id}
            id={id}
            {...headers[id]}
            parentHeaders={parentHeaders}
            onSave={attributes => handleSave(id, attributes)}
            onDelete={() => handleRemove(id)}
            borderBottom={
              index === Object.keys(headers).length - 1 ? 'none' : '1px solid'
            }
            borderBottomColor="grey100"
          />
        ))
      )}

      <AddHeader
        variant={buttonVariant}
        parentHeaders={parentHeaders}
        onSave={attributes => handleSave(headers.length, attributes)}
        mt={headers.length ? 4 : 0}
      />
    </>
  )
}

export default Headers
