import React, { useEffect, useState } from 'react'

import { ToggleButton } from '../Button'

const Details = ({ summary, children, onOpen }) => {
  const [open, setOpen] = useState(false)

  useEffect(() => onOpen && onOpen(open), [open])

  return (
    <details>
      <ToggleButton as="summary" onClick={() => setOpen(!open)} open={open}>
        {summary}
      </ToggleButton>
      {children}
    </details>
  )
}

Details.defaultProps = {
  summary: 'Details Summary'
}

export default Details
