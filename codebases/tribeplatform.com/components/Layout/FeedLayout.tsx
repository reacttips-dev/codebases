import React, { FC } from 'react'

import { Box, BoxProps, Grid, GridProps, VStack } from '@chakra-ui/react'

export const FeedLayout: FC<GridProps> = ({ children, ...rest }) => {
  return (
    <Grid
      templateColumns={{
        base: '0 auto 0',
        sm: '1fr auto 1fr',
      }}
      templateAreas={{
        base: `
            '. content .'
            `,
        xl: `
            '. content widgets'
            `,
      }}
      py={5}
      pt={8}
      mb={10}
      gridGap={{
        base: 0,
        md: 6,
      }}
      {...rest}
    >
      {children}
    </Grid>
  )
}

export type FeedLayoutMainProps = BoxProps & {
  size?: string
}

export const FeedLayoutMain: FC<FeedLayoutMainProps> = ({
  size,
  children,
  ...rest
}) => {
  let maxWidth = 600
  switch (size) {
    case 'lg':
      maxWidth = 720
      break
    case 'xl':
      maxWidth = 800
      break
    case '2xl':
      maxWidth = 924
      break
    default:
      break
  }

  return (
    <Box
      gridArea="content"
      h="full"
      bg="bg.secondary"
      width={{
        base: '100vw',
        sm: 600,
        xl: maxWidth,
      }}
      {...rest}
    >
      <VStack spacing={[4, 6]} align="stretch">
        {children}
      </VStack>
    </Box>
  )
}

export const FeedLayoutWide: FC<BoxProps> = ({ children }) => {
  return <FeedLayoutMain size="lg">{children}</FeedLayoutMain>
}

export const FeedLayoutWidgets: FC<BoxProps> = ({ children, ...rest }) => {
  return (
    <VStack
      w={350}
      spacing="4"
      align="stretch"
      _empty={{ w: 0, ml: 0 }}
      gridArea="widgets"
      display={{
        base: 'none',
        xl: 'block',
      }}
      {...rest}
    >
      {children}
    </VStack>
  )
}
