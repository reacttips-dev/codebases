export default class TransactionHandler {
  constructor(handler) {
    this.handler = handler;
    if (this.handler.editable) {
      this.initialize();
    }
  }

  /**
   * Initialize transaction handler
   *
   */
  initialize = () => {
    this.redos = [];
    this.undos = [];
    this.state = [];
    this.active = false;
  };

  /**
   * Save transaction
   *
   * @param {TransactionType} type
   * @param {*} [canvasJSON]
   * @param {boolean} [isWorkarea=true]
   */
  save = (type, canvasJSON, _isWorkarea = true) => {
    if (!this.handler.keyEvent.transaction) {
      return;
    }
    try {
      if (this.state) {
        const json = JSON.stringify(this.state);
        this.redos = [];
        this.undos.push({
          type,
          json,
        });
      }
      const { objects } =
        canvasJSON ||
        this.handler.canvas.toJSON(this.handler.propertiesToInclude);
      this.state = objects.filter((obj) => {
        if (obj.id === "workarea") {
          return false;
        } else if (obj.id === "grid") {
          return false;
        } else if (obj.superType === "port") {
          return false;
        }
        return true;
      });
    } catch (error) {
      console.error(error);
    }
  };
}
