import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import trimHtml from 'trim-html'

import { Align } from '@invisionapp/helios'
import { sanitize } from '../../utils/sanitize'
import sanitizeName from '../../utils/sanitizeName'

class Title extends React.Component {
  componentDidMount () {
    var elem = ReactDOM.findDOMNode(this)

    var renameElement = document.createElement('h1')
    renameElement.className = `${this.props.className || ''}${this.props.isEmpty ? ' empty' : ''}`
    renameElement.spellcheck = false
    renameElement.setAttribute('data-placeholder', this.props.placeholder)
    renameElement.textContent = this.props.title

    if (this.props.allowEdit) {
      renameElement.setAttribute('contentEditable', 'true')
    } else {
      renameElement.classList.add('no-edit')
    }

    elem.appendChild(renameElement)

    renameElement.addEventListener('focus', this.handleOnFocus.bind(this), false)
    renameElement.addEventListener('blur', this.handleOnBlur.bind(this), false)
    renameElement.addEventListener('paste', this.handlePaste.bind(this), false)
    renameElement.addEventListener('keydown', this.handleKeyDown.bind(this), false)
    renameElement.addEventListener('keyup', this.handleKeyUp.bind(this), false)
  }

  componentDidUpdate (prevProps) {
    var node = ReactDOM.findDOMNode(this)
    var renameElement = node.querySelector('h1')
    const { error } = this.props

    if (!prevProps.allowEdit && !!this.props.allowEdit) {
      node.classList.remove('no-edit')
      renameElement.setAttribute('contentEditable', 'true')
    } else if (!!prevProps.allowEdit && !this.props.allowEdit) {
      node.classList.add('no-edit')
      renameElement.setAttribute('contentEditable', 'false')
    }

    if (
      (prevProps.title !== this.props.title) ||
      (
        (renameElement.textContent === '') &&
        !!this.props.title &&
        !this.props.allowEmpty
      )
    ) {
      this.setElementContents(renameElement, this.props.title)
    } else if (error && error.message && error.message.includes('TITLE_NOT_UNIQUE')) {
      this.setElementContents(renameElement, this.props.title)
      this.selectElementContents(renameElement)
    }
  }

  componentWillUpdate () {
    this.forceRepaint()
  }

  render () {
    return <Align horizontal='start' vertical='start' />
  }

  handleOnFocus (e) {
    this.forceRepaint()

    var elem = e.target
    elem.spellcheck = true
    elem.classList.add('editing')

    var innerContent = this.getElementContents(elem)

    if (this.props.onFocus) {
      this.props.onFocus(e)
    }

    // HACK: the browser requires a change to happen before spellchecking on
    // a contenteditable field.
    if (innerContent.length > 0) {
      this.setElementContents(elem, innerContent + ' ', false)
    }
  }

  handleOnBlur (e) {
    const elem = e.target

    var textContent = this.getElementContents(elem)
    textContent = this.sanitizeValue(textContent)
    this.forceRepaint()

    if (elem.classList.contains('editing')) {
      elem.classList.remove('editing')
    }

    if (this.props.onBlur) {
      this.props.onBlur(e)
    }

    // save the change.
    this.submitForm(textContent)
    this.keyHandler(e)

    e.target.spellcheck = false
  }

  handlePaste (e) {
    e.preventDefault()
    let pasteEvent = e.originalEvent || e
    let text

    if (pasteEvent.clipboardData.types) {
      text = pasteEvent.clipboardData.getData('text/plain')
    }

    if (typeof text !== 'undefined') {
      document.execCommand('insertText', false, this.sanitizeValue(text))
    }
  }

  handleKeyDown (e) {
    if (e.which === 13) {
      if (!e.shiftKey) {
        e.preventDefault()
        window.getSelection().removeAllRanges()
        e.target.blur()
      }
    } else if (e.which === 27) {
      e.preventDefault()
      this.setElementContents(e.target, this.props.title)
      e.target.blur()
    } else if (
      !e.metaKey &&
      !e.ctrlKey &&
      [8, 37, 38, 39, 40].indexOf(e.which) === -1
    ) {
      if (e.target.textContent.length >= this.props.charLimit) {
        var selObj = window.getSelection()
        var selRange = selObj.getRangeAt(0)

        if (
          !!selRange &&
          selRange.startOffset !== selRange.endOffset &&
          selRange.commonAncestorContainer.parentNode === e.target
        ) {
          // If someone has selected text and is trying to replace
          // it, we should let that through.
        } else {
          e.preventDefault()
        }
      }
    }

    this.keyHandler(e)
  }

  handleKeyUp (e) {
    if (e.which !== 13) {
      this.keyHandler(e)
    }
  }

  keyHandler (e) {
    var elem = ReactDOM.findDOMNode(this)

    if (this.props.isEmpty) {
      this.getElementContents(e.target).length > 0
        ? elem.classList.remove('empty')
        : elem.classList.add('empty')
    }
  }

  getElementContents (element) {
    return element.textContent
  }

  setElementContents (element, value, sanitize = true) {
    var val = value

    if (value) {
      if (sanitize) {
        val = this.sanitizeValue(value)
      }

      if (this.props.allowLineBreaks) {
        element.innerHTML = val
      } else {
        element.textContent = val
      }
    } else {
      if (this.props.allowLineBreaks) {
        element.innerHTML = ''
      } else {
        element.textContent = ''
      }
    }
  }

  selectElementContents (el) {
    const range = document.createRange()
    const sel = window.getSelection()

    range.selectNodeContents(el)
    sel.removeAllRanges()
    sel.addRange(range)
  }

  sanitizeValue (value) {
    if (!value) {
      return ''
    }

    // Strip out all HTML characters by default.
    var clean = this.purify(value)

    // Remove breaks
    clean = clean.replace(/<(\/)?br(\s+)?(\/)?>|\n/g, '')

    // Remove leading and trailing spaces
    clean = clean.trim()

    // Remove trailing tabs
    clean = clean.replace(/[\t]+$/g, '')

    // Convert &amp; to &
    clean = clean.replace(/&amp;/g, '&')

    // Remove leftover < and > chars
    clean = clean.replace(/<|>/g, '')

    // replace \n with breaks
    clean = clean.replace(/\\n/g, '<br>')

    // Remove non breaking or double spaces
    clean = clean.replace(/&nbsp;|\s\s+/g, ' ')

    // Trim it down to the character limit
    if (this.props.charLimit) {
      clean = this.trimToCharacterLimit(clean, this.props.charLimit)
    }

    // If just an empty <br> tags remains,
    // clear it
    if (clean === '<br>') {
      clean = ''
    }

    // Use sanitizeName to trim trailing periods
    const sanitizeOptions = {
      doTrimTrailingPeriods: true,
      maxLength: this.props.charLimit
    }

    return sanitizeName(clean, sanitizeOptions)
  }

  trimToCharacterLimit (value, limit) {
    var trim = trimHtml(value, {
      limit: limit,
      suffix: ' '
    })

    // Trim the suffix
    return trim.html.replace(/[ \t]+$/, '')
  }

  purify (value) {
    return sanitize(value)
  }

  forceRepaint () {
    var isFirefox = (typeof window.mozInnerScreenX !== 'undefined')
    if (isFirefox) {
      ReactDOM.findDOMNode(this).style.display = 'none'
      ReactDOM.findDOMNode(this).offsetHeight // eslint-disable-line
      ReactDOM.findDOMNode(this).style.display = ''
    }
  }

  submitForm (value) {
    value = this.sanitizeValue(value)

    var element = ReactDOM.findDOMNode(this).querySelector('h1')

    // If the input value has not changed (or is cleared), simply hide the form.
    if (!value || value === this.props.title || value === this.props.placeholder) {
      this.setElementContents(element, this.props.title)
      return
    }

    // update our view and submit the form.
    this.props.onSubmit(value)
  }
}

Title.propTypes = {
  allowEdit: PropTypes.bool,
  charLimit: PropTypes.number,
  className: PropTypes.string,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  title: PropTypes.string
}

export default Title
