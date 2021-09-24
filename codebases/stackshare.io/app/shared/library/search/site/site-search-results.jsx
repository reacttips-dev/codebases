import toolsIcon from '../icons/tools.png';
import pencilIcon from '../icons/pencil.png';
import versionsIcon from '../icons/versions.png';
import colorModeIcon from '../icons/color-mode.png';
import questionIcon from '../icons/question.png';

const decodeImage = (type, imageUrl) => {
  if (imageUrl) {
    return imageUrl;
  }
  switch (type) {
    case 'Category':
    case 'Function':
      return toolsIcon;
    case 'Post':
      return pencilIcon;
    case 'Stack':
      return versionsIcon;
    case 'Stackup':
      return colorModeIcon;
    default:
      return questionIcon;
  }
};

const SiteSearchResults = ({children, rawResults}) => {
  const results = Object.keys(rawResults)
    .filter(key => rawResults[key].length)
    .map(key => {
      const [type, hash] = key.split('#');
      return {
        type,
        hash,
        items: rawResults[key].map(hit => ({...hit, imageUrl: decodeImage(type, hit.imageUrl)}))
      };
    });

  return children(results);
};

export default SiteSearchResults;
