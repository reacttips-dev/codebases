const imageMimeMatcher = /(png|jpeg|jpg|gif|webp|svg)/
const jsMimeMatcher = /javascript$/
const fontMimeMatcher = /(ttf|woff|woff2|eot)/
const jsonMimeMatcher = /json/
const videoMimeMatcher = /video/

const convertRequestToAssetClassification = mimeType => {
  if (mimeType == 'text/html') return 'HTML'
  else if (mimeType == 'text/css') return 'CSS'
  else if (imageMimeMatcher.test(mimeType)) return 'Image'
  else if (jsMimeMatcher.test(mimeType)) return 'JavaScript'
  else if (fontMimeMatcher.test(mimeType)) return 'Font'
  else if (jsonMimeMatcher.test(mimeType)) return 'JSON'
  else if (videoMimeMatcher.test(mimeType)) return 'Video'
  else return 'Other'
}

export default convertRequestToAssetClassification
