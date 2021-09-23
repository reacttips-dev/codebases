'use es6';

var HubHttpBaseClient = {
  export: function _export() {
    throw new Error('Please override the `export` function with your own implementation.');
  }
};
export default HubHttpBaseClient;