import React, { FC } from 'react'

import { Box, BoxProps, Grid, GridProps } from '@chakra-ui/react'

import { useNavbarHeight } from 'containers/Network/components/Navbar'

export const StickySidebarLayout: FC<GridProps> = ({ children, ...rest }) => {
  return (
    <Grid
      templateColumns={{
        base: 'auto',
        xl: 'auto 1fr',
      }}
      templateRows={{
        base: 'auto 1fr',
        xl: 'auto',
      }}
      autoFlow={{
        base: 'column',
        xl: 'row',
      }}
      gridGap={6}
      {...rest}
    >
      {children}
    </Grid>
  )
}

export const StickySidebarLayoutMain: FC<BoxProps> = ({
  children,
  ...rest
}) => {
  return (
    <Box bg="bg.secondary" minW="sm" {...rest}>
      {children}
    </Box>
  )
}

export const StickySidebarLayoutSidebar: FC<BoxProps> = ({
  children,
  ...rest
}) => {
  const navbarHeight = useNavbarHeight()

  return (
    <Box
      position="sticky"
      top={{
        base: undefined,
        xl: navbarHeight,
      }}
      minW="sm"
      maxHeight="calc(100vh - (150px * 2))"
      {...rest}
    >
      {children}
    </Box>
  )
}
