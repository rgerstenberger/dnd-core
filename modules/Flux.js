'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _flummox = require('flummox');

var _actionsDragDropActions = require('./actions/DragDropActions');

var _actionsDragDropActions2 = _interopRequireDefault(_actionsDragDropActions);

var _actionsRegistryActions = require('./actions/RegistryActions');

var _actionsRegistryActions2 = _interopRequireDefault(_actionsRegistryActions);

var _storesDragOperationStore = require('./stores/DragOperationStore');

var _storesDragOperationStore2 = _interopRequireDefault(_storesDragOperationStore);

var _storesDragOffsetStore = require('./stores/DragOffsetStore');

var _storesDragOffsetStore2 = _interopRequireDefault(_storesDragOffsetStore);

var _storesRefCountStore = require('./stores/RefCountStore');

var _storesRefCountStore2 = _interopRequireDefault(_storesRefCountStore);

var Flux = (function (_Flummox) {
  function Flux(manager) {
    _classCallCheck(this, Flux);

    _Flummox.call(this);

    this.dragDropActions = this.createActions('dragDropActions', _actionsDragDropActions2['default'], manager);
    this.dragDropActionIds = this.getActionIds('dragDropActions');

    this.registryActions = this.createActions('registryActions', _actionsRegistryActions2['default']);
    this.registryActionIds = this.getActionIds('registryActions');

    this.dragOperationStore = this.createStore('dragOperationStore', _storesDragOperationStore2['default'], this);

    this.dragOffsetStore = this.createStore('dragOffsetStore', _storesDragOffsetStore2['default'], this);

    this.refCountStore = this.createStore('refCountStore', _storesRefCountStore2['default'], this);
  }

  _inherits(Flux, _Flummox);

  return Flux;
})(_flummox.Flummox);

exports['default'] = Flux;
module.exports = exports['default'];