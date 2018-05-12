// Generated by CoffeeScript 2.3.0
(function() {
  /*
  Created by roba91 on 15/08/2016
  Virtual keyboard hub class
  */
  var keyboard, virtual_keyboard_hub;

  keyboard = require('./virtual_keyboard');

  virtual_keyboard_hub = class virtual_keyboard_hub {
    constructor() {
      this.keyboards = [];
    }

    connectKeyboard(callback) {
      var boardId;
      boardId = this.keyboards.length;
      // Create and connect the keyboard
      this.keyboards[boardId] = new keyboard();
      return this.keyboards[boardId].connect(function() {
        return callback(boardId);
      }, function(err) {
        return callback(-1);
      });
    }

    disconnectKeyboard(boardId, callback) {
      if (this.keyboards[boardId]) {
        return this.keyboards[boardId].disconnect(() => {
          this.keyboards[boardId] = void 0;
          return callback();
        });
      }
    }

    sendEvent(boardId, event) {
      if (this.keyboards[boardId]) {
        return this.keyboards[boardId].sendEvent(event);
      }
    }

  };

  module.exports = virtual_keyboard_hub;

}).call(this);
