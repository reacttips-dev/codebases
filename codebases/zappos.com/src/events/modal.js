/**
 * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/ModalInteraction.proto
 *
 * @param {string} modal
 * @param {string} type
 * @param {string} method
 */
export const evModalInteraction = ({ modal, type, method, productIdentifiers = {} }) => ({
  modalInteraction: {
    modal,
    type,
    method,
    productIdentifiers
  }
});
