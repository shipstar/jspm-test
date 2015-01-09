/* */ 
var util = require("util");
function Reporter(options) {
  this._reporterState = {
    obj: null,
    path: [],
    options: options || {},
    errors: []
  };
}
exports.Reporter = Reporter;
Reporter.prototype.isError = function isError(obj) {
  return obj instanceof ReporterError;
};
Reporter.prototype.enterKey = function enterKey(key) {
  return this._reporterState.path.push(key);
};
Reporter.prototype.leaveKey = function leaveKey(index, key, value) {
  var state = this._reporterState;
  state.path = state.path.slice(0, index - 1);
  if (state.obj !== null)
    state.obj[key] = value;
};
Reporter.prototype.enterObject = function enterObject() {
  var state = this._reporterState;
  var prev = state.obj;
  state.obj = {};
  return prev;
};
Reporter.prototype.leaveObject = function leaveObject(prev) {
  var state = this._reporterState;
  var now = state.obj;
  state.obj = prev;
  return now;
};
Reporter.prototype.error = function error(msg) {
  var err;
  var state = this._reporterState;
  var inherited = msg instanceof ReporterError;
  if (inherited) {
    err = msg;
  } else {
    err = new ReporterError(state.path.map(function(elem) {
      return '[' + JSON.stringify(elem) + ']';
    }).join(''), msg.message || msg, msg.stack);
  }
  if (!state.options.partial)
    throw err;
  if (!inherited)
    state.errors.push(err);
  return err;
};
Reporter.prototype.wrapResult = function wrapResult(result) {
  var state = this._reporterState;
  if (!state.options.partial)
    return result;
  return {
    result: this.isError(result) ? null : result,
    errors: state.errors
  };
};
function ReporterError(path, msg) {
  this.path = path;
  this.rethrow(msg);
}
;
util.inherits(ReporterError, Error);
ReporterError.prototype.rethrow = function rethrow(msg) {
  this.message = msg + ' at: ' + (this.path || '(shallow)');
  Error.captureStackTrace(this, ReporterError);
  return this;
};
