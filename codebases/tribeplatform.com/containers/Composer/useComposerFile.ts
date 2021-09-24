import Quill from 'quill'

import useThemeSettings from 'containers/AdminSettings/hooks/useThemeSettings'

import useCreateImages, { UploadedImage } from 'hooks/useCreateImages'

import {
  ComposerMediaCompleteEvent,
  ComposerMediaCreateEvent,
} from './hooks/useMediaUploadStatus'

const useComposerFile = () => {
  const { upload: uploadMedia } = useCreateImages()
  const { themeSettings } = useThemeSettings()

  const insertImage = (quill: Quill, uploadPromise: Promise<any>) => {
    if (!uploadPromise) return

    const range = quill.getSelection(true)
    quill.insertEmbed(
      range?.index,
      'image',
      { uploadPromise, themeSettings },
      'user',
    )
    // eslint-disable-next-line i18next/no-literal-string
    quill.setSelection(range?.index + 1, 0, 'silent')
  }

  const upload = async (
    files: FileList,
    quill?: Quill | null,
  ): Promise<UploadedImage[] | undefined> => {
    try {
      if (!files) {
        return
      }
      quill?.root?.dispatchEvent?.(new CustomEvent(ComposerMediaCreateEvent))
      const uploadFiles = Array.from(files).map(f => ({ imageFile: f }))

      const uploadMediaPromise = uploadMedia(uploadFiles)

      if (quill) {
        insertImage(quill, uploadMediaPromise)
      }

      await uploadMediaPromise
      quill?.root?.dispatchEvent?.(new CustomEvent(ComposerMediaCompleteEvent))
    } catch {
      // Feedback and error handling happens elsewhere.
      quill?.root?.dispatchEvent?.(new CustomEvent(ComposerMediaCompleteEvent))
    }
  }

  return {
    upload,
    insertImage,
  }
}

export default useComposerFile
