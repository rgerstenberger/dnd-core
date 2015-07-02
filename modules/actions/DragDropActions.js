'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _flummox = require('flummox');

var _utilsMatchesType = require('../utils/matchesType');

var _utilsMatchesType2 = _interopRequireDefault(_utilsMatchesType);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _lodashLangIsArray = require('lodash/lang/isArray');

var _lodashLangIsArray2 = _interopRequireDefault(_lodashLangIsArray);

var _lodashLangIsObject = require('lodash/lang/isObject');

var _lodashLangIsObject2 = _interopRequireDefault(_lodashLangIsObject);

var DragDropActions = (function (_Actions) {
  function DragDropActions(manager) {
    _classCallCheck(this, DragDropActions);

    _Actions.call(this);
    this.manager = manager;
  }

  _inherits(DragDropActions, _Actions);

  DragDropActions.prototype.beginDrag = function beginDrag(sourceIds) {
    var _ref = arguments[1] === undefined ? {} : arguments[1];

    var _ref$publishSource = _ref.publishSource;
    var publishSource = _ref$publishSource === undefined ? true : _ref$publishSource;
    var _ref$clientOffset = _ref.clientOffset;
    var clientOffset = _ref$clientOffset === undefined ? null : _ref$clientOffset;
    var getSourceClientOffset = _ref.getSourceClientOffset;

    _invariant2['default'](_lodashLangIsArray2['default'](sourceIds), 'Expected sourceIds to be an array.');

    var monitor = this.manager.getMonitor();
    var registry = this.manager.getRegistry();
    _invariant2['default'](!monitor.isDragging(), 'Cannot call beginDrag while dragging.');

    for (var i = 0; i < sourceIds.length; i++) {
      _invariant2['default'](registry.getSource(sourceIds[i]), 'Expected sourceIds to be registered.');
    }

    var sourceId = null;
    for (var i = sourceIds.length - 1; i >= 0; i--) {
      if (monitor.canDragSource(sourceIds[i])) {
        sourceId = sourceIds[i];
        break;
      }
    }
    if (sourceId === null) {
      return;
    }

    var sourceClientOffset = null;
    if (clientOffset) {
      _invariant2['default'](typeof getSourceClientOffset === 'function', 'When clientOffset is provided, getSourceClientOffset must be a function.');
      sourceClientOffset = getSourceClientOffset(sourceId);
    }

    var source = registry.getSource(sourceId);
    var item = source.beginDrag(monitor, sourceId);
    _invariant2['default'](_lodashLangIsObject2['default'](item), 'Item must be an object.');

    registry.pinSource(sourceId);

    var itemType = registry.getSourceType(sourceId);
    return {
      itemType: itemType,
      item: item,
      sourceId: sourceId,
      clientOffset: clientOffset,
      sourceClientOffset: sourceClientOffset,
      isSourcePublic: publishSource
    };
  };

  DragDropActions.prototype.publishDragSource = function publishDragSource() {
    var monitor = this.manager.getMonitor();
    if (!monitor.isDragging()) {
      return;
    }

    return {};
  };

  DragDropActions.prototype.hover = function hover(targetIds) {
    var _ref2 = arguments[1] === undefined ? {} : arguments[1];

    var _ref2$clientOffset = _ref2.clientOffset;
    var clientOffset = _ref2$clientOffset === undefined ? null : _ref2$clientOffset;

    _invariant2['default'](_lodashLangIsArray2['default'](targetIds), 'Expected targetIds to be an array.');
    targetIds = targetIds.slice(0);

    var monitor = this.manager.getMonitor();
    var registry = this.manager.getRegistry();
    _invariant2['default'](monitor.isDragging(), 'Cannot call hover while not dragging.');
    _invariant2['default'](!monitor.didDrop(), 'Cannot call hover after drop.');

    var draggedItemType = monitor.getItemType();
    for (var i = 0; i < targetIds.length; i++) {
      var targetId = targetIds[i];
      _invariant2['default'](targetIds.lastIndexOf(targetId) === i, 'Expected targetIds to be unique in the passed array.');

      var target = registry.getTarget(targetId);
      _invariant2['default'](target, 'Expected targetIds to be registered.');

      var targetType = registry.getTargetType(targetId);
      if (_utilsMatchesType2['default'](targetType, draggedItemType)) {
        target.hover(monitor, targetId);
      }
    }

    return { targetIds: targetIds, clientOffset: clientOffset };
  };

  DragDropActions.prototype.drop = function drop() {
    var _this = this;

    var monitor = this.manager.getMonitor();
    var registry = this.manager.getRegistry();
    _invariant2['default'](monitor.isDragging(), 'Cannot call drop while not dragging.');
    _invariant2['default'](!monitor.didDrop(), 'Cannot call drop twice during one drag operation.');

    var _getActionIds = this.getActionIds();

    var dropActionId = _getActionIds.drop;

    var targetIds = monitor.getTargetIds().filter(monitor.canDropOnTarget, monitor);

    targetIds.reverse();
    targetIds.forEach(function (targetId, index) {
      var target = registry.getTarget(targetId);

      if (target) {
        var dropResult = target.drop(monitor, targetId);
        _invariant2['default'](typeof dropResult === 'undefined' || _lodashLangIsObject2['default'](dropResult), 'Drop result must either be an object or undefined.');
        if (typeof dropResult === 'undefined') {
          dropResult = index === 0 ? {} : monitor.getDropResult();
        }

        _this.dispatch(dropActionId, { dropResult: dropResult });
      }
    });
  };

  DragDropActions.prototype.endDrag = function endDrag() {
    var monitor = this.manager.getMonitor();
    var registry = this.manager.getRegistry();
    _invariant2['default'](monitor.isDragging(), 'Cannot call endDrag while not dragging.');

    var sourceId = monitor.getSourceId();
    var source = registry.getSource(sourceId, true);
    source.endDrag(monitor, sourceId);

    registry.unpinSource();

    return {};
  };

  return DragDropActions;
})(_flummox.Actions);

exports['default'] = DragDropActions;
module.exports = exports['default'];