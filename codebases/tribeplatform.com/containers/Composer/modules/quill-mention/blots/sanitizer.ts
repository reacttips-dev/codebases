import { MentionBlotClassName } from 'containers/Composer/constants'

export const mentionSanitizer = (editor: HTMLElement): void => {
  const mentions = editor.querySelectorAll(
    `[data-type="mention"].${MentionBlotClassName}`,
  )

  if (!mentions || mentions?.length === 0) {
    return
  }

  mentions.forEach(mention => {
    //   Removes chakra class.
    mention.removeAttribute('class')
    mention.classList.add(MentionBlotClassName)
  })
}
