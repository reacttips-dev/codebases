'use strict'

module.exports = () => {
  const rum = window.DD_RUM
  const context = rum && rum.getInternalContext && rum.getInternalContext()

  return { ...context }
}
