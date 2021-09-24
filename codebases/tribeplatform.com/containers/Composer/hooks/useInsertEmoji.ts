import { EmojiPickerResult } from 'tribe-components'

const insertEmojiResponse = {
  insertEmojiWithColon: () => null,
  insertEmoji: () => null,
}

const useInsertEmoji = quillRef => {
  if (!quillRef) return insertEmojiResponse

  const insertEmojiWithColon = (
    emoji: EmojiPickerResult,
    colonSymPos: number,
    cursorPos: number,
  ) => {
    // delete anything following :
    quillRef.deleteText(colonSymPos, cursorPos - colonSymPos, 'user')

    const insertAtPos = colonSymPos + emoji.native.length
    // insert the emoji
    quillRef.insertText(colonSymPos, emoji.native, 'user')
    // insert space after
    quillRef.insertText(insertAtPos, ' ', 'user')
    // delete the original : character
    quillRef.deleteText(colonSymPos - 1, 1, 'user')
    // set the cursor after embed
    quillRef.setSelection(insertAtPos, 'user')
  }

  const insertEmoji = (emoji: EmojiPickerResult, cursorPos: number) => {
    const insertAtPos = cursorPos + emoji.native.length
    // insert the emoji
    quillRef.insertText(cursorPos, emoji.native, 'user')
    // insert space after
    quillRef.insertText(insertAtPos, ' ', 'user')
    // set the cursor after embed
    quillRef.setSelection(insertAtPos, 'user')
  }

  return { insertEmojiWithColon, insertEmoji }
}

export default useInsertEmoji
