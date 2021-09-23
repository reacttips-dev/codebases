import React from 'react'

import { Box, Container, LayoutProps, SpaceProps } from '@chakra-ui/react'

import { ErrorBoundary } from 'components/common'

export type CenterLayoutProps = LayoutProps &
  SpaceProps & {
    fullWidth?: boolean
  }

const defaultWidths = {
  base: 'full',
  sm: 600,
  lg: 720,
  xl: 800,
}

export const CenterLayout: React.FC<CenterLayoutProps> = ({
  fullWidth,
  boxSizing,
  children,
  ...rest
}) => (
  <Container
    w="full"
    h="full"
    maxWidth={['100vw', '100%']}
    p={0}
    boxSizing={boxSizing}
  >
    <Box
      h="full"
      bg="bg.secondary"
      py={5}
      pt={8}
      mx="auto"
      width={fullWidth ? 'full' : defaultWidths}
      {...rest}
    >
      <ErrorBoundary>{children}</ErrorBoundary>
    </Box>
  </Container>
)
