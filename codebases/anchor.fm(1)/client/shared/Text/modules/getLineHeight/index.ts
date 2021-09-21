import { TextSize } from '../../index.d';

const getLineHeight = (textSize: TextSize): number => {
  switch (textSize.kind) {
    case 'TextSizeXS':
      return 14;
    case 'TextSizeSM':
      return 16;
    case 'TextSizeMD':
      return 18;
    case 'TextSizeLG':
      return 20;
    case 'TextSizeXL':
      return 22;
    default:
      const exhaustiveCheck: never = textSize;
      return exhaustiveCheck;
  }
};

export { getLineHeight };
