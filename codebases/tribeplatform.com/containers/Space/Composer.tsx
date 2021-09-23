import React, { useCallback, useEffect, useRef, useState } from 'react'

import { HStack, Box, Container, useToken } from '@chakra-ui/react'
import CloseLineIcon from 'remixicon-react/CloseLineIcon'
import PriceTag3LineIcon from 'remixicon-react/PriceTag3LineIcon'

import { SpaceQuery } from 'tribe-api'
import { Post, PostType, ThemeTokens } from 'tribe-api/interfaces'
import {
  Button,
  confirm,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useResponsive,
  useToast,
} from 'tribe-components'
import { Trans, useTranslation } from 'tribe-translation'

import useThemeSettings from 'containers/AdminSettings/hooks/useThemeSettings'
import { ComposerWidget, ComposerControls } from 'containers/Composer'
import { ComposerRefImperativeHandle } from 'containers/Composer/@types'
import { ComposerIconButton } from 'containers/Composer/components/ComposerControls/ComposerIconButton'
import { useMediaUploadStatus } from 'containers/Composer/hooks/useMediaUploadStatus'
import { getPostFieldValue } from 'containers/Post/utils'
import { useSpaceModal } from 'containers/Space/hooks/useSpaceSidebar'
import { AddPostTopicModal } from 'containers/Topic/components/AddPostTopicModal'

import usePreventNavigation from 'hooks/usePreventNavigation'

import ComposerCard from './ComposerCard'
import ComposerUserbar from './ComposerUserbar'
import useAddPost from './hooks/useAddPost'
import useUpdatePost from './hooks/useUpdatePost'

export interface ComposerProps {
  space: SpaceQuery['space']
  post?: Post
  defaultIsOpen?: boolean
  hasTitle?: boolean
  onCloseCallback?: () => void
  showComposerCard?: boolean
}

const COMPOSER_SPACING = 6

const staticStyles = {
  composerWidget: {
    minHeight: '90px',
  },
  composerContainer: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    flexGrow: 1,
    mx: -COMPOSER_SPACING,
    w: 'auto',
    maxW: 'initial',
    px: 0,

    '.quill-file-drop-container, .quill-file-drop-container .file-drop-target': {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      overflow: 'hidden',
    },

    '.composer.edit > .ql-editor': {
      px: COMPOSER_SPACING,
      pb: COMPOSER_SPACING,
      pt: 2,

      '&:before': {
        left: COMPOSER_SPACING,
      },
    },
  },
}

export const MODAL_ID = 'composer'

const ComposerTitle = ({ post }: { post?: Post }) => {
  if (!post) {
    return <Trans i18nKey="post:new.title" defaults="Create post" />
  }
  if (post.repliedTo) {
    return <Trans i18nKey="post:editReply.title" defaults="Edit reply" />
  }
  return <Trans i18nKey="post:edit.title" defaults="Edit post" />
}

const Composer = ({
  space,
  post,
  defaultIsOpen = !!post,
  hasTitle = true,
  onCloseCallback,
  showComposerCard = true,
}: ComposerProps) => {
  const isNew = !post
  const composerRef = useRef<ComposerRefImperativeHandle>(null)
  const finalFocusRef = useRef(null)
  const initialFocusRef = useRef<HTMLTextAreaElement>(null)
  const { t } = useTranslation()
  const { isPhone } = useResponsive()
  const { open, isOpen, close: closeModal } = useSpaceModal(MODAL_ID, {
    defaultIsOpen,
  })
  const { themeSettings } = useThemeSettings()
  const toast = useToast()

  const {
    isMediaUploading,
    onQuillMount,
    onQuillUnmount,
  } = useMediaUploadStatus(composerRef)

  const [labelPrimaryColor] = useToken('colors', ['label.primary'])
  useEffect(() => {
    // To preload the composer on CDM
    import('containers/Composer/Composer')
    import('containers/Composer/components/ComposerControls')
  }, [])

  let postTitle = ''
  let postContent = ''

  switch (post?.postType?.name?.toLowerCase()) {
    case 'discussion':
      postTitle = getPostFieldValue(post, 'title')
      postContent = getPostFieldValue(post, 'content')
      break
    case 'comment':
      postContent = getPostFieldValue(post, 'content')
      break
    case 'question':
      postTitle = getPostFieldValue(post, 'question')
      postContent = getPostFieldValue(post, 'description')
      break
    case 'answer':
      postContent = getPostFieldValue(post, 'answer')
      break
    default:
      break
  }

  const topicsRef = useRef(post?.tags)
  const postTopicsLength = topicsRef?.current?.length || 0
  // We will only display one title here.
  const topicTitle = (() => {
    if (postTopicsLength > 2) {
      // TODO: Translation
      return `${postTopicsLength} tags`
    }
    if (postTopicsLength > 0 && postTopicsLength < 3) {
      let title = ''
      topicsRef?.current?.forEach(topic => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        title += `${topic.title || ''}, `
      })
      return title.replace(/,\s*$/, '')
    }
  })()

  const [title, setTitle] = useState(postTitle || '')
  const [content, setContent] = useState(postContent)

  let postType = space?.spaceType?.availablePostTypes?.find(
    type => type.name === 'Discussion',
  ) as PostType
  if (!postType) {
    postType = space?.spaceType?.availablePostTypes?.[0] as PostType
  }

  const isValid = hasTitle ? title !== '' : true

  const [showTopicsModal, setShowTopicsModal] = useState(false)

  const completeClose = useCallback(() => {
    setTitle('')
    setContent('')
    resetTopicsState()
    closeModal()
    if (typeof onCloseCallback === 'function') {
      onCloseCallback()
    }
  }, [closeModal, setContent, setTitle, onCloseCallback])

  const confirmClose = useCallback(async () => {
    const confirmed = await confirm({
      title: t('post:actions.close', 'Discard post?'),
      body: t(
        'post:close.confirm',
        'Closing the composer will delete the post.',
      ),
      themeSettings: themeSettings as ThemeTokens,
    })

    if (confirmed) {
      completeClose()
    }
  }, [t, themeSettings, completeClose])

  // If title was changed
  const hasPostTitleChanged = useCallback(() => postTitle !== title, [
    postTitle,
    title,
  ])

  usePreventNavigation(hasPostTitleChanged)

  const close = useCallback(() => {
    if (
      // Composer's content was changed
      composerRef.current?.isTouched() ||
      hasPostTitleChanged()
    ) {
      confirmClose()
    } else {
      completeClose()
    }
  }, [completeClose, confirmClose, hasPostTitleChanged])

  const onComposerChange = useCallback(val => {
    setContent(val)
  }, [])

  const resetTopicsState = () => {
    topicsRef.current = []
  }

  const { publish, loading: isPublishing } = useAddPost(space)
  const { update, loading: isUpdating } = useUpdatePost(post?.id ?? '', {
    // Optimistic Response for Post Update needs a lot of work to avoid showing stale data.
    onCompleted: completeClose,
  })

  const handleTopicsUpdate = useCallback(topics => {
    topicsRef.current = topics
    setShowTopicsModal(false)
  }, [])

  const focusOnDescription = useCallback(event => {
    if (
      event.key === 'Enter' &&
      typeof composerRef?.current?.focus === 'function'
    ) {
      composerRef.current.focus()
    }
  }, [])

  const closeTopicsModal = () => {
    setShowTopicsModal(false)
  }

  const showEmptyWarningOnReplyUpdate = useCallback(() => {
    toast({
      title: t('post:reply.feedback.emptyUpdate.title', 'Reply can’t be empty'),
      description: t(
        'post:reply.feedback.emptyUpdate.description',
        'You can’t save an empty reply, please add some content.',
      ),
      status: 'error',
    })
  }, [t, toast])

  const submit = useCallback(() => {
    let _content = composerRef?.current?.getEditorHTML() || ''
    if (composerRef?.current?.isEmpty()) {
      // Don't allow empty save for replies.
      if (!isNew && post?.repliedTo) {
        return showEmptyWarningOnReplyUpdate()
      }
      _content = ''
    }
    const updatedTopics = topicsRef.current?.map(topic => topic.title || '')
    if (isNew && postType) {
      publish(postType, title, _content, updatedTopics)
      completeClose()
    } else {
      update(title, _content, updatedTopics)
    }
    resetTopicsState()
  }, [isNew, postType, post?.repliedTo, publish, title, completeClose, update])

  const updateTitle = useCallback(() => {
    const textarea = initialFocusRef.current

    if (!textarea) return

    setTitle(textarea.value)

    textarea.style.height = 'auto'
    textarea.style.minHeight = 'auto'

    const height = `${textarea.scrollHeight}px`

    textarea.style.height = height
    textarea.style.minHeight = height
  }, [])

  useEffect(() => {
    if (!hasTitle) return

    setTimeout(() => updateTitle(), 0)
  }, [hasTitle, updateTitle])

  return (
    <>
      {showComposerCard && isNew && <ComposerCard onClick={open} />}

      <Modal
        isOpen={!!isOpen}
        onClose={close}
        size="2xl"
        isCentered
        scrollBehavior="inside"
        finalFocusRef={finalFocusRef} // to prevent the page from jumping after the modal closed
        initialFocusRef={initialFocusRef}
        closeOnEsc={false}
      >
        <ModalOverlay>
          <ModalContent
            data-testid="space-composer-modal"
            alignSelf={['flex-start', 'auto']}
            fullSizeOniPhone
            as="div"
            minH="500px"
          >
            <ModalHeader borderBottom="1px" borderColor="border.lite">
              <HStack justify="space-between" align="stretch">
                <Box w={5} />
                <Box textAlign="center">
                  <Text textStyle="bold/2xlarge">
                    <ComposerTitle post={post} />
                  </Text>
                </Box>
                <Button
                  onClick={close}
                  p={0}
                  data-testid="space-composer-close-btn"
                  buttonType={isPhone ? 'secondary' : 'quiet'}
                  w={8}
                  minW={8}
                  h={8}
                >
                  <Icon
                    as={CloseLineIcon}
                    color={labelPrimaryColor}
                    boxSize="1.5em"
                  />
                </Button>
              </HStack>
            </ModalHeader>
            <ModalBody>
              <ComposerUserbar post={post} space={space} />
              <Container sx={staticStyles.composerContainer}>
                {hasTitle && (
                  <Textarea
                    ref={initialFocusRef}
                    value={title}
                    onChange={updateTitle}
                    onKeyPress={focusOnDescription}
                    placeholder={t('composer:title.placeholder', 'Add a title')}
                    size="2xl"
                    px={COMPOSER_SPACING}
                    variant="unstyled"
                    maxLength={100}
                    mt={COMPOSER_SPACING}
                    data-testid="space-composer-title-input"
                    whiteSpace="pre-wrap"
                    resize="none"
                    textStyle="semibold/large"
                    rows={1}
                    overflow="hidden"
                    pb={0}
                    // Height for one line
                    // h="57px"
                    // minH="57px"
                  />
                )}
                <ComposerWidget
                  value={content}
                  onChange={onComposerChange}
                  ref={composerRef}
                  style={staticStyles.composerWidget}
                  onQuillMount={onQuillMount}
                  onQuillUnmount={onQuillUnmount}
                  placeholder={t(
                    'composer:composer.Placeholder',
                    'Add description. Type ‘/’ to insert an image, file or link',
                  )}
                  embeds={post?.embeds}
                  mentions={post?.mentions}
                />
              </Container>
            </ModalBody>
            <ModalFooter
              // Footer has pt={4}
              pt={5}
              pb={5}
              px={COMPOSER_SPACING}
              borderTop="1px"
              borderColor="border.lite"
              justifyContent="space-between"
              // Statically position and set a fixed height to the footer
              // to make it stay in the same place with same size all the time
              flexGrow={0}
              flexShrink={0}
              flexBasis="80px"
              alignItems="center"
            >
              <ComposerControls composerRef={composerRef}>
                {(!postTopicsLength || postTopicsLength === 0) && (
                  <ComposerIconButton
                    icon={PriceTag3LineIcon}
                    aria-label="Tags"
                    onClick={() => setShowTopicsModal(true)}
                  />
                )}
                {postTopicsLength > 0 && (
                  <Button
                    leftIcon={<PriceTag3LineIcon size="16px" />}
                    onClick={() => setShowTopicsModal(true)}
                    size="sm"
                    maxW="3xs"
                  >
                    <Text isTruncated>{topicTitle}</Text>
                  </Button>
                )}

                <AddPostTopicModal
                  spaceId={space?.id}
                  isOpen={showTopicsModal}
                  onSaveCallback={handleTopicsUpdate}
                  onClose={closeTopicsModal}
                  initialTopics={topicsRef.current ?? []}
                />
              </ComposerControls>
              <Box>
                <Button
                  buttonType="primary"
                  data-testid="space-composer-publish-btn"
                  disabled={
                    !isValid || isPublishing || isUpdating || isMediaUploading
                  }
                  onClick={submit}
                  isLoading={isPublishing || isUpdating}
                >
                  {isNew ? (
                    <Trans i18nKey="post:new.submit" defaults="Post" />
                  ) : (
                    <Trans i18nKey="post:edit.submit" defaults="Update" />
                  )}
                </Button>
              </Box>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  )
}

export default Composer
