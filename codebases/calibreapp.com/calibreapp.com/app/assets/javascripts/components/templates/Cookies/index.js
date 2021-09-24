import React from 'react'

import { LoadingLine } from '../../Loading'
import { Box } from '../../Grid'

import Cookie from './Cookie'
import AddCookie from './Add'

const Cookies = ({
  loading,
  cookies,
  parentCookies,
  onUpdate,
  buttonVariant
}) => {
  const handleSave = (index, attributes) => {
    const updatedCookies = Object.assign([], cookies)
    updatedCookies[index] = attributes
    onUpdate(updatedCookies)
  }

  const handleRemove = index => {
    if (confirm('Are you sure?')) {
      const updatedCookies = Object.assign([], cookies)
      updatedCookies.splice(index, 1)
      onUpdate(updatedCookies)
    }
  }

  return (
    <>
      {loading ? (
        <Box mb={4}>
          <LoadingLine />
        </Box>
      ) : (
        Object.keys(cookies).map((id, index) => (
          <Cookie
            key={id}
            id={id}
            {...cookies[id]}
            parentCookies={parentCookies}
            onSave={attributes => handleSave(id, attributes)}
            onDelete={() => handleRemove(id)}
            borderBottom={
              index === Object.keys(cookies).length - 1 ? 'none' : '1px solid'
            }
            borderBottomColor="grey100"
          />
        ))
      )}

      <AddCookie
        variant={buttonVariant}
        parentCookies={parentCookies}
        onSave={attributes => handleSave(cookies.length, attributes)}
        mt={cookies.length ? 4 : 0}
      />
    </>
  )
}

export default Cookies
