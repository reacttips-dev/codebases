import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  useCallback,
  RefObject,
  forwardRef,
} from 'react'

import { Flex } from '@chakra-ui/react'
import Parser from 'html-react-parser'
import { nanoid } from 'nanoid'
import Quill from 'quill'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import { FileDrop } from 'react-file-drop'

import useGetNetwork from 'containers/Network/useGetNetwork'

import usePreventNavigation from 'hooks/usePreventNavigation'

import { logger } from 'lib/logger'

import { ComposerRefImperativeHandle, ReactQuillProps } from './@types'
import ComposerEmbed from './components/Embed'
import ComposerImage from './components/Image'
import { ComposerMention } from './components/Mention'
import { eliminateUnnecessaryHTML } from './helpers'
import useEmbed from './hooks/useEmbed'
import { getQuillModules } from './modules/get-quill-modules'
import { EmbedCreateEvent } from './modules/quill-embed/blots/embed'
import { embedSanitizer } from './modules/quill-embed/blots/sanitizer'
import { imageSanitizer } from './modules/quill-image/blots/sanitizer'
import { mentionSanitizer } from './modules/quill-mention/blots/sanitizer'
import useComposerFile from './useComposerFile'
import { initQuill } from './utils'

const staticProps = {
  composerStyles: {
    // Composer's placeholder has theme's secondary color
    '& .ql-editor:before': {
      color: 'label.secondary',
    },
  },
}

const ReactQuill = forwardRef(
  (
    {
      embeds,
      mentions,
      modules,
      onChange,
      placeholder,
      readOnly,
      style,
      value,
    }: ReactQuillProps,
    forwardedRef: RefObject<ComposerRefImperativeHandle>,
  ): JSX.Element => {
    const divRef = useRef<HTMLDivElement>(null)
    const quillRef = useRef<Quill>()
    const initialHTMLRef = useRef('')
    const { network } = useGetNetwork()
    const themeSettings = network?.themes?.active?.tokens
    const { upload } = useComposerFile()
    const { embed } = useEmbed()

    const sanitizeContent = useCallback(() => {
      try {
        const editor = quillRef.current?.root
        const ops = quillRef.current?.getContents()?.ops
        const sanitizer = {
          image: false,
          embed: false,
          mention: false,
        }
        ops.forEach(op => {
          if (op?.insert?.image) {
            sanitizer.image = true
          }
          if (op?.insert?.embed) {
            sanitizer.embed = true
          }
          if (op?.insert?.mention) {
            sanitizer.mention = true
          }
        })

        if (sanitizer.image) {
          imageSanitizer(editor)
        }

        if (sanitizer.embed) {
          embedSanitizer(editor)
        }

        if (sanitizer.mention) {
          mentionSanitizer(editor)
        }
      } catch (e) {
        logger.error('Error while sanitizing composer content', e.message)
      }
    }, [])

    useImperativeHandle(
      forwardedRef,
      (): ComposerRefImperativeHandle => ({
        clear: () => {
          if (quillRef.current) {
            quillRef.current.setText('')
          }
        },
        isEmpty: (): boolean => {
          try {
            return (
              JSON.stringify(quillRef.current.getContents()) ===
              '{"ops":[{"insert":"\\n"}]}'
            )
          } catch (e) {
            logger.error('Error while checking quill isEmpty', e.message)
            return false
          }
        },
        getQuill: (): Quill => quillRef?.current,
        focus: () => {
          if (quillRef.current) {
            quillRef.current.focus()
          }
        },
        getEditorHTML: () => {
          try {
            sanitizeContent()
            return quillRef.current?.root.innerHTML
          } catch (e) {
            logger.error(
              'Error while trying to get the html of the editor',
              e.message,
            )
          }
        },
        isTouched: () => {
          // Quill content's actual HTML
          let currentHTML = quillRef.current?.root.innerHTML.trim()

          if (typeof currentHTML !== 'string') return false

          currentHTML = eliminateUnnecessaryHTML(currentHTML)

          const initialHTML = eliminateUnnecessaryHTML(initialHTMLRef.current)

          return initialHTML !== currentHTML
        },
      }),
      [sanitizeContent],
    )

    usePreventNavigation(() => !!forwardedRef.current?.isTouched())

    const handleComposerClick = useCallback(() => {
      if (!quillRef.current) return

      if (!quillRef.current.hasFocus()) {
        quillRef.current.focus()
      }
    }, [])

    const handleComposerDrop = useCallback((files): void => {
      if (!files || !files[0].type?.startsWith('image')) return
      upload(files, quillRef.current)
    }, [])

    useEffect(() => {
      initQuill()

      const quillElementId = `editor-container-${nanoid(10)}`
      if (divRef.current) divRef.current.id = quillElementId
      const quill = new Quill(`#${quillElementId}`, {
        placeholder,
        readOnly,
        theme: 'bubble',
        bounds: `#${quillElementId}`,
        modules: getQuillModules(modules),
      })
      quillRef.current = quill
      try {
        const tooltipTextbox = quill?.theme?.tooltip?.textbox
        const tooltipRoot = quill?.theme?.tooltip?.root
        if (tooltipTextbox) {
          // Quill changes it everytime this input is visible.
          const desiredPlaceholder = 'https://example.com'
          tooltipTextbox.addEventListener('mouseenter', () => {
            const placeholder = tooltipTextbox.getAttribute('placeholder')
            if (placeholder !== desiredPlaceholder) {
              tooltipTextbox.setAttribute('placeholder', desiredPlaceholder)
            }
          })
        }

        if (tooltipRoot) {
          tooltipRoot.addEventListener('click', e => {
            e.stopPropagation()
          })
        }
      } catch (e) {
        logger.error('Error while changing quill tooltip input', e.message)
      }

      if (value) {
        const PostContent = Parser(value, {
          replace: domNode => {
            if (domNode.type === 'tag' && domNode.name === 'img') {
              return (
                <ComposerImage
                  src={domNode.attribs.src}
                  imageProps={domNode.attribs}
                  isReadOnly={false}
                  themeSettings={themeSettings}
                />
              )
            }

            if (
              domNode.type === 'tag' &&
              domNode.attribs &&
              domNode.attribs['data-type'] === 'embed'
            ) {
              if (!embeds) return null
              // Fetch the corresponding embed id
              const embedId = domNode.attribs['data-id']
              const embed = embeds.find(embed => embed.id === embedId)
              if (!embed) return null
              return (
                <ComposerEmbed
                  quill={quill}
                  initialEmbed={embed}
                  isReadOnly={false}
                  themeSettings={themeSettings}
                />
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
          },
        })

        // Using ReactDOMServer instead of ReactDOM because ReactDOM render is asynchronous and can be safely used
        // on the browser as well.
        initialHTMLRef.current = ReactDOMServer.renderToStaticMarkup(
          PostContent,
        )

        quill.root.innerHTML = initialHTMLRef.current

        // Need to hydrate for event listeners added by our custom components in the future.
        ReactDOM.hydrate(PostContent, quill.root)

        // `getFormat` forces Quill to render the
        // actual content (inner html changes after mentions
        // or stuff like get applied)
        try {
          quill.getFormat()
        } catch (e) {
          logger.error(e)
        }

        // Store the actual HTML content for later
        // comparison (detecting touched state)
        initialHTMLRef.current = quill.root.innerHTML
      }

      const handleEmbedCreate = e => {
        const index = quill?.getSelection()?.index
        const { url } = e.detail
        const isSourceEmbedInput = quill.root.querySelector('#embed-input')

        if (!isSourceEmbedInput) {
          // Insert only if embeds weren't created using an embed input field(Direct paste)
          quill.insertText(index, url, {
            link: url,
          })
          handleEmbedConvert(url)
        }
      }

      quill.root.addEventListener(EmbedCreateEvent, handleEmbedCreate)

      const handleEmbedConvert = async value => {
        embed(value)
          .then(embedResponse => {
            const range = quill?.getSelection()
            const initialEmbed = embedResponse?.data?.embed

            // If nothing to embed
            if (!initialEmbed || !initialEmbed?.html) return

            // When the URL is embeddable remove the link itself
            quill.deleteText(range.index, range?.length)

            // And keep the embed below
            quill.insertEmbed(range.index, 'embed', {
              quill,
              initialEmbed,
              themeSettings,
            })
          })
          .catch(e => {
            logger.error('Error while embedding url', e.message)
          })
      }

      quill.on('text-change', () => {
        if (typeof onChange === 'function') {
          onChange(quill.root.innerHTML)
        }
      })

      return () => {
        quill.root.removeEventListener(EmbedCreateEvent, handleEmbedCreate)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <FileDrop
        className="quill-file-drop-container"
        onDrop={handleComposerDrop}
      >
        <Flex
          direction="column"
          flexGrow={1}
          ref={divRef}
          onClick={handleComposerClick}
          style={style}
          className="composer edit"
          sx={staticProps.composerStyles}
        />
      </FileDrop>
    )
  },
)

export default ReactQuill
