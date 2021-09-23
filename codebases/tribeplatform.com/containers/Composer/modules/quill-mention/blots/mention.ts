import Quill from 'quill'

import { MentionBlotClassName } from 'containers/Composer/constants'

const Embed = Quill.import('blots/embed')

class MentionBlot extends Embed {
  static blotName = 'mention'

  static tagName = 'a'

  static className = MentionBlotClassName

  static create(data) {
    const node = super.create()

    node.innerHTML += `@${data.value}`
    node.setAttribute('data-id', data.id)
    node.setAttribute('data-type', 'mention')

    return node
  }

  static value(domNode) {
    if (!domNode) return
    const container = domNode.querySelector('span')
    const mentionContent = container ? container.innerHTML : ''
    const value = mentionContent.replace('@', '')
    return { value, id: domNode.dataset?.id }
  }
}

Quill.register(MentionBlot)
