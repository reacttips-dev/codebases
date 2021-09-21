type FitTextOptions = {
  maxWidth: number
  minFontSizeInRem: number
  maxFontSizeInRem: number
}

// The following is based on textFit library https://github.com/STRML/textFit
export function fitText<T extends HTMLElement>({
  maxWidth: maxTextWidth = 1,
  minFontSizeInRem,
  maxFontSizeInRem,
}: FitTextOptions) {
  return (element: T | null) => {
    if (!element) {
      return
    }
    const parent = element.parentElement

    if (!parent) {
      return
    }

    // Get base font size so that we can parse rem into px
    const baseFontSize = parseFloat(
      window.getComputedStyle(document.documentElement).fontSize
    )

    let low = baseFontSize * minFontSizeInRem
    let high = baseFontSize * maxFontSizeInRem

    const maxWidth = parent.clientWidth * maxTextWidth
    const maxHeight = parent.clientHeight * maxWidth

    let fontSize = low
    let mid

    // Binary search to find the most fitting font size
    while (low <= high) {
      mid = (high + low) / 2
      element.style.fontSize = mid + "px"
      if (
        element.scrollWidth <= maxWidth &&
        element.scrollHeight <= maxHeight
      ) {
        fontSize = mid
        low = mid + 1
      } else {
        high = mid - 1
      }
    }

    element.style.fontSize = `${fontSize}px`
  }
}
