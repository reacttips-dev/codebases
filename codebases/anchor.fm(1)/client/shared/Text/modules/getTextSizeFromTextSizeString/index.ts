import { TextSize, TextSizeString } from '../../index.d';

const getTextSizeFromTextSizeString = (
  textSizeString: TextSizeString
): TextSize => {
  switch (textSizeString) {
    case 'xs':
      return {
        kind: 'TextSizeXS',
      };
    case 'sm':
      return {
        kind: 'TextSizeSM',
      };
    case 'md':
      return {
        kind: 'TextSizeMD',
      };
    case 'lg':
      return {
        kind: 'TextSizeLG',
      };
    case 'xl':
      return {
        kind: 'TextSizeXL',
      };
    default:
      const exhaustiveCheck: never = textSizeString;
      return exhaustiveCheck;
  }
};

export { getTextSizeFromTextSizeString };
