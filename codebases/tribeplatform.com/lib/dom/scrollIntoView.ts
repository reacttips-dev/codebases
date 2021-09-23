import scrollIntoView from 'scroll-into-view-if-needed'

const scrollElementIntoView = (element: HTMLElement): void => {
  if (!element) return
  scrollIntoView(element, {
    behavior: 'auto',
    scrollMode: 'if-needed',
  })
}

export default scrollElementIntoView
