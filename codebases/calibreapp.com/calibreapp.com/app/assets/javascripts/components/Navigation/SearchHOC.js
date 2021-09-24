import React from 'react'
import { hotkeys } from 'react-keyboard-shortcuts'

const handleEvent = (e, callback) => {
  if (e.preventDefault) {
    e.preventDefault()
  } else {
    // internet explorer
    e.returnValue = false
  }
  callback()
}

class SearchHOC extends React.PureComponent {
  hot_keys = {
    'meta+p': {
      priority: 1,
      handler: e => handleEvent(e, this.props.onSearch)
    },
    'ctrl+p': {
      priority: 1,
      handler: e => handleEvent(e, this.props.onSearch)
    },
    esc: {
      priority: 1,
      handler: e => handleEvent(e, this.props.onCancel)
    }
  }

  render() {
    return this.props.children
  }
}

export default hotkeys(SearchHOC)
