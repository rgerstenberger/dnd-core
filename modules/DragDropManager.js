'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Flux = require('./Flux');

var _Flux2 = _interopRequireDefault(_Flux);

var _DragDropMonitor = require('./DragDropMonitor');

var _DragDropMonitor2 = _interopRequireDefault(_DragDropMonitor);

var _utilsHandlerRegistry = require('./utils/HandlerRegistry');

var _utilsHandlerRegistry2 = _interopRequireDefault(_utilsHandlerRegistry);

var DragDropManager = (function () {
  function DragDropManager(createBackend) {
    _classCallCheck(this, DragDropManager);

    var flux = new _Flux2['default'](this);

    this.flux = flux;
    this.registry = new _utilsHandlerRegistry2['default'](flux.registryActions);
    this.monitor = new _DragDropMonitor2['default'](flux, this.registry);
    this.backend = createBackend(this);

    flux.refCountStore.addListener('change', this.handleRefCountChange, this);
  }

  DragDropManager.prototype.handleRefCountChange = function handleRefCountChange() {
    var shouldSetUp = this.flux.refCountStore.hasRefs();
    if (shouldSetUp && !this.isSetUp) {
      this.backend.setup();
      this.isSetUp = true;
    } else if (!shouldSetUp && this.isSetUp) {
      this.backend.teardown();
      this.isSetUp = false;
    }
  };

  DragDropManager.prototype.getMonitor = function getMonitor() {
    return this.monitor;
  };

  DragDropManager.prototype.getBackend = function getBackend() {
    return this.backend;
  };

  DragDropManager.prototype.getRegistry = function getRegistry() {
    return this.registry;
  };

  DragDropManager.prototype.getActions = function getActions() {
    return this.flux.dragDropActions;
  };

  return DragDropManager;
})();

exports['default'] = DragDropManager;
module.exports = exports['default'];