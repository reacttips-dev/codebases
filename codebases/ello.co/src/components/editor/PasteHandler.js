import some from 'lodash/some'
import { replaceSelectionWithText } from './SelectionUtil'
import { postPreviews, saveAsset } from '../../actions/editor'
import { getBlobFromBase64 } from '../../helpers/file_helper'

let dispatch = null
let editorId = null

function checkForEmbeds(text) {
  window.embetter.activeServices.forEach((service) => {
    if (text.match(service.regex)) {
      const mediaUrl = service.link(text.match(service.regex)[1])
      dispatch(postPreviews(mediaUrl, editorId, 0))
    }
  })
}

function handlePlainText(text) {
  if (!text.length) return
  if (text.match(/;base64,/)) {
    dispatch(saveAsset(
      getBlobFromBase64(text.split(',')[1], { type: 'image/png' }), editorId,
    ))
  } else {
    replaceSelectionWithText(text)
    checkForEmbeds(text)
  }
}

function handleClipboardItems(items) {
  const isImage = some(items, item => /image/.test(item.type))
  Object.keys(items).forEach((key) => {
    const item = items[key]
    if (isImage && /image/.test(item.type)) {
      const file = item.getAsFile()
      if (file) {
        dispatch(saveAsset(file, editorId))
      }
    }
  })
}

function checkForImages(e) {
  const image = e.target.parentNode.querySelector('img')
  if (image) {
    // this works on FF paste of clipboard data
    if (image.src.match(/;base64,/)) {
      dispatch(saveAsset(
        getBlobFromBase64(image.src.split(',')[1], { type: 'image/png' }), editorId,
      ))
    } else if (image.src.indexOf('webkit-fake-url') === 0) {
      // safari adds 'webkit-fake-url://' to image src and throws security
      // violations when trying to access the data of the image
      handlePlainText('Sorry, but pasting images doesn\'t currently work in this browser. :ello:')
    } else if (image.src.indexOf('http') === 0) {
      // creates markdown of the image when right clicking on image to copy in FF
      handlePlainText(`![Pasted Image](${image.src})`)
    }
    image.parentNode.removeChild(image)
  }
}

export function pasted(e, d, id) {
  dispatch = d
  editorId = id
  const items = e.clipboardData.items || {}
  const text = e.clipboardData.getData('text/plain')
  const isImage = some(items, item => /image/.test(item.type))
  if (items && isImage) {
    e.preventDefault()
    handleClipboardItems(items)
  } else if (text.length) {
    e.preventDefault()
    // this is for safari to strip out the HTML from text
    handlePlainText(text)
  } else {
    e.persist()
    requestAnimationFrame(() => {
      checkForImages(e)
    })
  }
}

export default pasted

