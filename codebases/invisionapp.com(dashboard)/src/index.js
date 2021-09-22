import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { ThemeProvider, Banner } from '@invisionapp/helios-one-web'
import uuidv1 from 'uuid/v1'
import 'whatwg-fetch'
import { debounce } from 'debounce'

// A note: Because this is all DOM manipulation, the end result is hard to test without mocking some React functionality.  I'm holding off on this for now.

const baseStyles = {
  span: {
    fontWeight: 500
  },

  a: {
    textDecoration: 'underline',
    color: '#fff'
  },

  'a:hover': {
    textDecoration: 'none'
  }
}

const Analytics = {
  track(name, args = {}) {
    // Analytics library will be loaded by the SPAs
    // that include this module, the `measure` object
    // will be available at this point, this check is just
    // in case the SPA is not using tracking at all
    if (window.measure) {
      const { collect } = window.measure

      collect(name, args)
    }
  }
}

const currentNodeByNodeId = {}
const nodeQueueByNodeId = {}

const fetchPriorities = () => new Promise((resolve) => {
  window.fetch('/global-banner/v1/priority', { credentials: 'same-origin' })
    .then((response) => response.json())
    .then((priorityJson) => {
      resolve(priorityJson)
    }).catch(() => {
      // If this endpoint is down, we can survive having no priorities. First in, first shown
      resolve({})
    })
})

const fetchState = (key) => new Promise((resolve) => {
  window.fetch(`/global-banner/v1/state?banners=${key}`, { credentials: 'same-origin' })
    .then((response) => response.json())
    .then((stateJson) => {
      resolve(stateJson.data)
    }).catch(() => {
      // If this endpoint is down, we can survive having no priorities. First in, first shown
      resolve({})
    })
})

const trackCtaClicks = (tracking) => (event) => {
  event.preventDefault()

  if (event.target.matches('a')) {
    Analytics.track('App.Banner.Clicked', tracking['App.Banner.Clicked'])
    document.location = event.target.href
  }
}

const heliosOneColors = {
  primary: 'primary-100',
  secondary: 'surface-100',
  info: 'primary-100',
  gray: 'surface-20'
}

const getApp = (msg, options, priorities) => {
  const {
    nodeId = 'global-banner',
    onDismiss,
    allowHtmlInput,
    className,
    key,
    background,
    color,
    dismissable,
    ...extraProps
  } = options

  const heliosPlusBackground = background ? heliosOneColors[background] : null
  const heliosOneBackground = color || null

  return () => (
    <ThemeProvider theme="light">
      <Banner
        onDismiss={
          () => {
            if (onDismiss) {
              onDismiss()
            }

            if (priorities[key]) {
              window.fetch('/global-banner/v1/state', {
                credentials: 'same-origin',
                method: 'POST',
                body: JSON.stringify({
                  kind: 'banners',
                  action: 'dismissed',
                  key,
                  data: {
                    at: Math.floor(Date.now() / 1000)
                  }
                })
              })
            }

            currentNodeByNodeId[nodeId] = null

            const currentQueue = nodeQueueByNodeId[nodeId]

            if (currentQueue.length) {
              const nextItem = currentQueue.shift()
              show(nextItem.msg, nextItem.options)
            }
          }
        }
        className={className}
        textAlignment="center"
        color={(heliosPlusBackground || heliosOneBackground) || heliosOneColors.primary}
        isDismissable={dismissable || false}
        {...extraProps}
      >
        {
          allowHtmlInput ? <span css={baseStyles} dangerouslySetInnerHTML={{ __html: msg }} /> : msg
        }
      </Banner>
    </ThemeProvider>
  )
}

// We are debouncing so multiple calls to this function won't keep rendering on screen cause a flash in case priority order keeps changing
// Please keep at, at least 300ms because helios component uses a setTimeout that we should allow to finish up
const renderNode = debounce((App, node) => {
  unmountComponentAtNode(node)
  render(<App />, node)
}, 500)

function getPriority(priorities, key) {
  return priorities[key] ? priorities[key].priority : 999999999
}

// We are using dangerouslySetInnerHTML to allow for formatted messages from our server
// Please make sure to sanitize inputs from users before they come through this function if you enable allowHtmlInput
function showUsingPriorities(msg, options, priorities) {
  const {
    nodeId = 'global-banner',
    key,
    tracking = {}
  } = options

  if (!nodeQueueByNodeId[nodeId]) {
    nodeQueueByNodeId[nodeId] = []
    currentNodeByNodeId[nodeId] = null
  }

  if (currentNodeByNodeId[nodeId] !== null) {
    const requestedPriority = getPriority(priorities, key)
    const requestedNode = { msg, options }

    if (requestedPriority < getPriority(priorities, currentNodeByNodeId[nodeId].options.key)) {
      // requested becomes new current and put other into front of queue
      const currentNode = currentNodeByNodeId[nodeId]
      currentNodeByNodeId[nodeId] = null
      nodeQueueByNodeId[nodeId].unshift(currentNode)

      showUsingPriorities(msg, options, priorities)
    } else if (nodeQueueByNodeId[nodeId].length) {
      // Stick it where it should belong
      const injectAtIndex = nodeQueueByNodeId[nodeId].findIndex((node) => {
        return getPriority(priorities, node.options.key) > requestedPriority
      })

      if (injectAtIndex === -1) {
        nodeQueueByNodeId[nodeId].push(requestedNode)
      } else {
        nodeQueueByNodeId[nodeId].splice(injectAtIndex, 0, requestedNode)
      }
    } else {
      // Goes on queue since it's empty
      nodeQueueByNodeId[nodeId].push(requestedNode)
    }

    return
  }

  let definedNode = document.querySelector('[data-banner-injection-id="global-header-nav-wrapper"]') || document.getElementById(nodeId)

  if (!definedNode && nodeId === 'global-banner') {
    definedNode = document.createElement('div')
    definedNode.setAttribute('id', nodeId)
    document.body.insertBefore(definedNode, document.body.firstChild)
  }

  if (definedNode) {
    const div = document.createElement('div')
    div.style.position = 'sticky'
    div.style.bottom = 0
    definedNode.addEventListener('click', trackCtaClicks(tracking))
    definedNode.prepend(div)
    currentNodeByNodeId[nodeId] = { msg, options }

    // We should debounce the render so we don't re-render awkwardly if nodes are fighting for priority
    renderNode(getApp(msg, options, priorities), div)

    Analytics.track('App.Banner.Displayed', tracking['App.Banner.Displayed'])
  }
}

function show(msg, options = {}) {
  const {
    key = uuidv1()
  } = options
  fetchPriorities()
    .then((priorities) => {
      if (priorities[key]) {
        fetchState(key)
          .then((state) => {
            // This is so the backend can disregard certain banners based on last time a user dismissed etc.
            if (state[key] && state[key].show) {
              showUsingPriorities(msg, { ...options, key }, priorities)
            }
          })
      } else {
        showUsingPriorities(msg, { ...options, key }, priorities)
      }
    })

  return key
}

function removeByKey(key, nodeId = 'global-banner') {
  if (!nodeQueueByNodeId[nodeId] || !key) {
    return
  }

  nodeQueueByNodeId[nodeId] = nodeQueueByNodeId[nodeId].filter((data) => data.options.key !== key)

  if (currentNodeByNodeId[nodeId] && currentNodeByNodeId[nodeId].options.key === key) {
    currentNodeByNodeId[nodeId] = null

    if (nodeQueueByNodeId[nodeId].length) {
      const nextItem = nodeQueueByNodeId[nodeId].shift()
      show(nextItem.msg, nextItem.options)
    } else {
      const definedNode = document.getElementById(nodeId)
      unmountComponentAtNode(definedNode)
      currentNodeByNodeId[nodeId] = null
    }
  }
}

export default {
  show,
  removeByKey
}
