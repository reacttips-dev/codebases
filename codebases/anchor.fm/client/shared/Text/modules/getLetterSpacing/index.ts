import { TextSize } from '../../index.d';

const getLetterSpacing = (textSize: TextSize): number | string => {
  switch (textSize.kind) {
    case 'TextSizeXS':
      return 0;
    case 'TextSizeSM':
      return 0;
    case 'TextSizeMD':
      return 0;
    case 'TextSizeLG':
      return 0;
    case 'TextSizeXL':
      return 0;
    default:
      const exhaustiveCheck: never = textSize;
      return exhaustiveCheck;
  }
};

export { getLetterSpacing };
