import { getMandoPtCache, setMandoPtCache } from './retrieveCachedResponse';

/**
 * Invalidates the cache for any board that has the clicked
 * product as one of its joinable products.
 */
export const invalidateBoardsCache = (
  clickedProductUrl: string,
  userId: string,
) => {
  try {
    const cache = getMandoPtCache(userId);
    const cachedBoardKeys = Object.keys(cache.boards);

    cachedBoardKeys.forEach((boardKey) => {
      const board = cache.boards[boardKey];
      const hasClickedProduct = board.joinableProducts.some(
        ({ productUrl }) => productUrl === clickedProductUrl,
      );
      if (hasClickedProduct) board.invalidated = true;
    });

    setMandoPtCache(userId, cache);
  } catch {
    // TODO: Emit something
  }
};
