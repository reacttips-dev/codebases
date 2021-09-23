import EXIF from 'exif-js'

export const SUPPORTED_IMAGE_TYPES = {
  BMP: 'image/bmp',
  GIF: 'image/gif',
  JPG: 'image/jpg',
  PNG: 'image/png',
}

export const isGif = filename => /(gif|mp4)$/.test(filename)

export function isValidFileType(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader()
    let isValid = false
    let fileType = null
    let exifData = null
    fr.onloadend = (e) => {
      const arr = (new Uint8Array(e.target.result)).subarray(0, 4)
      let header = ''
      arr.forEach((value) => {
        header += value.toString(16)
      })
      if (/ffd8ff/i.test(header)) {
        isValid = true // image/jpg
        fileType = SUPPORTED_IMAGE_TYPES.JPG
      } else if (/424D/i.test(header)) {
        isValid = true // image/bmp
        fileType = SUPPORTED_IMAGE_TYPES.BMP
      } else {
        switch (header) {
          case '47494638': // image/gif
            isValid = true
            fileType = SUPPORTED_IMAGE_TYPES.GIF
            break
          case '89504e47': // image/png
            isValid = true
            fileType = SUPPORTED_IMAGE_TYPES.PNG
            break
          default:
            break
        }
      }
      if (fileType !== SUPPORTED_IMAGE_TYPES.GIF) {
        exifData = EXIF.readFromBinaryFile(e.target.result)
      }
      resolve({ isValid, fileType, exifData })
    }
    fr.onerror = () => {
      reject({ ...fr.error })
    }
    fr.readAsArrayBuffer(file)
  })
}

export function orientImage(img, maxW, maxH, orientation) {
  let width = img.width
  let height = img.height
  let transform = 'none'

  switch (orientation) {
    case 8:
      width = img.height
      height = img.width
      transform = 'left'
      break
    case 6:
      width = img.height
      height = img.width
      transform = 'right'
      break
    case 3:
      transform = 'flip'
      break
    default:
      break
  }

  if (width / maxW > height / maxH) {
    if (width > maxW) {
      height *= maxW / width
      width = maxW
    }
  } else if (height > maxH) {
    width *= maxH / height
    height = maxH
  }
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'transparent'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  switch (transform) {
    case 'left':
      ctx.setTransform(0, -1, 1, 0, 0, height)
      ctx.drawImage(img, 0, 0, height, width)
      break
    case 'right':
      ctx.setTransform(0, 1, -1, 0, width, 0)
      ctx.drawImage(img, 0, 0, height, width)
      break
    case 'flip':
      ctx.setTransform(1, 0, 0, -1, 0, height)
      ctx.translate(width, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(img, 0, 0, width, height)
      break
    default:
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.drawImage(img, 0, 0, width, height)
      break
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  return canvas
}

export function getBlobFromBase64(b64Data, contentType, sliceSize) {
  const type = contentType || ''
  const size = sliceSize || 512
  const byteCharacters = atob(b64Data)
  const byteArrays = []
  let offset = 0
  while (offset < byteCharacters.length) {
    const slice = byteCharacters.slice(offset, offset + size)
    const byteNumbers = new Array(slice.length)
    let i = 0
    while (i < slice.length) {
      byteNumbers[i] = slice.charCodeAt(i)
      i += 1
    }
    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
    offset += size
  }
  return new Blob(byteArrays, { type })
}

export function processImage({ exifData, file, fileType, maxWidth = 2560, maxHeight = 7680 }) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const orientation = exifData.Orientation
      const canvas = orientImage(img, maxWidth, maxHeight, orientation)
      const src = canvas.toDataURL(fileType || SUPPORTED_IMAGE_TYPES.JPG)
      const blob = getBlobFromBase64(src.split(',')[1], fileType || SUPPORTED_IMAGE_TYPES.PNG)
      const objectURL = URL.createObjectURL(blob)
      resolve({ blob, objectURL })
    }
    img.onerror = () => {
      reject({ objectURL: null })
    }
    img.src = file
  })
}

/* eslint-disable no-bitwise */
export function imageGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = (c === 'x' ? r : (r & 0x3) | 0x8)
    return v.toString(16)
  })
}
/* eslint-enable no-bitwise */

