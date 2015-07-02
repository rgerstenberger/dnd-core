'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _expectJs = require('expect.js');

var _expectJs2 = _interopRequireDefault(_expectJs);

var _types = require('./types');

var _types2 = _interopRequireDefault(_types);

var _sources = require('./sources');

var _targets = require('./targets');

var _ = require('..');

var _lodashLangIsString = require('lodash/lang/isString');

var _lodashLangIsString2 = _interopRequireDefault(_lodashLangIsString);

describe('DragDropManager', function () {
  var manager = undefined;
  var backend = undefined;
  var registry = undefined;

  beforeEach(function () {
    manager = new _.DragDropManager(_.createTestBackend);
    backend = manager.getBackend();
    registry = manager.getRegistry();
  });

  describe('handler registration', function () {
    it('registers and unregisters drag sources', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      _expectJs2['default'](registry.getSource(sourceId)).to.equal(source);

      registry.removeSource(sourceId);
      _expectJs2['default'](registry.getSource(sourceId)).to.equal(undefined);
      _expectJs2['default'](function () {
        return registry.removeSource(sourceId);
      }).to.throwError();
    });

    it('registers and unregisters drop targets', function () {
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget(_types2['default'].FOO, target);
      _expectJs2['default'](registry.getTarget(targetId)).to.equal(target);

      registry.removeTarget(targetId);
      _expectJs2['default'](registry.getTarget(targetId)).to.equal(undefined);
      _expectJs2['default'](function () {
        return registry.removeTarget(targetId);
      }).to.throwError();
    });

    it('registers and unregisters multi-type drop targets', function () {
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget([_types2['default'].FOO, _types2['default'].BAR], target);
      _expectJs2['default'](registry.getTarget(targetId)).to.equal(target);

      registry.removeTarget(targetId);
      _expectJs2['default'](registry.getTarget(targetId)).to.equal(undefined);
      _expectJs2['default'](function () {
        return registry.removeTarget(targetId);
      }).to.throwError();
    });

    it('knows the difference between sources and targets', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget(_types2['default'].FOO, target);

      _expectJs2['default'](function () {
        return registry.getSource(targetId);
      }).to.throwError();
      _expectJs2['default'](function () {
        return registry.getTarget(sourceId);
      }).to.throwError();
      _expectJs2['default'](function () {
        return registry.removeSource(targetId);
      }).to.throwError();
      _expectJs2['default'](function () {
        return registry.removeTarget(sourceId);
      }).to.throwError();
    });

    it('accepts symbol types', function () {
      var source = new _sources.NormalSource();
      var target = new _targets.NormalTarget();

      _expectJs2['default'](function () {
        return registry.addSource(Symbol(), source);
      }).to.not.throwError();
      _expectJs2['default'](function () {
        return registry.addTarget(Symbol(), target);
      }).to.not.throwError();
      _expectJs2['default'](function () {
        return registry.addTarget([Symbol(), Symbol()], target);
      }).to.not.throwError();
    });

    it('throws on invalid type', function () {
      var source = new _sources.NormalSource();
      var target = new _targets.NormalTarget();

      _expectJs2['default'](function () {
        return registry.addSource(null, source);
      }).to.throwError();
      _expectJs2['default'](function () {
        return registry.addSource(undefined, source);
      }).to.throwError();
      _expectJs2['default'](function () {
        return registry.addSource(23, source);
      }).to.throwError();
      _expectJs2['default'](function () {
        return registry.addSource(['yo'], source);
      }).to.throwError();
      _expectJs2['default'](function () {
        return registry.addTarget(null, target);
      }).to.throwError();
      _expectJs2['default'](function () {
        return registry.addTarget(undefined, target);
      }).to.throwError();
      _expectJs2['default'](function () {
        return registry.addTarget(23, target);
      }).to.throwError();
      _expectJs2['default'](function () {
        return registry.addTarget([23], target);
      }).to.throwError();
      _expectJs2['default'](function () {
        return registry.addTarget(['yo', null], target);
      }).to.throwError();
      _expectJs2['default'](function () {
        return registry.addTarget([['yo']], target);
      }).to.throwError();
    });

    it('calls setup() and teardown() on backend', function () {
      _expectJs2['default'](backend.didCallSetup).to.equal(undefined);
      _expectJs2['default'](backend.didCallTeardown).to.equal(undefined);

      var sourceId = registry.addSource(_types2['default'].FOO, new _sources.NormalSource());
      _expectJs2['default'](backend.didCallSetup).to.equal(true);
      _expectJs2['default'](backend.didCallTeardown).to.equal(undefined);
      backend.didCallSetup = undefined;
      backend.didCallTeardown = undefined;

      var targetId = registry.addTarget(_types2['default'].FOO, new _targets.NormalTarget());
      _expectJs2['default'](backend.didCallSetup).to.equal(undefined);
      _expectJs2['default'](backend.didCallTeardown).to.equal(undefined);
      backend.didCallSetup = undefined;
      backend.didCallTeardown = undefined;

      registry.removeSource(sourceId);
      _expectJs2['default'](backend.didCallSetup).to.equal(undefined);
      _expectJs2['default'](backend.didCallTeardown).to.equal(undefined);
      backend.didCallSetup = undefined;
      backend.didCallTeardown = undefined;

      registry.removeTarget(targetId);
      _expectJs2['default'](backend.didCallSetup).to.equal(undefined);
      _expectJs2['default'](backend.didCallTeardown).to.equal(true);
      backend.didCallSetup = undefined;
      backend.didCallTeardown = undefined;

      registry.addTarget(_types2['default'].BAR, new _targets.NormalTarget());
      _expectJs2['default'](backend.didCallSetup).to.equal(true);
      _expectJs2['default'](backend.didCallTeardown).to.equal(undefined);
    });

    it('returns string handles', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var targetA = new _targets.NormalTarget();
      var targetAId = registry.addTarget(_types2['default'].FOO, targetA);
      var targetB = new _targets.NormalTarget();
      var targetBId = registry.addTarget([_types2['default'].FOO, _types2['default'].BAR], targetB);

      _expectJs2['default'](_lodashLangIsString2['default'](sourceId)).to.equal(true);
      _expectJs2['default'](_lodashLangIsString2['default'](targetAId)).to.equal(true);
      _expectJs2['default'](_lodashLangIsString2['default'](targetBId)).to.equal(true);
    });

    it('accurately reports handler role', function () {
      var source = new _sources.NormalSource();
      var sourceId = registry.addSource(_types2['default'].FOO, source);
      var target = new _targets.NormalTarget();
      var targetId = registry.addTarget(_types2['default'].FOO, target);

      _expectJs2['default'](registry.isSourceId(sourceId)).to.equal(true);
      _expectJs2['default'](registry.isSourceId(targetId)).to.equal(false);
      _expectJs2['default'](function () {
        return registry.isSourceId('something else');
      }).to.throwError();
      _expectJs2['default'](function () {
        return registry.isSourceId(null);
      }).to.throwError();

      _expectJs2['default'](registry.isTargetId(sourceId)).to.equal(false);
      _expectJs2['default'](registry.isTargetId(targetId)).to.equal(true);
      _expectJs2['default'](function () {
        return registry.isTargetId('something else');
      }).to.throwError();
      _expectJs2['default'](function () {
        return registry.isTargetId(null);
      }).to.throwError();
    });
  });

  describe('drag source and target contract', function () {
    describe('beginDrag() and canDrag()', function () {
      it('ignores beginDrag() if canDrag() returns false', function () {
        var source = new _sources.NonDraggableSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);

        backend.simulateBeginDrag([sourceId]);
        _expectJs2['default'](source.didCallBeginDrag).to.equal(false);
      });

      it('throws if beginDrag() returns non-object', function () {
        var source = new _sources.BadItemSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);

        _expectJs2['default'](function () {
          return backend.simulateBeginDrag([sourceId]);
        }).to.throwError();
      });

      it('begins drag if canDrag() returns true', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);

        backend.simulateBeginDrag([sourceId]);
        _expectJs2['default'](source.didCallBeginDrag).to.equal(true);
      });

      it('throws in beginDrag() if it is called twice during one operation', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);

        backend.simulateBeginDrag([sourceId]);
        _expectJs2['default'](function () {
          return backend.simulateBeginDrag([sourceId]);
        }).to.throwError();
      });

      it('throws in beginDrag() if it is called with an invalid handles', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);
        var target = new _targets.NormalTarget();
        var targetId = registry.addTarget(_types2['default'].FOO, target);

        _expectJs2['default'](function () {
          return backend.simulateBeginDrag('yo');
        }).to.throwError();
        _expectJs2['default'](function () {
          return backend.simulateBeginDrag(null);
        }).to.throwError();
        _expectJs2['default'](function () {
          return backend.simulateBeginDrag(sourceId);
        }).to.throwError();
        _expectJs2['default'](function () {
          return backend.simulateBeginDrag([null]);
        }).to.throwError();
        _expectJs2['default'](function () {
          return backend.simulateBeginDrag(['yo']);
        }).to.throwError();
        _expectJs2['default'](function () {
          return backend.simulateBeginDrag([targetId]);
        }).to.throwError();
        _expectJs2['default'](function () {
          return backend.simulateBeginDrag([null, sourceId]);
        }).to.throwError();
        _expectJs2['default'](function () {
          return backend.simulateBeginDrag([targetId, sourceId]);
        }).to.throwError();

        registry.removeSource(sourceId);
        _expectJs2['default'](function () {
          return backend.simulateBeginDrag([sourceId]);
        }).to.throwError();
      });

      it('calls beginDrag() on the innermost handler with canDrag() returning true', function () {
        var sourceA = new _sources.NonDraggableSource();
        var sourceAId = registry.addSource(_types2['default'].FOO, sourceA);
        var sourceB = new _sources.NormalSource();
        var sourceBId = registry.addSource(_types2['default'].FOO, sourceB);
        var sourceC = new _sources.NormalSource();
        var sourceCId = registry.addSource(_types2['default'].FOO, sourceC);
        var sourceD = new _sources.NonDraggableSource();
        var sourceDId = registry.addSource(_types2['default'].FOO, sourceD);

        backend.simulateBeginDrag([sourceAId, sourceBId, sourceCId, sourceDId]);
        _expectJs2['default'](sourceA.didCallBeginDrag).to.equal(false);
        _expectJs2['default'](sourceB.didCallBeginDrag).to.equal(false);
        _expectJs2['default'](sourceC.didCallBeginDrag).to.equal(true);
        _expectJs2['default'](sourceD.didCallBeginDrag).to.equal(false);
      });

      it('lets beginDrag() be called again in a next operation', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);

        backend.simulateBeginDrag([sourceId]);
        backend.simulateEndDrag(sourceId);

        source.didCallBeginDrag = false;
        _expectJs2['default'](function () {
          return backend.simulateBeginDrag([sourceId]);
        }).to.not.throwError();
        _expectJs2['default'](source.didCallBeginDrag).to.equal(true);
      });
    });

    describe('drop(), canDrop() and endDrag()', function () {
      it('endDrag() sees drop() return value as drop result if dropped on a target', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);
        var target = new _targets.NormalTarget();
        var targetId = registry.addTarget(_types2['default'].FOO, target);

        backend.simulateBeginDrag([sourceId]);
        backend.simulateHover([targetId]);
        backend.simulateDrop();
        backend.simulateEndDrag();
        _expectJs2['default'](target.didCallDrop).to.equal(true);
        _expectJs2['default'](source.recordedDropResult).to.eql({ foo: 'bar' });
      });

      it('endDrag() sees {} as drop result by default if dropped on a target', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);
        var target = new _targets.TargetWithNoDropResult();
        var targetId = registry.addTarget(_types2['default'].FOO, target);

        backend.simulateBeginDrag([sourceId]);
        backend.simulateHover([targetId]);
        backend.simulateDrop();
        backend.simulateEndDrag();
        _expectJs2['default'](source.recordedDropResult).to.eql({});
      });

      it('endDrag() sees null as drop result if dropped outside a target', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);

        backend.simulateBeginDrag([sourceId]);
        backend.simulateEndDrag();
        _expectJs2['default'](source.recordedDropResult).to.equal(null);
      });

      it('calls endDrag even if source was unregistered', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);

        backend.simulateBeginDrag([sourceId]);
        registry.removeSource(sourceId);
        _expectJs2['default'](registry.getSource(sourceId)).to.equal(undefined);

        backend.simulateEndDrag();
        _expectJs2['default'](source.recordedDropResult).to.equal(null);
      });

      it('throws in endDrag() if it is called outside a drag operation', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);
        _expectJs2['default'](function () {
          return backend.simulateEndDrag(sourceId);
        }).to.throwError();
      });

      it('ignores drop() if no drop targets entered', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);

        backend.simulateBeginDrag([sourceId]);
        backend.simulateDrop();
        backend.simulateEndDrag();
        _expectJs2['default'](source.recordedDropResult).to.equal(null);
      });

      it('ignores drop() if drop targets entered and left', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);
        var targetA = new _targets.NormalTarget();
        var targetAId = registry.addTarget(_types2['default'].FOO, targetA);
        var targetB = new _targets.NormalTarget();
        var targetBId = registry.addTarget(_types2['default'].FOO, targetB);

        backend.simulateBeginDrag([sourceId]);
        backend.simulateHover([targetAId]);
        backend.simulateHover([targetAId, targetBId]);
        backend.simulateHover([targetAId]);
        backend.simulateHover([]);
        backend.simulateDrop();
        backend.simulateEndDrag();
        _expectJs2['default'](targetA.didCallDrop).to.equal(false);
        _expectJs2['default'](targetB.didCallDrop).to.equal(false);
        _expectJs2['default'](source.recordedDropResult).to.equal(null);
      });

      it('ignores drop() if canDrop() returns false', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);
        var target = new _targets.NonDroppableTarget();
        var targetId = registry.addTarget(_types2['default'].FOO, target);

        backend.simulateBeginDrag([sourceId]);
        backend.simulateHover([targetId]);
        backend.simulateDrop();
        _expectJs2['default'](target.didCallDrop).to.equal(false);
      });

      it('ignores drop() if target has a different type', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);
        var target = new _targets.NormalTarget();
        var targetId = registry.addTarget(_types2['default'].BAR, target);

        backend.simulateBeginDrag([sourceId]);
        backend.simulateHover([targetId]);
        backend.simulateDrop();
        _expectJs2['default'](target.didCallDrop).to.equal(false);
      });

      it('throws in drop() if it is called outside a drag operation', function () {
        _expectJs2['default'](function () {
          return backend.simulateDrop();
        }).to.throwError();
      });

      it('throws in drop() if it returns something that is neither undefined nor an object', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);
        var target = new _targets.BadResultTarget();
        var targetId = registry.addTarget(_types2['default'].FOO, target);

        backend.simulateBeginDrag([sourceId]);
        backend.simulateHover([targetId]);
        _expectJs2['default'](function () {
          return backend.simulateDrop();
        }).to.throwError();
      });

      it('throws in drop() if called twice', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);
        var target = new _targets.NormalTarget();
        var targetId = registry.addTarget(_types2['default'].FOO, target);

        backend.simulateBeginDrag([sourceId]);
        backend.simulateHover([targetId]);
        backend.simulateDrop();
        _expectJs2['default'](function () {
          return backend.simulateDrop();
        }).to.throwError();
      });

      describe('nested drop targets', function () {
        it('uses child result if parents have no drop result', function () {
          var source = new _sources.NormalSource();
          var sourceId = registry.addSource(_types2['default'].FOO, source);
          var targetA = new _targets.TargetWithNoDropResult();
          var targetAId = registry.addTarget(_types2['default'].FOO, targetA);
          var targetB = new _targets.NormalTarget({ number: 16 });
          var targetBId = registry.addTarget(_types2['default'].FOO, targetB);
          var targetC = new _targets.NormalTarget({ number: 42 });
          var targetCId = registry.addTarget(_types2['default'].FOO, targetC);

          backend.simulateBeginDrag([sourceId]);
          backend.simulateHover([targetAId, targetBId, targetCId]);
          backend.simulateDrop();
          backend.simulateEndDrag();
          _expectJs2['default'](targetA.didCallDrop).to.equal(true);
          _expectJs2['default'](targetB.didCallDrop).to.equal(true);
          _expectJs2['default'](targetC.didCallDrop).to.equal(true);
          _expectJs2['default'](source.recordedDropResult).to.eql({ number: 16 });
        });

        it('excludes targets of different type when dispatching drop', function () {
          var source = new _sources.NormalSource();
          var sourceId = registry.addSource(_types2['default'].FOO, source);
          var targetA = new _targets.TargetWithNoDropResult();
          var targetAId = registry.addTarget(_types2['default'].FOO, targetA);
          var targetB = new _targets.NormalTarget({ number: 16 });
          var targetBId = registry.addTarget(_types2['default'].BAR, targetB);
          var targetC = new _targets.NormalTarget({ number: 42 });
          var targetCId = registry.addTarget(_types2['default'].FOO, targetC);

          backend.simulateBeginDrag([sourceId]);
          backend.simulateHover([targetAId, targetBId, targetCId]);
          backend.simulateDrop();
          backend.simulateEndDrag();
          _expectJs2['default'](targetA.didCallDrop).to.equal(true);
          _expectJs2['default'](targetB.didCallDrop).to.equal(false);
          _expectJs2['default'](targetC.didCallDrop).to.equal(true);
          _expectJs2['default'](source.recordedDropResult).to.eql({ number: 42 });
        });

        it('excludes non-droppable targets when dispatching drop', function () {
          var source = new _sources.NormalSource();
          var sourceId = registry.addSource(_types2['default'].FOO, source);
          var targetA = new _targets.TargetWithNoDropResult();
          var targetAId = registry.addTarget(_types2['default'].FOO, targetA);
          var targetB = new _targets.TargetWithNoDropResult();
          var targetBId = registry.addTarget(_types2['default'].FOO, targetB);
          var targetC = new _targets.NonDroppableTarget({ number: 16 });
          var targetCId = registry.addTarget(_types2['default'].BAR, targetC);

          backend.simulateBeginDrag([sourceId]);
          backend.simulateHover([targetAId, targetBId, targetCId]);
          backend.simulateDrop();
          backend.simulateEndDrag();
          _expectJs2['default'](targetA.didCallDrop).to.equal(true);
          _expectJs2['default'](targetB.didCallDrop).to.equal(true);
          _expectJs2['default'](targetC.didCallDrop).to.equal(false);
          _expectJs2['default'](source.recordedDropResult).to.eql({});
        });

        it('lets parent drop targets transform child results', function () {
          var source = new _sources.NormalSource();
          var sourceId = registry.addSource(_types2['default'].FOO, source);
          var targetA = new _targets.TargetWithNoDropResult();
          var targetAId = registry.addTarget(_types2['default'].FOO, targetA);
          var targetB = new _targets.TransformResultTarget(function (dropResult) {
            return { number: dropResult.number * 2 };
          });
          var targetBId = registry.addTarget(_types2['default'].FOO, targetB);
          var targetC = new _targets.NonDroppableTarget();
          var targetCId = registry.addTarget(_types2['default'].FOO, targetC);
          var targetD = new _targets.TransformResultTarget(function (dropResult) {
            return { number: dropResult.number + 1 };
          });
          var targetDId = registry.addTarget(_types2['default'].FOO, targetD);
          var targetE = new _targets.NormalTarget({ number: 42 });
          var targetEId = registry.addTarget(_types2['default'].FOO, targetE);
          var targetF = new _targets.TransformResultTarget(function (dropResult) {
            return { number: dropResult.number / 2 };
          });
          var targetFId = registry.addTarget(_types2['default'].BAR, targetF);
          var targetG = new _targets.NormalTarget({ number: 100 });
          var targetGId = registry.addTarget(_types2['default'].BAR, targetG);

          backend.simulateBeginDrag([sourceId]);
          backend.simulateHover([targetAId, targetBId, targetCId, targetDId, targetEId, targetFId, targetGId]);
          backend.simulateDrop();
          backend.simulateEndDrag();
          _expectJs2['default'](targetA.didCallDrop).to.equal(true);
          _expectJs2['default'](targetB.didCallDrop).to.equal(true);
          _expectJs2['default'](targetC.didCallDrop).to.equal(false);
          _expectJs2['default'](targetD.didCallDrop).to.equal(true);
          _expectJs2['default'](targetE.didCallDrop).to.equal(true);
          _expectJs2['default'](targetF.didCallDrop).to.equal(false);
          _expectJs2['default'](targetG.didCallDrop).to.equal(false);
          _expectJs2['default'](source.recordedDropResult).to.eql({ number: (42 + 1) * 2 });
        });

        it('always chooses parent drop result', function () {
          var source = new _sources.NormalSource();
          var sourceId = registry.addSource(_types2['default'].FOO, source);
          var targetA = new _targets.NormalTarget({ number: 12345 });
          var targetAId = registry.addTarget(_types2['default'].FOO, targetA);
          var targetB = new _targets.TransformResultTarget(function (dropResult) {
            return { number: dropResult.number * 2 };
          });
          var targetBId = registry.addTarget(_types2['default'].FOO, targetB);
          var targetC = new _targets.NonDroppableTarget();
          var targetCId = registry.addTarget(_types2['default'].FOO, targetC);
          var targetD = new _targets.TransformResultTarget(function (dropResult) {
            return { number: dropResult.number + 1 };
          });
          var targetDId = registry.addTarget(_types2['default'].FOO, targetD);
          var targetE = new _targets.NormalTarget({ number: 42 });
          var targetEId = registry.addTarget(_types2['default'].FOO, targetE);
          var targetF = new _targets.TransformResultTarget(function (dropResult) {
            return { number: dropResult.number / 2 };
          });
          var targetFId = registry.addTarget(_types2['default'].BAR, targetF);
          var targetG = new _targets.NormalTarget({ number: 100 });
          var targetGId = registry.addTarget(_types2['default'].BAR, targetG);

          backend.simulateBeginDrag([sourceId]);
          backend.simulateHover([targetAId, targetBId, targetCId, targetDId, targetEId, targetFId, targetGId]);
          backend.simulateDrop();
          backend.simulateEndDrag();
          _expectJs2['default'](targetA.didCallDrop).to.equal(true);
          _expectJs2['default'](targetB.didCallDrop).to.equal(true);
          _expectJs2['default'](targetC.didCallDrop).to.equal(false);
          _expectJs2['default'](targetD.didCallDrop).to.equal(true);
          _expectJs2['default'](targetE.didCallDrop).to.equal(true);
          _expectJs2['default'](targetF.didCallDrop).to.equal(false);
          _expectJs2['default'](targetG.didCallDrop).to.equal(false);
          _expectJs2['default'](source.recordedDropResult).to.eql({ number: 12345 });
        });

        it('excludes removed targets when dispatching drop', function () {
          var source = new _sources.NormalSource();
          var sourceId = registry.addSource(_types2['default'].FOO, source);
          var targetA = new _targets.NormalTarget();
          var targetAId = registry.addTarget(_types2['default'].FOO, targetA);
          var targetB = new _targets.NormalTarget();
          var targetBId = registry.addTarget(_types2['default'].FOO, targetB);
          var targetC = new _targets.NormalTarget();
          var targetCId = registry.addTarget(_types2['default'].FOO, targetC);

          backend.simulateBeginDrag([sourceId]);
          backend.simulateHover([targetAId, targetBId, targetCId]);
          registry.removeTarget(targetBId);
          backend.simulateDrop();
          backend.simulateEndDrag();
          _expectJs2['default'](targetA.didCallDrop).to.equal(true);
          _expectJs2['default'](targetB.didCallDrop).to.equal(false);
          _expectJs2['default'](targetC.didCallDrop).to.equal(true);
        });
      });
    });

    describe('hover()', function () {
      it('throws on hover after drop', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);
        var target = new _targets.NormalTarget();
        var targetId = registry.addTarget(_types2['default'].FOO, target);

        _expectJs2['default'](function () {
          return backend.simulateHover([targetId]);
        }).to.throwError();
        backend.simulateBeginDrag([sourceId]);
        backend.simulateHover([targetId]);

        backend.simulateDrop();
        _expectJs2['default'](function () {
          return backend.simulateHover([targetId]);
        }).to.throwError();
      });

      it('throws on hover outside dragging operation', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);
        var target = new _targets.NormalTarget();
        var targetId = registry.addTarget(_types2['default'].FOO, target);

        _expectJs2['default'](function () {
          return backend.simulateHover([targetId]);
        }).to.throwError();
        backend.simulateBeginDrag([sourceId]);
        backend.simulateHover([targetId]);

        backend.simulateEndDrag();
        _expectJs2['default'](function () {
          return backend.simulateHover([targetId]);
        }).to.throwError();
      });

      it('excludes targets of different type when dispatching hover', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);
        var targetA = new _targets.NormalTarget();
        var targetAId = registry.addTarget(_types2['default'].FOO, targetA);
        var targetB = new _targets.NormalTarget();
        var targetBId = registry.addTarget(_types2['default'].BAR, targetB);
        var targetC = new _targets.NormalTarget();
        var targetCId = registry.addTarget(_types2['default'].FOO, targetC);
        var targetD = new _targets.NormalTarget();
        var targetDId = registry.addTarget([_types2['default'].BAZ, _types2['default'].FOO], targetD);

        backend.simulateBeginDrag([sourceId]);
        backend.simulateHover([targetAId, targetBId, targetCId, targetDId]);
        _expectJs2['default'](targetA.didCallHover).to.equal(true);
        _expectJs2['default'](targetB.didCallHover).to.equal(false);
        _expectJs2['default'](targetC.didCallHover).to.equal(true);
        _expectJs2['default'](targetD.didCallHover).to.equal(true);
      });

      it('includes non-droppable targets when dispatching hover', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);
        var targetA = new _targets.TargetWithNoDropResult();
        var targetAId = registry.addTarget(_types2['default'].FOO, targetA);
        var targetB = new _targets.TargetWithNoDropResult();
        var targetBId = registry.addTarget(_types2['default'].FOO, targetB);

        backend.simulateBeginDrag([sourceId]);
        backend.simulateHover([targetAId, targetBId]);
        _expectJs2['default'](targetA.didCallHover).to.equal(true);
        _expectJs2['default'](targetB.didCallHover).to.equal(true);
      });

      it('throws in hover() if it contains the same target twice', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);
        var targetA = new _targets.NormalTarget();
        var targetAId = registry.addTarget(_types2['default'].BAR, targetA);
        var targetB = new _targets.NormalTarget();
        var targetBId = registry.addTarget(_types2['default'].BAR, targetB);

        backend.simulateBeginDrag([sourceId]);
        _expectJs2['default'](function () {
          return backend.simulateHover([targetAId, targetBId, targetAId]);
        }).to.throwError();
      });

      it('throws in hover() if it is called with a non-array', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);
        var target = new _targets.NormalTarget();
        var targetId = registry.addTarget(_types2['default'].BAR, target);

        backend.simulateBeginDrag([sourceId]);
        _expectJs2['default'](function () {
          return backend.simulateHover(null);
        }).to.throwError();
        _expectJs2['default'](function () {
          return backend.simulateHover('yo');
        }).to.throwError();
        _expectJs2['default'](function () {
          return backend.simulateHover(targetId);
        }).to.throwError();
      });

      it('throws in hover() if it contains an invalid drop target', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);
        var target = new _targets.NormalTarget();
        var targetId = registry.addTarget(_types2['default'].BAR, target);

        backend.simulateBeginDrag([sourceId]);
        _expectJs2['default'](function () {
          return backend.simulateHover([targetId, null]);
        }).to.throwError();
        _expectJs2['default'](function () {
          return backend.simulateHover([targetId, 'yo']);
        }).to.throwError();
        _expectJs2['default'](function () {
          return backend.simulateHover([targetId, sourceId]);
        }).to.throwError();
      });

      it('throws in hover() if it contains a removed drop target', function () {
        var source = new _sources.NormalSource();
        var sourceId = registry.addSource(_types2['default'].FOO, source);
        var targetA = new _targets.NormalTarget();
        var targetAId = registry.addTarget(_types2['default'].BAR, targetA);
        var targetB = new _targets.NormalTarget();
        var targetBId = registry.addTarget(_types2['default'].FOO, targetB);

        backend.simulateBeginDrag([sourceId]);
        _expectJs2['default'](function () {
          return backend.simulateHover([targetAId, targetBId]);
        }).to.not.throwError();

        backend.simulateHover([targetAId, targetBId]);
        registry.removeTarget(targetAId);
        _expectJs2['default'](function () {
          return backend.simulateHover([targetBId, targetAId]);
        }).to.throwError();
        _expectJs2['default'](function () {
          return backend.simulateHover([targetAId, targetBId]);
        }).to.throwError();
        _expectJs2['default'](function () {
          return backend.simulateHover([targetBId]);
        }).to.not.throwError();

        backend.simulateHover([targetBId]);
        registry.removeTarget(targetBId);
        _expectJs2['default'](function () {
          return backend.simulateHover([targetBId, targetAId]);
        }).to.throwError();
        _expectJs2['default'](function () {
          return backend.simulateHover([targetBId]);
        }).to.throwError();
        _expectJs2['default'](function () {
          return backend.simulateHover([targetAId]);
        }).to.throwError();

        targetAId = registry.addTarget(_types2['default'].FOO, targetA);
        _expectJs2['default'](function () {
          return backend.simulateHover([targetAId]);
        }).to.not.throwError();

        backend.simulateHover([targetAId]);
        targetBId = registry.addTarget(_types2['default'].BAR, targetB);
        _expectJs2['default'](function () {
          return backend.simulateHover([targetAId, targetBId]);
        }).to.not.throwError();
      });
    });
  });
});