/**
 * This enum contains all the events that we might want to
 * send up to the renderer context as well as those to which
 * we want the web app to subscribe.
 */
export const DESKTOP_EVENTS = Object.freeze({
  TO_DESKTOP: {
    // the following messages are sent from web to desktop
    SPI_LOG_MESSAGE: 'spi-log-message',
    SPI_GET_SETTINGS: 'spi-get-settings',
  },
  TO_WEB: {
    // the following are sent from desktop to web
    SPI_OPEN_BOARDS_MENU: 'spi-open-boards-menu',
    SPI_CLOSE_BOARDS_MENU: 'spi-close-boards-menu',
    SPI_SEND_SETTINGS: 'spi-send-settings',
  },
});
