// Generated by CoffeeScript 1.9.3

/*
Created by roba91 on 15/08/2016
Virtual keyboard hub class
 */

(function() {
  var keyboard, virtual_keyboard_hub;

  keyboard = require('./virtual_keyboard');

  virtual_keyboard_hub = (function() {
    function virtual_keyboard_hub() {
      this.keyboards = [];
    }

    virtual_keyboard_hub.prototype.connectKeyboard = function(callback) {
      var boardId;
      boardId = this.keyboards.length;
      this.keyboards[boardId] = new keyboard();
      return this.keyboards[boardId].connect(function() {
        return callback(boardId);
      }, function(err) {
        return callback(-1);
      });
    };

    virtual_keyboard_hub.prototype.disconnectKeyboard = function(boardId, callback) {
      if (this.keyboards[boardId]) {
        return this.keyboards[boardId].disconnect((function(_this) {
          return function() {
            _this.keyboards[boardId] = void 0;
            return callback();
          };
        })(this));
      }
    };

    virtual_keyboard_hub.prototype.sendEvent = function(boardId, event) {
      if (this.keyboards[boardId]) {
        return this.keyboards[boardId].sendEvent(event);
      }
    };

    return virtual_keyboard_hub;

  })();

  module.exports = virtual_keyboard_hub;

}).call(this);
