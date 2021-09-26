import { FormattedDateString } from '../components/FormattedDate'

NodeList.prototype.forEach = Array.prototype.forEach

export default () => {
  document.querySelectorAll('[relativeTime]').forEach(element => {
    element.innerText = FormattedDateString({ date: element.innerText })
  })
}
