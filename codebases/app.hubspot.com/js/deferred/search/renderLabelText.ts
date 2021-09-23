import makeText from './makeText';
import HEADLINE_RENDERERS from './HEADLINE_RENDERERS';
import DESCRIPTION_RENDERERS from './DESCRIPTION_RENDERERS';
import associatedUrl from './associatedUrl';
export default function (result, gates) {
  if (!result || !result.properties) {
    return {};
  }

  var displayText = makeText(HEADLINE_RENDERERS, result, gates);
  var subText = makeText(DESCRIPTION_RENDERERS, result, gates);
  return {
    displayText: displayText,
    subText: subText,
    associatedUrlText: associatedUrl(result)
  };
}