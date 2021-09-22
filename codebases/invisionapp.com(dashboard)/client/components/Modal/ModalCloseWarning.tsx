import * as React from 'react'

type ModalCloseWarningProps = {
  children: any
}

const ModalCloseWarning = ({ children }: ModalCloseWarningProps) => {
  return <>{children || 'You have unsaved changes'}</>
}

export default ModalCloseWarning
