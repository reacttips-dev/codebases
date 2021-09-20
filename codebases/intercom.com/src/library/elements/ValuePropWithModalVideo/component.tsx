import useModalOpenState from 'marketing-site/lib/useModalOpenState'
import Modal, { ModalSize } from 'marketing-site/src/components/common/Modal'
import React, { useRef, useState } from 'react'
import { REACT_MODAL_CONTENT_STYLES, REACT_MODAL_OVERLAY_STYLES } from '../../utils'
import { CloseButton } from '../CloseButton'
import { RichText } from '../RichText'
import { Text } from '../Text'
import { IProps } from './index'
import styles from './styles.scss'

export function ValuePropWithModalVideo({
  text,
  triggerModalVideo,
  modalSize = 'XSmall',
  modalHeadline,
  modalContent,
  video,
}: IProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [modalOpen, openModal, closeModal] = useModalOpenState()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const size = ModalSize[modalSize]
  const contentStyles = {
    ...REACT_MODAL_CONTENT_STYLES,
    maxWidth: size,
    overflow: 'visible',
    backgroundColor: 'transparent',
  }

  const overlayStyles = {
    ...REACT_MODAL_OVERLAY_STYLES,
    boxShadow: 'none',
    zIndex: '300',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

  function handleValuePropClick() {
    openModal()
  }

  function handleVideoClick() {
    setIsPlaying(true)
    videoRef.current?.play()
  }

  return (
    <>
      {triggerModalVideo ? (
        <>
          <button className="vp-modal-trigger" onClick={handleValuePropClick}>
            {text}
          </button>
          <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            showCloseIcon={false}
            style={{
              content: contentStyles,
              overlay: overlayStyles,
            }}
          >
            <div className="vp-modal-content">
              <span className="close-button">
                <CloseButton onClick={closeModal} />
              </span>
              {video && (
                <div className="vp-video__wrapper">
                  <button
                    className={`video-poster-button ${isPlaying ? 'video--playing' : ''}`}
                    onClick={handleVideoClick}
                    type="button"
                  >
                    <img alt="Video Poster" src={video.posterImage} className="poster-img" />
                  </button>
                  {/* eslint-disable-next-line */}
                  <video
                    className={`video ${isPlaying ? 'video--playing' : ''}`}
                    ref={videoRef}
                    src={video.videoUrl}
                    poster={video.posterImage}
                    controls={true}
                  />
                </div>
              )}
              {modalContent && (
                <div className="vp-content__wrapper">
                  {modalHeadline && <h3>{modalHeadline}</h3>}
                  <Text size="caption">
                    <RichText html={modalContent} />
                  </Text>
                </div>
              )}
            </div>
          </Modal>
        </>
      ) : (
        <p>{text}</p>
      )}
      <style jsx>{styles}</style>
    </>
  )
}
