import { warn } from "./warn"

export function showCustomCssDeprecationMessage(customCss: any) {
  if (customCss === undefined) {
    return
  }
  warn(
    `Styling components via "customCss" prop is deprecated, please use Emotion "css" prop or pass a "className"`
  )
}
