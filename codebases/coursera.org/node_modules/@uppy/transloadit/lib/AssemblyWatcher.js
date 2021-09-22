function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var Emitter = require('component-emitter');
/**
 * Track completion of multiple assemblies.
 *
 * Emits 'assembly-complete' when an assembly completes.
 * Emits 'assembly-error' when an assembly fails.
 * Exposes a `.promise` property that resolves when all assemblies have
 * completed (or failed).
 */


var TransloaditAssemblyWatcher = /*#__PURE__*/function (_Emitter) {
  _inheritsLoose(TransloaditAssemblyWatcher, _Emitter);

  function TransloaditAssemblyWatcher(uppy, assemblyIDs) {
    var _this;

    _this = _Emitter.call(this) || this;
    _this._uppy = uppy;
    _this._assemblyIDs = assemblyIDs;
    _this._remaining = assemblyIDs.length;
    _this.promise = new Promise(function (resolve, reject) {
      _this._resolve = resolve;
      _this._reject = reject;
    });
    _this._onAssemblyComplete = _this._onAssemblyComplete.bind(_assertThisInitialized(_this));
    _this._onAssemblyCancel = _this._onAssemblyCancel.bind(_assertThisInitialized(_this));
    _this._onAssemblyError = _this._onAssemblyError.bind(_assertThisInitialized(_this));
    _this._onImportError = _this._onImportError.bind(_assertThisInitialized(_this));

    _this._addListeners();

    return _this;
  }
  /**
   * Are we watching this assembly ID?
   */


  var _proto = TransloaditAssemblyWatcher.prototype;

  _proto._watching = function _watching(id) {
    return this._assemblyIDs.indexOf(id) !== -1;
  };

  _proto._onAssemblyComplete = function _onAssemblyComplete(assembly) {
    if (!this._watching(assembly.assembly_id)) {
      return;
    }

    this._uppy.log("[Transloadit] AssemblyWatcher: Got Assembly finish " + assembly.assembly_id);

    this.emit('assembly-complete', assembly.assembly_id);

    this._checkAllComplete();
  };

  _proto._onAssemblyCancel = function _onAssemblyCancel(assembly) {
    if (!this._watching(assembly.assembly_id)) {
      return;
    }

    this._checkAllComplete();
  };

  _proto._onAssemblyError = function _onAssemblyError(assembly, error) {
    if (!this._watching(assembly.assembly_id)) {
      return;
    }

    this._uppy.log("[Transloadit] AssemblyWatcher: Got Assembly error " + assembly.assembly_id);

    this._uppy.log(error);

    this.emit('assembly-error', assembly.assembly_id, error);

    this._checkAllComplete();
  };

  _proto._onImportError = function _onImportError(assembly, fileID, error) {
    if (!this._watching(assembly.assembly_id)) {
      return;
    } // Not sure if we should be doing something when it's just one file failing.
    // ATM, the only options are 1) ignoring or 2) failing the entire upload.
    // I think failing the upload is better than silently ignoring.
    // In the future we should maybe have a way to resolve uploads with some failures,
    // like returning an object with `{ successful, failed }` uploads.


    this._onAssemblyError(assembly, error);
  };

  _proto._checkAllComplete = function _checkAllComplete() {
    this._remaining -= 1;

    if (this._remaining === 0) {
      // We're done, these listeners can be removed
      this._removeListeners();

      this._resolve();
    }
  };

  _proto._removeListeners = function _removeListeners() {
    this._uppy.off('transloadit:complete', this._onAssemblyComplete);

    this._uppy.off('transloadit:assembly-cancel', this._onAssemblyCancel);

    this._uppy.off('transloadit:assembly-error', this._onAssemblyError);

    this._uppy.off('transloadit:import-error', this._onImportError);
  };

  _proto._addListeners = function _addListeners() {
    this._uppy.on('transloadit:complete', this._onAssemblyComplete);

    this._uppy.on('transloadit:assembly-cancel', this._onAssemblyCancel);

    this._uppy.on('transloadit:assembly-error', this._onAssemblyError);

    this._uppy.on('transloadit:import-error', this._onImportError);
  };

  return TransloaditAssemblyWatcher;
}(Emitter);

module.exports = TransloaditAssemblyWatcher;