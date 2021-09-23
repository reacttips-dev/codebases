// eslint-disable-next-line import/order
import React from 'react'
import Quill from 'quill'
import ReactDOM from 'react-dom'

import ComposerImage from 'containers/Composer/components/Image'
import { ImageBlotClassName } from 'containers/Composer/constants'

const BlockEmbed = Quill.import('blots/block/embed')

Quill.debug(false)

class CustomImageBlot extends BlockEmbed {
  static blotName = 'image'

  static tagName = ['figure', 'div']

  static className = ImageBlotClassName

  static create({ uploadPromise, src = null, themeSettings }) {
    const node = super.create()
    const Component = (
      <ComposerImage
        uploadPromise={uploadPromise}
        src={src}
        isReadOnly={false}
        themeSettings={themeSettings}
      />
    )
    ReactDOM.render(Component, node)
    node.removeAttribute('src')
    node.setAttribute('data-type', 'image')
    return node
  }

  static value(node) {
    const img = node.querySelector('img')
    if (!img) return ''
    return { src: img.getAttribute('src') }
  }
}

Quill.register(CustomImageBlot)
