import React from 'react'

import { Flex, Box } from '../Grid'
import { ChevronRightIcon } from '../Icon'
import { Heading } from '../Type'

const Breadcrumbs = ({ children, ...props }) => {
  const childArray = React.Children.toArray(children)

  return (
    <Flex {...props}>
      {childArray.map((child, index) => {
        const lastItem = index === childArray.length - 1
        return (
          <React.Fragment key={index}>
            <Box>
              <Heading
                as="h3"
                level="md"
                color={lastItem ? 'grey500' : 'grey300'}
              >
                {child}
              </Heading>
            </Box>
            {lastItem ? null : (
              <Box mx={2} pt="3px">
                <ChevronRightIcon color="grey300" />
              </Box>
            )}
          </React.Fragment>
        )
      })}
    </Flex>
  )
}

export default Breadcrumbs
