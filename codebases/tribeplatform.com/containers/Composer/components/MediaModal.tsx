import React, { useState, useEffect } from 'react'

import { Circle, Flex } from '@chakra-ui/react'
import { Carousel } from 'react-responsive-carousel'
import ArrowLeftLineIcon from 'remixicon-react/ArrowLeftLineIcon'
import ArrowRightLineIcon from 'remixicon-react/ArrowRightLineIcon'
import DownloadLineIcon from 'remixicon-react/DownloadLineIcon'

import {
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Icon,
  ModalHeader,
  downloadImage,
} from 'tribe-components'

export interface slide {
  type: string
  node: any
}

const Indicator = ({ children, handleClick, disabled, styleProps = {} }) => {
  return (
    <Circle
      onClick={handleClick}
      border="1px"
      borderColor="bg.secondary"
      cursor="pointer"
      color="label.primary"
      size="40px"
      zIndex="docked"
      mx={3}
      pos="absolute"
      display={{ base: 'none', sm: 'flex' }}
      sx={{
        top: '50%',
        transform: 'translateX("-50%")',
        opacity: disabled
          ? 'var(--tribe-opacity-disabled)'
          : 'var(--tribe-opacity-none)',
        pointerEvents: disabled ? 'none' : 'all',
        bg: disabled ? 'bg.secondary' : 'transparent',
        ...styleProps,
      }}
    >
      {children}
    </Circle>
  )
}
export interface MediaModalProps {
  isVisible?: boolean
  handleModalClose: () => void
  activeMediaIndex: number
  slides: slide[]
}
const MediaModal = ({
  slides,
  isVisible = false,
  handleModalClose,
  activeMediaIndex,
}: MediaModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(activeMediaIndex)
  const length = slides?.length
  const isPreviousButtonDisabled = currentIndex === 0
  const isNextButtonDisabled = currentIndex === length - 1

  const handleDownload = () => {
    const imageObject = slides[currentIndex]
    const src = imageObject?.node?.attribs?.src
    if (!src) return
    downloadImage(src)
  }

  useEffect(() => {
    setCurrentIndex(activeMediaIndex)
  }, [activeMediaIndex])

  return (
    <Modal
      isOpen={isVisible}
      onClose={handleModalClose}
      size="full"
      isCentered
      motionPreset="none"
      scrollBehavior="inside"
      allowPinchZoom
    >
      <ModalOverlay>
        <ModalContent
          width={{ base: '100vw', md: '90vw' }}
          height={{ base: '100vh', md: '90vh' }}
          m={{ base: 0, md: 5 }}
        >
          {/* Needed if image/wrapper overlaps with the modal in any way */}
          <ModalHeader variant="withBorder">
            <Flex height="20px" justify="flex-end" align="center">
              <Icon
                cursor="pointer"
                mr={3}
                boxSize="4"
                onClick={handleDownload}
                as={DownloadLineIcon}
              />
              <ModalCloseButton
                sx={{ position: 'static' }}
                size="sm"
                zIndex="modal"
              />
            </Flex>
          </ModalHeader>

          <ModalBody>
            <Flex
              align="center"
              justify="center"
              width="100%"
              height="100%"
              py={0}
              pos="relative"
            >
              {length > 1 && (
                <Indicator
                  disabled={isPreviousButtonDisabled}
                  handleClick={() => setCurrentIndex(currentIndex - 1)}
                  styleProps={{ left: '0' }}
                >
                  <Icon as={ArrowLeftLineIcon} />
                </Indicator>
              )}

              <Carousel
                selectedItem={currentIndex}
                dynamicHeight
                showStatus={false}
                showThumbs={false}
                showIndicators
                showArrows={false}
                transitionTime={200}
                useKeyboardArrows
              >
                {slides.map((slide, index) => {
                  const src = slide.node?.attribs?.src
                  // Other types like video will be added later.
                  return (
                    <Flex
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      maxH="65vh"
                      justify="center"
                      align="center"
                    >
                      <Image
                        loading="lazy"
                        maxHeight="inherit"
                        objectFit="contain"
                        src={src}
                        alt=""
                      />
                    </Flex>
                  )
                })}
              </Carousel>
              {length > 1 && (
                <Indicator
                  disabled={isNextButtonDisabled}
                  handleClick={() => setCurrentIndex(currentIndex + 1)}
                  styleProps={{ right: '0' }}
                >
                  <Icon as={ArrowRightLineIcon} />
                </Indicator>
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  )
}

export default MediaModal
