import React, { ReactNode } from 'react'

import { HStack, Stack } from '@chakra-ui/react'
import { RemixiconReactIconComponentType } from 'remixicon-react'

import { Text, Icon, Link } from 'tribe-components'

export interface ExternalLinkProps {
  linkIcon: RemixiconReactIconComponentType
  href: string
  title: ReactNode
  description: ReactNode
}

const ExternalLink: React.FC<ExternalLinkProps> = ({
  title,
  description,
  href,
  linkIcon,
}: ExternalLinkProps) => (
  <Link href={href} isExternal>
    <HStack>
      <Icon
        m="2.51"
        mb="auto"
        ml="0"
        color="accent.base"
        fontSize="lg"
        as={linkIcon}
      />

      <Stack mx="2" my="0">
        <Text textStyle="medium/medium">{title}</Text>

        <Text ml="2.51" textStyle="regular/small" color="label.secondary">
          {description}
        </Text>
      </Stack>
    </HStack>
  </Link>
)

export default ExternalLink
