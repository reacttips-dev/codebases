import { toBool } from 'helpers/DataFormatUtils';
import { LOW_STOCK_LABEL_LIMIT } from 'constants/appConstants';

interface GetCardFlagInput {
  isSponsored: boolean;
  isCouture: boolean;
  storeName: string;
  styleId: string;
  isNew: string;
  hasStyleRoomFlag: boolean;
}

export const getCardFlag = (args: GetCardFlagInput) => {
  const { isSponsored, isCouture, storeName, styleId, isNew, hasStyleRoomFlag } = args;

  const isStyleRoom = !isSponsored && hasStyleRoomFlag && isCouture && !storeName;
  const isTrustedRetailer = !isStyleRoom && storeName && !!styleId;
  const isNewProduct = !isTrustedRetailer && toBool(isNew);

  switch (true) {
    case isSponsored:
      return 'sponsored';
    case isStyleRoom:
      return 'style room';
    case isTrustedRetailer:
      return 'trusted retailer';
    case isNewProduct:
      return 'new';
    default:
      return null;
  }
};

interface GetLowStockLabelStatusInput extends GetCardFlagInput {
  onHand: number;
}

export const getLowStockLabelStatus = (args: GetLowStockLabelStatusInput) => getCardFlag({ ...args }) !== 'trusted retailer' && args.onHand < LOW_STOCK_LABEL_LIMIT;
