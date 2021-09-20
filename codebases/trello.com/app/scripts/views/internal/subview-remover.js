// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class SubviewRemover {
  constructor() {
    this.viewsToBeRemoved = [];
    this.scheduled = null;
  }

  enqueue(subviews) {
    for (const view of Array.from(subviews)) {
      view.$el.detach();
      this.viewsToBeRemoved.push(view);
    }
    if (this.scheduled === null) {
      return (this.scheduled = setInterval(this.processQueue.bind(this), 10));
    }
  }

  processQueue() {
    const startTime = Date.now();
    while (Date.now() - startTime < 10 && this.viewsToBeRemoved.length > 0) {
      const view = this.viewsToBeRemoved.shift();
      view.remove();
    }
    if (this.viewsToBeRemoved.length === 0) {
      clearInterval(this.scheduled);
      return (this.scheduled = null);
    }
  }
}

module.exports = new SubviewRemover();
