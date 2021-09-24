import React, { CSSProperties } from 'react'

import { VStack } from '@chakra-ui/layout'

import { Network } from 'tribe-api'
import { ImageUpload, ImageUploadProps, Text } from 'tribe-components'

interface NetworkFormImageUploadProps
  extends Pick<ImageUploadProps, 'variant' | 'isSquared'> {
  description: string
  label: string
  onFileChange: (filesList: FileList | File[]) => Promise<void>
  src: Network['logo']
}

const imageUploadProps = {
  skeletonProps: {
    w: 'full',
    h: 'full',
  },
  style: {
    objectFit: 'cover',
    height: '100%',
  } as CSSProperties,
}

const NetworkFormImageUpload: React.FC<NetworkFormImageUploadProps> = ({
  description,
  label,
  onFileChange,
  src,
  variant = 'logo',
  isSquared,
}) => (
  <VStack
    alignItems="flex-start"
    mb={{ base: 4, sm: 6 }}
    mr={{ base: 0, sm: 4 }}
    width={{ base: '100%', sm: 'auto' }}
  >
    <Text mb={4} textStyle="semibold/medium">
      {label}
    </Text>

    <ImageUpload
      variant={variant}
      name=""
      src={src || ''}
      onFileChange={onFileChange}
      isSquared={isSquared}
      {...(variant === 'avatar' && {
        size: '4xs',
      })}
      {...imageUploadProps}
    />

    <Text mb={6} mt={3} color="label.secondary" textStyle="regular/small">
      {description}
    </Text>
  </VStack>
)

export default NetworkFormImageUpload
