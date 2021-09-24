import { useCallback } from 'react'

import { Member } from 'tribe-api/interfaces'

const useInsertMention = () => {
  const insert = useCallback(
    (
      quillRef,
      member: Partial<Pick<Member, 'name' | 'id'>>,
      atPosition = 1,
    ) => {
      const data = {
        value: member?.name,
        id: member?.id,
      }
      const atPos = Number(atPosition)
      const range = quillRef.getSelection()
      const cursorPos = range?.index || 1

      // delete anything following @
      quillRef.deleteText(atPos, cursorPos - atPos, 'user')

      const insertAtPos = atPos
      // insert the embed
      quillRef.insertEmbed(insertAtPos, 'mention', data, 'user')
      // insert space after
      quillRef.insertText(insertAtPos + 1, ' ', 'user')
      // delete the original @ character
      quillRef.deleteText(atPos - 1, 1, 'user')
      // set the cursor after embed
      quillRef.setSelection(insertAtPos + 1, 'user')
    },
    [],
  )

  return insert
}

export default useInsertMention
