import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Highlight, { defaultProps } from 'prism-react-renderer'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { Box } from '../Grid'
import { breakpoint, transition } from '../../utils/style'
import codeTheme from './theme'

const Container = styled(Box)`
  font-family: Menlo, Monaco, Consolas, Courier, monospace;
  font-size: 14px;
`

const LineNumber = styled.span`
  color: ${({ theme }) => theme.colors.grey300};
  display: inline-block;
  user-select: none;
  width: 35px;
`

const Pre = styled.pre`
  border-radius: 3px;
  overflow: auto;
  width: 100%;
`

const CopyButtonWrapper = styled(Box)`
  position: absolute;
  right: 0;
`

const CopyButton = styled.button`
  background: ${({ theme }) => theme.colors.grey500};
  border: 0;
  border-radius: 3px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  outline: 0;
  opacity: 0;
  padding: 20px;
  transition: ${transition()};

  ${breakpoint(0)`
    display: block;
  `}
`

const Panel = styled.div`
  position: relative;

  &:hover {
    ${CopyButton} {
      opacity: 1;
    }
  }
`

const Code = ({ children, language }) => {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => setCopied(false), 1000)
    }
  }, [copied])

  return (
    <Panel>
      <CopyToClipboard text={children} onCopy={() => setCopied(true)}>
        <CopyButtonWrapper>
          <CopyButton>{copied ? 'Copied!' : 'Copy Code'}</CopyButton>
        </CopyButtonWrapper>
      </CopyToClipboard>
      <Highlight
        {...defaultProps}
        code={children}
        language={language}
        theme={codeTheme}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <Pre className={className} style={style}>
            <Container flex={1} p={20}>
              {tokens.map((line, i) => (
                //eslint-disable-next-line react/jsx-key
                <div {...getLineProps({ line, key: i })}>
                  <LineNumber>{i + 1}</LineNumber>
                  {line.map((token, key) => (
                    //eslint-disable-next-line react/jsx-key
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </Container>
          </Pre>
        )}
      </Highlight>
    </Panel>
  )
}

Code.defaultProps = {
  copy: true,
  mb: 3
}

export default Code
