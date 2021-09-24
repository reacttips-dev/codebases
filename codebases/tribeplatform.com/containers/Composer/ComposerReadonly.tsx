import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react'

import { Box } from '@chakra-ui/layout'
import { Link } from '@chakra-ui/react'
import Parser from 'html-react-parser'
import { useRouter } from 'next/router'
import ReactDOMServer from 'react-dom/server'

import { Embed, Member, ThemeTokens } from 'tribe-api/interfaces'
import { TribeUIProvider } from 'tribe-components'

import { CookieContext } from 'containers/Apps/components/CookieContext'

import { getCookieSettings } from 'lib/cookies'

import DisabledEmbed from './components/DisabledEmbed'
import ComposerEmbed from './components/Embed'
import ComposerImage from './components/Image'
import MediaModal, { slide } from './components/MediaModal'
import { ComposerMention } from './components/Mention'
import { MentionBlotClassName } from './constants'
import {
  getTextContent,
  getLinkContent,
  eliminateUnnecessaryHTML,
} from './helpers'

const ComposerReadonlyInner = ({
  value,
  embeds,
  themeSettings,
  mentions,
}: {
  value: string
  embeds?: Embed[] | null
  mentions?: Member[] | null
  themeSettings: ThemeTokens
}) => {
  let mediaIndex = -1
  // The first one is active by default.
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)
  const slides: slide[] = []
  const divRef = useRef<HTMLDivElement>(null)
  const [mediaModalVisibility, setMediaModalVisibility] = useState(false)
  const router = useRouter()
  const { isCookieInstalled } = useContext(CookieContext)

  const handleModalVisibility = useCallback(e => {
    setActiveMediaIndex(Number(e?.currentTarget.dataset?.index))
    setMediaModalVisibility(true)
  }, [])
  const handleModalClose = useCallback(() => {
    setMediaModalVisibility(false)
  }, [])

  const inputHTML = eliminateUnnecessaryHTML(value)

  const currentCookieSettings = getCookieSettings()
  const canLoadEmbed =
    !isCookieInstalled ||
    (isCookieInstalled &&
      currentCookieSettings?.ADVERTISING_AND_TRACKING?.enabled)

  const PostComponent = Parser(inputHTML, {
    replace: domNode => {
      switch (domNode.name) {
        case 'img':
          slides.push({ type: 'image', node: domNode })
          mediaIndex += 1
          return (
            <Box
              className="media-wrapper"
              data-index={mediaIndex}
              cursor="pointer"
              onClick={handleModalVisibility}
            >
              <ComposerImage
                src={domNode.attribs.src}
                imageProps={domNode.attribs}
                isReadOnly
                themeSettings={themeSettings}
              />
            </Box>
          )

        case 'h2':
          return (
            <Box as="h2" mt={4} lineHeight="28px" textStyle="semibold/xl">
              {getTextContent(domNode)}
            </Box>
          )

        case 'h3':
          return (
            <Box as="h3" mt={3} lineHeight="28px" textStyle="medium/large">
              {getTextContent(domNode)}
            </Box>
          )

        case 'div':
          if (
            domNode.type === 'tag' &&
            domNode.attribs &&
            domNode.attribs['data-type'] === 'embed'
          ) {
            if (!embeds || !canLoadEmbed) {
              return null
            }
            // Fetch the corresponding embed id
            const embedId = domNode.attribs['data-id']
            const embed = embeds.find(embed => embed.id === embedId)
            // mediaIndex += 1
            return (
              <Box>
                <ComposerEmbed initialEmbed={embed} isReadOnly />
              </Box>
            )
          }
          break
        case 'a':
          if (domNode?.attribs?.href && domNode?.attribs?.rel) {
            return (
              <Link
                href={domNode?.attribs?.href}
                isExternal={domNode?.attribs?.target === '_blank'}
                rel="norel noopener"
                color="accent.base"
                fontSize="md"
              >
                {getLinkContent(domNode.children[0])}
              </Link>
            )
          }

          if (domNode.attribs && domNode.attribs['data-type'] === 'mention') {
            const tag = domNode?.children?.find(node => node.type === 'tag')
            if (!tag) return null
            const mentionId = domNode.attribs['data-id']
            const mentionFromDb = mentions?.find?.(
              mention => mention.id === mentionId,
            )
            return (
              <ComposerMention
                id={mentionFromDb?.id || mentionId}
                text={
                  mentionFromDb?.name
                    ? `@${mentionFromDb.name}`
                    : tag.children[0]?.data
                }
              />
            )
          }
          break

        default:
          // If null is returned parser will render the html variant.
          return null
      }
    },
  })

  const html = ReactDOMServer.renderToString(
    <TribeUIProvider themeSettings={themeSettings as ThemeTokens}>
      {PostComponent}
    </TribeUIProvider>,
  )

  const ComposerProps = {
    ref: divRef,
    className: 'composer ql-editor',
    dangerouslySetInnerHTML: { __html: html },
  }

  useEffect(() => {
    const mediaWrapper = divRef.current?.querySelectorAll('.media-wrapper')
    if (!mediaWrapper) return
    mediaWrapper.forEach(wrapper => {
      wrapper.addEventListener('click', e => {
        setActiveMediaIndex(
          Number((e?.currentTarget as HTMLElement)?.dataset?.index),
        )
        setMediaModalVisibility(true)
      })
    })
  }, [inputHTML])

  useEffect(() => {
    const mentions = divRef.current?.querySelectorAll(
      `[data-type="mention"].${MentionBlotClassName}`,
    )
    if (!mentions) return
    const handleMentionClick = e => {
      const id = e?.currentTarget.dataset?.id
      router.push(`/member/${id}`)
    }
    mentions.forEach(mention => {
      mention.addEventListener('click', handleMentionClick)
    })

    return () => {
      if (!mentions) return
      mentions.forEach(mention => {
        mention.removeEventListener('click', handleMentionClick)
      })
    }
  }, [inputHTML])

  return (
    <>
      <Box color="label.primary" {...ComposerProps} />
      {embeds?.length && !canLoadEmbed && (
        <TribeUIProvider themeSettings={themeSettings as ThemeTokens}>
          <DisabledEmbed />
        </TribeUIProvider>
      )}
      {slides?.length > 0 && (
        <MediaModal
          slides={slides}
          isVisible={mediaModalVisibility}
          handleModalClose={handleModalClose}
          activeMediaIndex={activeMediaIndex}
        />
      )}
    </>
  )
}

export const ComposerReadonly = React.memo(ComposerReadonlyInner)
