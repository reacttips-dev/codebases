module.exports = obj => !Array.isArray ? Object.prototype.toString.call(obj) === '[object Array]' : Array.isArray(obj)



// WEBPACK FOOTER //
// ./src/helpers/is_array.js