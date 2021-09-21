/*
 * ELASTICSEARCH CONFIDENTIAL
 * __________________
 *
 *  Copyright Elasticsearch B.V. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Elasticsearch B.V. and its suppliers, if any.
 * The intellectual and technical concepts contained herein
 * are proprietary to Elasticsearch B.V. and its suppliers and
 * may be covered by U.S. and Foreign Patents, patents in
 * process, and are protected by trade secret or copyright
 * law.  Dissemination of this information or reproduction of
 * this material is strictly forbidden unless prior written
 * permission is obtained from Elasticsearch B.V.
 */

import cx from 'classnames'
import React, { Component } from 'react'

import './fileUploadButton.scss'

interface Props {
  multiple?: boolean
  onChange: (fileOrFiles: File | File[]) => void
  disabled?: boolean
  className?: string
}

interface State {
  dropzoneActive: boolean
  dropzoneHover: boolean
}

export class CuiFileUploadButton extends Component<Props, State> {
  private dropzone: HTMLLabelElement | null

  private fileInput: HTMLInputElement | null

  private form: HTMLFormElement | null

  constructor(props) {
    super(props)
    this.onDragEnter = this.onDragEnter.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.onHover = this.onHover.bind(this)
    this.onHoverEnd = this.onHoverEnd.bind(this)
    this.handleFileDrop = this.handleFileDrop.bind(this)
    this.handleFileChange = this.handleFileChange.bind(this)
  }

  state: State = {
    dropzoneActive: false,
    dropzoneHover: false,
  }

  componentDidMount() {
    document.addEventListener(`dragenter`, this.onDragEnter)
    document.addEventListener(`dragend`, this.onDragEnd)
    document.addEventListener(`mouseout`, this.onDragEnd)
    document.addEventListener(`drop`, this.onDragEnd)

    if (this.dropzone != null) {
      this.dropzone.addEventListener(`dragover`, this.onHover)
      this.dropzone.addEventListener(`dragleave`, this.onHoverEnd)
      this.dropzone.addEventListener(`drop`, this.handleFileDrop)
    }

    if (this.fileInput != null) {
      this.fileInput.addEventListener(`change`, this.handleFileChange)
    }
  }

  componentWillUnmount() {
    document.removeEventListener(`dragenter`, this.onDragEnter)
    document.removeEventListener(`dragend`, this.onDragEnd)
    document.removeEventListener(`mouseout`, this.onDragEnd)
    document.removeEventListener(`drop`, this.onDragEnd)

    if (this.dropzone != null) {
      this.dropzone.removeEventListener(`dragover`, this.onHover)
      this.dropzone.removeEventListener(`dragleave`, this.onHoverEnd)
      this.dropzone.removeEventListener(`drop`, this.handleFileDrop)
    }

    if (this.fileInput != null) {
      this.fileInput.removeEventListener(`change`, this.handleFileChange)
    }
  }

  render() {
    const { multiple, children, className, disabled } = this.props
    const { dropzoneActive, dropzoneHover } = this.state

    const formClasses = cx(`cuiFileUploadButton-form`, className)
    const dropzoneClasses = cx(`cuiFileUploadButton-dropzone`, {
      'cuiFileUploadButton-dropzone--active': dropzoneActive,
      'cuiFileUploadButton-dropzone--hover': dropzoneHover,
    })

    return (
      <form
        className={formClasses}
        ref={(el) => {
          this.form = el
        }}
      >
        <label
          className={dropzoneClasses}
          ref={(el) => {
            this.dropzone = el
          }}
        >
          <input
            disabled={disabled}
            type='file'
            className='cuiFileUploadButton-input'
            ref={(el) => {
              this.fileInput = el
            }}
            multiple={multiple}
          />
          {children}
        </label>
      </form>
    )
  }

  onDragEnter() {
    this.setState({ dropzoneActive: true })
  }

  onDragEnd() {
    this.setState({ dropzoneActive: false, dropzoneHover: false })
  }

  onHover(event) {
    this.setState({ dropzoneHover: true })
    event.dataTransfer.dropEffect = `copy`
    event.preventDefault()
  }

  onHoverEnd() {
    this.setState({ dropzoneHover: false })
  }

  handleFileDrop(event: DragEvent) {
    event.preventDefault()

    if (event.dataTransfer) {
      this.selectedFiles(Array.from(event.dataTransfer.files))
    }
  }

  handleFileChange(event: Event) {
    if (event.target) {
      const inputElement = event.target as HTMLInputElement

      if (inputElement.files) {
        this.selectedFiles(Array.from(inputElement.files))
      }
    }
  }

  selectedFiles(files: File[]) {
    const { onChange, multiple } = this.props

    if (files.length > 0) {
      onChange(multiple ? files : files[0])
    }

    // If we don't clear the form, then if the user tries to upload the
    // file again (i.e. there was an error in transit) the onChange won't
    // trigger.
    this.form!.reset()
  }
}
