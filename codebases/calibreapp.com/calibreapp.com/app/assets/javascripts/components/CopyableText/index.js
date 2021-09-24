import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { transition } from '../../utils/style'
import { Copy } from '../Actions'

const CopyableTextBlock = styled.div`
  cursor: pointer;
  font-size: 14px;
  display: inline-block;
  position: relative;

  &:hover {
    > * {
      opacity: 1;
      visibility: visible;
    }
  }
`

const CopyableTextDisplay = styled.div`
  cursor: pointer;
  font-size: 14px;
  background-color: ${props => props.theme.colors.grey100};
  border-radius: 3px;
  padding: 3px 5px;
  margin-right: 9px;
`

const CopyableTextOverlay = styled.div`
  background-color: RGBA(255, 255, 255, 0.9);
  bottom: 0;
  left: 0;
  opacity: 0;
  text-align: center;
  position: absolute;
  right: 0;
  transition: ${transition({ attribute: 'opacity' })};
  visibility: hidden;
  top: 0;
`
const CopyWrapper = styled.div`
  display: flex;
  align-items: center;
`

const CopyableText = ({ children, text, prompt, layout }) => {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => setCopied(false), 1000)
    }
  }, [copied])

  return (
    <CopyToClipboard text={text || children} onCopy={() => setCopied(true)}>
      {layout === 'overlay' ? (
        <CopyableTextBlock position="relative">
          {children}
          <CopyableTextOverlay>
            <Copy label={copied ? 'Copied!' : prompt} />
          </CopyableTextOverlay>
        </CopyableTextBlock>
      ) : (
        <CopyWrapper>
          <CopyableTextDisplay position="relative" layout="button">
            {children}
          </CopyableTextDisplay>
          <div>
            <Copy label={copied ? 'Copied!' : prompt} />
          </div>
        </CopyWrapper>
      )}
    </CopyToClipboard>
  )
}

CopyableText.defaultProps = {
  prompt: 'Copy',
  layout: 'overlay'
}

export default CopyableText
