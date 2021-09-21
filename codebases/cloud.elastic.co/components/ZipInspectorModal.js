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

import React, { Component, Fragment } from 'react'
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl'

import { find, values, sortBy, isEmpty } from 'lodash'

import Zip from 'jszip'

import {
  EuiButton,
  EuiErrorBoundary,
  EuiFormHelpText,
  EuiFormLabel,
  EuiLoadingSpinner,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiProgress,
  EuiSelect,
  EuiSpacer,
  EuiText,
  EuiTextColor,
} from '@elastic/eui'

import { CuiAlert, CuiCodeBlock } from '../cui'

import Percentage from '../lib/Percentage'

import prettySize from '../lib/prettySize'

import lightTheme from '../lib/theme/light'

const { euiBreakpoints } = lightTheme
const chunkSize = 64
const chunkSizeBytes = chunkSize * 1024

const messages = defineMessages({
  chooseHandle: {
    id: `zip-inspector.choose-handle`,
    defaultMessage: `Choose a file …`,
  },
})

class ZipInspectorModal extends Component {
  slowTimer = null

  state = {
    unzipHandles: null,
    unzipError: null,
    selectedHandle: null,
    contentChunks: [],
    blob: null,
    blobReadIndex: 0,
    blobReading: false,
    blobReadingSlow: false,
    blobReadingError: null,
  }

  componentDidMount() {
    this.crackZipOpen()
  }

  render() {
    const { title, close } = this.props
    const { unzipHandles } = this.state

    return (
      <EuiOverlayMask>
        <EuiModal onClose={close} style={{ width: euiBreakpoints.m }}>
          <EuiModalHeader>
            <div style={{ width: `100%` }}>
              <EuiModalHeaderTitle>{title}</EuiModalHeaderTitle>

              <EuiSpacer size='m' />

              <EuiErrorBoundary>
                {
                  /* We render these in the header as a hack,
                   * so that EUI doesn't scroll them out of view
                   */
                  this.renderInputState()
                }
              </EuiErrorBoundary>

              <EuiSpacer size='m' />
            </div>
          </EuiModalHeader>

          <EuiModalBody>
            <div ref={this.setContainerRef}>
              {unzipHandles && (
                <Fragment>
                  <EuiFormLabel>
                    <FormattedMessage id='zip-inspector.contents' defaultMessage='Contents' />
                  </EuiFormLabel>

                  <EuiSpacer size='xs' />

                  <EuiErrorBoundary>{this.renderFileContents()}</EuiErrorBoundary>
                </Fragment>
              )}
            </div>
          </EuiModalBody>

          <EuiModalFooter>
            <EuiButton onClick={close}>
              <FormattedMessage id='zip-inspector.close' defaultMessage='Close' />
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    )
  }

  renderInputState() {
    const { unzipError, unzipHandles } = this.state

    if (unzipError) {
      return null
    }

    if (!unzipHandles) {
      return <EuiLoadingSpinner />
    }

    return (
      <EuiFlexGroup gutterSize='m' alignItems='center' justifyContent='spaceBetween'>
        <EuiFlexItem grow={false}>
          <EuiFormLabel>
            <FormattedMessage id='zip-inspector.choose-handle-label' defaultMessage='File' />
          </EuiFormLabel>

          <EuiSpacer size='xs' />

          {this.renderFileSelection()}
        </EuiFlexItem>

        {this.renderSlowIndicator()}
      </EuiFlexGroup>
    )
  }

  renderFileSelection() {
    const {
      intl: { formatMessage },
    } = this.props

    const { unzipHandles, selectedHandle } = this.state

    const selectedName = selectedHandle ? selectedHandle.name : ``

    if (isEmpty(unzipHandles)) {
      return (
        <EuiTextColor color='subdued'>
          <FormattedMessage
            id='zip-inspector.empty-zip-file'
            defaultMessage="There aren't any files to show you, sorry!"
          />
        </EuiTextColor>
      )
    }

    if (unzipHandles.length === 1) {
      const [{ name }] = unzipHandles

      return (
        <EuiText>
          <p>{name}</p>
        </EuiText>
      )
    }

    const options = unzipHandles.map((handle) => {
      const { name } = handle
      const withoutDirectory = name.slice(name.indexOf(`/`) + 1)

      return {
        text: withoutDirectory,
        value: name,
      }
    })

    options.unshift({
      text: formatMessage(messages.chooseHandle),
      value: ``,
    })

    return (
      <EuiSelect
        defaultValue={selectedName}
        options={options}
        onChange={(e) => this.selectFileHandle(e.target.value)}
      />
    )
  }

  renderSlowIndicator() {
    const { zip, filename } = this.props

    const { blob, blobReadIndex, blobReadingSlow } = this.state

    if (!blob || !blobReadingSlow) {
      return null
    }

    const { size } = blob
    const complete = 1 - (size - blobReadIndex) / size

    return (
      <EuiFlexItem grow={false}>
        <EuiFormLabel>
          <FormattedMessage
            id='zip-inspector.might-take-a-while'
            defaultMessage='This file is too large for the browser'
          />
        </EuiFormLabel>

        <EuiProgress color='subdued' value={complete} max={1} />

        <EuiFormHelpText>
          <EuiTextColor color='warning'>
            <FormattedMessage
              id='zip-inspector.slow-progress'
              defaultMessage='Loaded { percentage } of { size }. Try the { download } instead.'
              values={{
                percentage: <Percentage value={complete} />,
                size: prettySize(size / 1024 / 1024), // Convert to MB from B
                download: (
                  <EuiLink href={zip.blobUrl} download={filename}>
                    <FormattedMessage id='zip-inspector.download' defaultMessage='zip download' />
                  </EuiLink>
                ),
              }}
            />
          </EuiTextColor>
        </EuiFormHelpText>
      </EuiFlexItem>
    )
  }

  renderFileContents() {
    const {
      unzipError,
      selectedHandle,
      contentChunks,
      blobReading,
      blobReadingError,
      blobReadingSlow,
    } = this.state

    if (unzipError) {
      return <CuiAlert type='error'>{unzipError}</CuiAlert>
    }

    if (selectedHandle === null) {
      return (
        <EuiTextColor color='subdued'>
          <FormattedMessage
            id='zip-inspector.select-a-file'
            defaultMessage='Select a file to inspect its contents.'
          />
        </EuiTextColor>
      )
    }

    if (blobReadingError) {
      return <CuiAlert type='error'>{blobReadingError}</CuiAlert>
    }

    if (isEmpty(contentChunks)) {
      if (blobReading) {
        return <EuiLoadingSpinner />
      }

      return (
        <EuiTextColor color='subdued'>
          <FormattedMessage
            id='zip-inspector.empty-file'
            defaultMessage='The file appears to be empty.'
          />
        </EuiTextColor>
      )
    }

    const language = this.getFileLanguage()
    const tailFirst = this.shouldLoadTailFirst()

    return (
      <Fragment>
        {tailFirst && blobReadingSlow && (
          <Fragment>
            <EuiSpacer size='m' />

            <EuiButton iconType='expand' onClick={() => this.readNextChunk()}>
              <FormattedMessage
                id='zip-inspector.load-previous-chunk'
                defaultMessage='Load the previous { chunkSize } KB …'
                values={{ chunkSize }}
              />
            </EuiButton>

            <EuiSpacer />
          </Fragment>
        )}

        <CuiCodeBlock language={blobReading ? null : language} style={{ wordBreak: `break-all` }}>
          {contentChunks.join(``)}
        </CuiCodeBlock>

        {!tailFirst && blobReadingSlow && (
          <Fragment>
            <EuiSpacer />

            <EuiButton iconType='expand' onClick={() => this.readNextChunk()}>
              <FormattedMessage
                id='zip-inspector.load-next-chunk'
                defaultMessage='Load the next { chunkSize } KB …'
                values={{ chunkSize }}
              />
            </EuiButton>
          </Fragment>
        )}
      </Fragment>
    )
  }

  crackZipOpen() {
    const { zip } = this.props

    Zip.loadAsync(zip.blob)
      .then((result) => {
        const unzipHandles = sortBy(values(result.files), `name`)

        this.setState({ unzipHandles })

        if (unzipHandles.length === 1) {
          const [{ name }] = unzipHandles
          this.selectFileHandle(name)
        }

        return null
      })
      .catch((err) => this.setState({ unzipError: err }))
  }

  selectFileHandle(name) {
    const { unzipHandles } = this.state
    const handle = find(unzipHandles, { name }) || null

    if (this.containerRef) {
      this.containerRef.scrollTop = 0
    }

    this.readBlobEnded(null, {
      selectedHandle: handle,
      contentChunks: [],
      blobReading: true,
    })

    if (handle === null) {
      return
    }

    handle
      .async(`blob`)
      .then((blob) => this.readBlob(blob))
      .catch((err) => {
        this.readBlobEnded(err)
      })
  }

  readBlob(blob) {
    this.setState({
      blob,
    })
    this.startSlowTimer()
    this.readNextChunk()
  }

  readNextChunk() {
    const chunk = this.getNextChunk()
    const reader = new window.FileReader()

    reader.onerror = (err) => {
      this.readBlobEnded(err)
    }

    reader.onload = () => {
      const { error, result } = reader

      if (error) {
        this.readBlobEnded(error)
        return
      }

      this.readNextChunkFinished(result)
    }

    reader.readAsText(chunk)
  }

  getNextChunk() {
    const tailFirst = this.shouldLoadTailFirst()
    const { blob, blobReadIndex } = this.state

    if (tailFirst) {
      const end = blob.size - blobReadIndex
      const start = end - chunkSizeBytes

      return blob.slice(start, end)
    }

    const start = blobReadIndex
    const end = blobReadIndex + chunkSizeBytes

    return blob.slice(start, end)
  }

  readNextChunkFinished(chunk) {
    const tailFirst = this.shouldLoadTailFirst()

    const { blob, blobReadIndex, contentChunks } = this.state

    const nextIndex = blobReadIndex + chunkSizeBytes
    const finished = nextIndex >= blob.size

    const nextChunks = getNextChunks()

    if (finished) {
      this.readBlobEnded(null, {
        contentChunks: nextChunks,
      })
      return
    }

    this.setState(
      {
        contentChunks: nextChunks,
        blobReadIndex: nextIndex,
      },
      () => this.readNextChunkUntilDeemedSlow(),
    )

    function getNextChunks() {
      const startOrFinished = isEmpty(contentChunks) || finished
      const shouldIgnore = startOrFinished && isEmpty(chunk.trim())

      if (shouldIgnore) {
        return contentChunks
      }

      if (tailFirst) {
        return [chunk].concat(contentChunks)
      }

      return contentChunks.concat([chunk])
    }
  }

  readNextChunkUntilDeemedSlow() {
    const { blobReadingSlow } = this.state

    if (blobReadingSlow) {
      return
    }

    this.readNextChunk()
  }

  startSlowTimer() {
    this.slowTimer = setTimeout(() => this.markSlow(), 1000)
  }

  stopSlowTimer() {
    clearTimeout(this.slowTimer)
    this.slowTimer = null
  }

  markSlow() {
    const { blobReading } = this.state

    if (blobReading) {
      this.setState({ blobReadingSlow: true })
    }
  }

  readBlobEnded(err, rest = {}) {
    this.stopSlowTimer()
    this.setState({
      blob: null,
      blobReadIndex: 0,
      blobReading: false,
      blobReadingSlow: false,
      blobReadingError: err,
      ...rest,
    })
  }

  getFileLanguage() {
    const { selectedHandle } = this.state
    const { name } = selectedHandle
    return name.slice(name.lastIndexOf(`.`) + 1)
  }

  shouldLoadTailFirst() {
    const language = this.getFileLanguage()
    return language === `log`
  }

  setContainerRef = (ref) => {
    this.containerRef = ref ? ref.parentElement : null
  }
}

export default injectIntl(ZipInspectorModal)
