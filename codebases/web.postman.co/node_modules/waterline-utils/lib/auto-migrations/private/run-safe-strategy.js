//  ███████╗ █████╗ ███████╗███████╗
//  ██╔════╝██╔══██╗██╔════╝██╔════╝
//  ███████╗███████║█████╗  █████╗
//  ╚════██║██╔══██║██╔══╝  ██╔══╝
//  ███████║██║  ██║██║     ███████╗
//  ╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝
//
// A no-op function. With `safe` no migrations should be run.

module.exports = function safeStrategy(orm, cb) {
  return setImmediate(function ensureAsync() {
    return cb();
  });
};
