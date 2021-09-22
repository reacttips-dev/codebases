import React from 'react'
import styled from 'styled-components'

type FileInputProps = {
  name: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  accept?: string
  id: string
  disableCursor?: boolean
}

const FileInput = ({ name, onChange, accept, id, disableCursor }: FileInputProps) => {
  return (
    <StyledInput
      id={id}
      type="file"
      name={name}
      onChange={e => onChange(e)}
      // @ts-ignore
      onClick={e => (e.target.value = null)} // eslint-disable-line
      accept={accept}
      disableCursor={disableCursor}
    />
  )
}

const StyledInput = styled.input<FileInputProps>`
  position: absolute;
  z-index: 30;
  top: 0;
  left: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  cursor: pointer;
  opacity: 0;

  ${props => (props.disableCursor ? 'pointer-events: none' : '')};
`

FileInput.defaultProps = {
  accept: '.gif, .jpg, .jpeg, .png'
}

export default FileInput
