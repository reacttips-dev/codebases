import MultiTourHandler from './MultiTourHandler';
export default (function () {
  var multiTourHandler = new MultiTourHandler();
  return {
    getInstance: function getInstance() {
      return multiTourHandler;
    }
  };
})();