import React from 'react'

import { Grid, Box, HStack, GridItem } from '@chakra-ui/react'

export const BrowserTabs = () => {
  return (
    <Grid
      templateColumns="repeat(3, 1fr)"
      bg="border.base"
      w="full"
      h="10"
      borderTopRadius="6px"
    >
      <GridItem d="flex" px="4" colSpan={1} h="10" alignItems="center">
        <HStack spacing={2}>
          <Box bg="danger.base" borderRadius="full" h="10px" w="10px"></Box>
          <Box bg="warning.base" borderRadius="full" h="10px" w="10px"></Box>
          <Box bg="success.base" borderRadius="full" h="10px" w="10px"></Box>
        </HStack>
      </GridItem>
    </Grid>
  )
}
