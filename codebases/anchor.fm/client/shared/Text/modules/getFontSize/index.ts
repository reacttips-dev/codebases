import { TextSize } from '../../index.d';

const getFontSize = (textSize: TextSize): number => {
  switch (textSize.kind) {
    case 'TextSizeXS':
      return 10;
    case 'TextSizeSM':
      return 12;
    case 'TextSizeMD':
      return 14;
    case 'TextSizeLG':
      return 16;
    case 'TextSizeXL':
      return 18;
    default:
      const exhaustiveCheck: never = textSize;
      return exhaustiveCheck;
  }
};

export { getFontSize };
