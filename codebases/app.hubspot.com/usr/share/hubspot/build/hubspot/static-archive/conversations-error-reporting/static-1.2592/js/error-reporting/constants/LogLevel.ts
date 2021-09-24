export var LogLevel;

(function (LogLevel) {
  LogLevel["error"] = "error";
  LogLevel["warning"] = "warning";
  LogLevel["debug"] = "debug";
  LogLevel["critical"] = "critical";
  LogLevel["info"] = "info";
})(LogLevel || (LogLevel = {}));