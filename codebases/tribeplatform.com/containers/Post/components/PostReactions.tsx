import React, { useCallback } from 'react'

import { Box, Flex, Text, WrapItem } from '@chakra-ui/react'
import EmotionLineIcon from 'remixicon-react/EmotionLineIcon'

import {
  Member,
  Post,
  PostReactionDetail,
  PostReactionParticipant,
  ReactionType,
} from 'tribe-api/interfaces'
import { hasActionPermission } from 'tribe-api/permissions'
import {
  Button,
  Emoji,
  EmojiPicker,
  EmojiPickerResult,
  Icon,
  Tooltip,
} from 'tribe-components'
import { formatNumberWithCommas, Trans } from 'tribe-translation'

import { clientLoginPageRedirect } from 'containers/Network/Login/utils'
import useAddReaction from 'containers/Post/hooks/useAddReaction'

import useAuthMember from 'hooks/useAuthMember'
import { useResponsive } from 'hooks/useResponsive'

import UpVoteArrow from 'icons/svg/UpVoteArrow'

export const PostReactionPicker = ({ post }: { post: Post | null }) => {
  const { react } = useAddReaction()

  const { authUser, isGuest } = useAuthMember()
  const { authorized: hasReactPermission } = hasActionPermission(
    post?.authMemberProps?.permissions || [],
    'addReaction',
  )

  const onEmojiSelect = useCallback(
    (emoji: EmojiPickerResult) => {
      if (post) react(post, emoji.id, authUser)
    },
    [post],
  )

  if (!isGuest && !hasReactPermission) {
    return null
  }

  return (
    <WrapItem>
      <EmojiPicker onSelect={onEmojiSelect}>
        {({ toggle }) => (
          <Button
            d="flex"
            variant="solid"
            colorScheme="gray"
            size="xs"
            color="label.secondary"
            date-testid="post-react-btn"
            onClick={e => {
              if (hasReactPermission) {
                toggle()
              } else if (isGuest && typeof window !== 'undefined') {
                e.stopPropagation()
                clientLoginPageRedirect(window.location.pathname)
              }
            }}
            disabled={!isGuest && !hasReactPermission}
          >
            <Icon as={EmotionLineIcon} h="16px" w="16px" mr="4px" />
            <Trans i18nKey="common:post.reactions.react" defaults="React" />
          </Button>
        )}
      </EmojiPicker>
    </WrapItem>
  )
}

export const PostReactions = ({ post }: { post: Post | null }) => {
  const { react } = useAddReaction()

  const { reactions } = post || {}

  if (post?.postType?.primaryReactionType === ReactionType.EMOJI_BASE) {
    if (reactions?.length === 0) {
      return null
    }

    return (
      <>
        {reactions?.map(reaction => {
          if (reaction.count > 0) {
            return (
              <WrapItem key={reaction.reaction}>
                <ReactionButton
                  post={post}
                  postReactionDetail={reaction}
                  react={react}
                />
              </WrapItem>
            )
          }
          return null
        })}
      </>
    )
  }

  if (post?.postType?.primaryReactionType === ReactionType.VOTE_BASE) {
    const upVotedReaction: PostReactionDetail = reactions?.find(
      reaction => reaction.reaction === '+1',
    ) || {
      __typename: 'PostReactionDetail',
      reacted: false,
      reaction: '+1',
      count: 0,
    }

    return (
      <WrapItem>
        <VoteReactionButton
          post={post}
          postReactionDetail={upVotedReaction}
          react={react}
        />
      </WrapItem>
    )
  }

  return null
}

type ReactionButtonProps = {
  post: Post
  postReactionDetail: PostReactionDetail
  react: (post: Post, reaction: string, authUser: Member) => void
}

const ReactionButton = ({
  post,
  react,
  postReactionDetail,
}: ReactionButtonProps) => {
  const { authUser } = useAuthMember()

  const { authorized: hasReactPermission } = hasActionPermission(
    post?.authMemberProps?.permissions || [],
    'addReaction',
  )

  const { isPortable } = useResponsive()

  const getListFromParticipants = (
    nodes: PostReactionParticipant[],
    authUser?: Member,
  ): React.ReactNode => {
    return nodes.reduce((acc, node, i) => {
      const { participant } = node
      const name =
        authUser?.id === participant?.id ? (
          <Trans
            i18nKey="common:post.reactions.participants.you"
            defaults="you"
          />
        ) : (
          participant?.name
        )
      if (i === 0) {
        return name
      }

      if (i === nodes.length - 1) {
        return (
          <>
            {acc},{' '}
            <Trans
              i18nKey="common:post.reactions.participants.and"
              defaults="and"
            />{' '}
            {name}
          </>
        )
      }

      return (
        <>
          {acc}, {name}
        </>
      )
    }, '')
  }

  const onClick = () => {
    if (hasReactPermission) {
      react(post, postReactionDetail.reaction, authUser)
    } else if (!authUser) {
      clientLoginPageRedirect(window.location.pathname)
    }
  }

  const participants = getListFromParticipants(
    postReactionDetail?.participants?.nodes || [],
    authUser,
  )

  const tooltipLabel = (
    <Flex align="center" direction="column">
      <Flex
        px="2px"
        py="2px"
        bg="bg.base"
        align="center"
        justify="center"
        borderRadius="sm"
      >
        <Emoji src={postReactionDetail.reaction} size="sm" />
      </Flex>
      <Text
        fontSize="xs"
        color="label.button"
        fontWeight="medium"
        textAlign="center"
      >
        {participants}
      </Text>
    </Flex>
  )

  return (
    <Tooltip label={tooltipLabel} closeOnClick={false} isDisabled={isPortable}>
      <Button
        d="flex"
        variant="solid"
        colorScheme="gray"
        size="xs"
        borderRadius="full"
        border="1px"
        color={postReactionDetail.reacted ? 'accent.base' : 'label.primary'}
        borderColor={postReactionDetail.reacted ? 'accent.base' : 'border.lite'}
        bg={postReactionDetail.reacted ? 'accent.lite' : 'bg.secondary'}
        onClick={onClick}
        disabled={!!authUser && !hasReactPermission}
        sx={{
          _disabled: {
            cursor: 'default',
            opacity: 'var(--tribe-opacity-none)',
          },
          _hover: {
            _disabled: {
              bg: 'initial',
            },
          },
        }}
      >
        <Box mr="4px">
          <Emoji src={postReactionDetail.reaction} size="2xs" />
        </Box>
        <span>{formatNumberWithCommas(postReactionDetail?.count)}</span>
      </Button>
    </Tooltip>
  )
}

const VoteReactionButton = ({
  post,
  react,
  postReactionDetail,
}: ReactionButtonProps) => {
  const { authUser, isGuest } = useAuthMember()

  const { authorized: hasReactPermission } = hasActionPermission(
    post?.authMemberProps?.permissions || [],
    'addReaction',
  )

  const onClick = () => {
    if (hasReactPermission) {
      react(post, postReactionDetail.reaction, authUser)
    } else if (isGuest) {
      clientLoginPageRedirect(window.location.pathname)
    }
  }

  return (
    <>
      <Button
        d="flex"
        onClick={onClick}
        flexDirection="column"
        variant="solid"
        colorScheme="gray"
        size="s"
        color={postReactionDetail?.reacted ? 'accent.base' : 'label.primary'}
        bg={postReactionDetail?.reacted ? 'accent.lite' : 'bg.secondary'}
        borderRadius="lg"
        sx={{
          _disabled: {
            cursor: 'default',
            opacity: 'var(--tribe-opacity-none)',
          },
          _hover: {
            _disabled: {
              bg: 'initial',
            },
          },
        }}
        px={2}
        py={1}
      >
        <UpVoteArrow upVoted={postReactionDetail?.reacted} />
        <Box mt={1} />
        <span>{formatNumberWithCommas(postReactionDetail?.count || 0)}</span>
      </Button>
    </>
  )
}
