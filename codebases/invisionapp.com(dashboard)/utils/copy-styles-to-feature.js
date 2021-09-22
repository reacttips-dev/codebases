/* global parent */
export default function copyStylesToFeature (featureWindow) {
  let create = false

  let cssText = ''
  let styleElem = featureWindow.document.querySelector('[data-sidebar-injected="true"]')
  if (!styleElem) {
    styleElem = featureWindow.document.createElement('style')
    create = true
  }

  styleElem.setAttribute('type', 'text/css')
  styleElem.setAttribute('data-sidebar-injected', 'true')

  window.requestAnimationFrame(() => {
    const stylesheets = parent && parent.document ? parent.document.styleSheets : document.styleSheets

    for (let i in [...stylesheets]) {
      const sheet = stylesheets[i]

      if (sheet.ownerNode && (!!sheet.ownerNode.dataset.sidebarCss || !!sheet.ownerNode.dataset.sidebar)) {
        for (let j in sheet.rules) {
          if (sheet.rules[j].cssText) cssText += sheet.rules[j].cssText
        }
      }
    }

    styleElem.textContent = cssText
    if (create) featureWindow.document.head.prepend(styleElem)
  })
}
