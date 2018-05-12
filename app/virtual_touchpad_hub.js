// Generated by CoffeeScript 1.9.3

/*
Virtual touchpad hub class
 */

(function() {
  var touchpad, virtual_touchpad_hub;

  touchpad = require('./virtual_touchpad');

  virtual_touchpad_hub = (function() {
    function virtual_touchpad_hub() {
      this.touchpads = [];
    }

    virtual_touchpad_hub.prototype.connectTouchpad = function(callback) {
      var touchpadId;
      touchpadId = this.touchpads.length;
      this.touchpads[touchpadId] = new touchpad();
      return this.touchpads[touchpadId].connect(function() {
        return callback(touchpadId);
      }, function(err) {
        return callback(-1);
      });
    };

    virtual_touchpad_hub.prototype.disconnectTouchpad = function(touchpadId, callback) {
      if (this.touchpads[touchpadId]) {
        return this.touchpads[touchpadId].disconnect((function(_this) {
          return function() {
            _this.touchpads[touchpadId] = void 0;
            return callback();
          };
        })(this));
      }
    };

    virtual_touchpad_hub.prototype.sendEvent = function(touchpadId, event) {
      if (this.touchpads[touchpadId]) {
        return this.touchpads[touchpadId].sendEvent(event);
      }
    };

    return virtual_touchpad_hub;

  })();

  module.exports = virtual_touchpad_hub;

}).call(this);
