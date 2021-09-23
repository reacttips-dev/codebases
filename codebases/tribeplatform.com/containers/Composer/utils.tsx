import React, { MutableRefObject } from 'react'

import Quill from 'quill'
import MagicUrl from 'quill-magic-url'

import './modules/quill-mention/blots/mention'
import './modules/quill-image/blots/image'
import './modules/quill-embed/blots/embed'
import './modules/quill-clipboard'

import { Member, SearchEntity } from 'tribe-api'

import { SYMBOL_REGEXP } from './constants'

const Block = Quill.import('blots/block')

export class HeaderBlot extends Block {
  static blotName = 'header'

  static tagName = ['h2', 'h3']

  static formats(node) {
    return HeaderBlot.tagName.indexOf(node.tagName) + 1
  }
}

export const getHeaderBlot = () => {
  return HeaderBlot
}

export const initQuill = () => {
  const HeaderBlot = getHeaderBlot()

  Quill.register(HeaderBlot)
  Quill.register('modules/magicUrl', MagicUrl)
}

type QuillWithContainer = Quill & {
  container?: HTMLElement
}

export function getCursorPosition(
  quill: QuillWithContainer,
  cursorPosOption = undefined,
) {
  let cursorPosBounds
  if (!quill) return
  let cursorPos
  if (cursorPosOption) {
    cursorPos = cursorPosOption
  } else {
    const range = quill.getSelection()
    if (!range) return
    cursorPos = range.index
  }
  try {
    cursorPosBounds = quill.getBounds(cursorPos)
  } catch (e) {
    cursorPosBounds = { left: 0, top: 0 }
  }
  const containerPos = (quill.container as any).getBoundingClientRect()
  const cursorPosAbsolute = {
    left: containerPos?.left + cursorPosBounds?.left,
    top: containerPos?.top + cursorPosBounds?.top,
    width: 0,
    height: cursorPosBounds?.height,
  }

  return {
    top: cursorPosAbsolute.top + cursorPosAbsolute.height,
    left: cursorPosAbsolute.left - 15,
  }
}

export const getTriggerStyle = (
  quillRef: Quill,
  cursorPos?,
  customStyles?: React.CSSProperties,
): React.CSSProperties => {
  const defaultStyle = { opacity: 0, width: 0, height: 0 }

  const cursorPosition = getCursorPosition(quillRef, cursorPos)
  if (!cursorPosition && !customStyles) return defaultStyle

  return {
    ...defaultStyle,
    position: 'fixed',
    top: cursorPosition?.top,
    left: cursorPosition?.left,
    ...customStyles,
  }
}

export function getMentionCharIndex(text, mentionDenotationChars) {
  return mentionDenotationChars.reduce(
    (prev, mentionChar) => {
      const mentionCharIndex = text.lastIndexOf(mentionChar)

      if (mentionCharIndex > prev.mentionCharIndex) {
        return {
          mentionChar,
          mentionCharIndex,
        }
      }
      return {
        mentionChar: prev.mentionChar,
        mentionCharIndex: prev.mentionCharIndex,
      }
    },
    { mentionChar: null, mentionCharIndex: -1 },
  )
}

export function hasValidMentionCharIndex(mentionCharIndex, text, isolateChar) {
  if (mentionCharIndex > -1) {
    if (
      isolateChar &&
      !(mentionCharIndex === 0 || !!text[mentionCharIndex - 1].match(/\s/g))
    ) {
      return false
    }
    return true
  }
  return false
}

export const getTextBeforeCursor = (quillRef, cursorPos) => {
  const startPos = Math.max(0, cursorPos - 1)
  const textBeforeCursorPos = quillRef.getText(startPos, cursorPos - startPos)
  return textBeforeCursorPos
}

export const buildBackendQuery = (query: string) => `${query} +for:member`

type GetSymbolSearchTermProps = {
  quill: Quill
  symbolPositionRef?: MutableRefObject<number | undefined>
  symbol: keyof typeof SYMBOL_REGEXP
}

/**
 * Finds a matching search term for a given symbol
 * @returns the search term string. Empty if something is wrong or not matching.
 */
export const getSymbolSearchTerm = ({
  quill,
  symbolPositionRef,
  symbol,
}: GetSymbolSearchTermProps) => {
  // Can't focus to the editor here, because
  // emoji picker gets automatically closed
  // (because outside element was clicked)
  const cursorPosition = quill.getSelection()?.index

  if (typeof cursorPosition === 'undefined') return ''

  // Symbols can't be glued to whaever is before.
  // So for the line's first character we have to add a space
  const textFromStart = ` ${quill.getText(0, cursorPosition)}`

  const matches = textFromStart.match(SYMBOL_REGEXP[symbol])
  const hasValidMatch = Array.isArray(matches)

  // Prepare the first match
  const firstMatch = matches?.[0]?.trimStart() || ''

  let match = ''

  // If the search term contains a line break
  if (!firstMatch || firstMatch.includes('\n')) {
    // Return only the parsed search term itself
    match = ''
  } else {
    match = firstMatch?.trim().replace(symbol, '') || ''
  }

  if (symbolPositionRef) {
    symbolPositionRef.current = hasValidMatch
      ? cursorPosition - match.length
      : undefined
  }

  return match
}

export const getMentionMember = (hit: SearchEntity): Partial<Member> => ({
  id: hit?.entityId,
  name: hit?.title,
})
