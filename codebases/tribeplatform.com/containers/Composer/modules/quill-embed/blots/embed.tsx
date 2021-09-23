import React from 'react'

import Quill from 'quill'
import ReactDOM from 'react-dom'

import ComposerEmbed from 'containers/Composer/components/Embed'

const BlockEmbed = Quill.import('blots/block/embed')

const tagName = 'div'
const className = 'embed'
export const EmbedSelector = `${tagName}.${className}[data-type="embed"]`
export const EmbedCreateEvent = 'embed:create'
class EmbedBlot extends BlockEmbed {
  static blotName = 'embed'

  static tagName = tagName

  static className = className

  static create({
    quill,
    handleEmbedPaste,
    handleEmbedInvalid,
    isReadOnly = false,
    placeholder,
    themeSettings,
    initialEmbed,
  }) {
    const node = super.create()
    node.classList.add(this.className)
    node.setAttribute('data-type', 'embed')
    const Component = (
      <ComposerEmbed
        quill={quill}
        handleEmbedPaste={handleEmbedPaste}
        handleEmbedInvalid={handleEmbedInvalid}
        isReadOnly={isReadOnly}
        placeholder={placeholder}
        themeSettings={themeSettings}
        initialEmbed={initialEmbed}
      />
    )
    ReactDOM.render(Component, node)
    return node
  }

  static value(node) {
    const composer = node.closest('.composer')
    const preview = node.querySelector('.preview')
    const embed = node.querySelector('[data-embed-id]')
    const embedId = embed ? embed.getAttribute('data-embed-id') : ''
    return {
      initialEmbed: {
        url: '',
        html: preview?.innerHTML || '',
        id: embedId,
      },
      quill: Quill.find(composer),
    }
  }
}

Quill.register(EmbedBlot)
