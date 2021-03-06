// Generated by CoffeeScript 1.9.3

/*
Created by MIROOF on 04/03/2015
Virtual gamepad hub class
 */

(function() {
  var config, gamepad, virtual_gamepad_hub_extended, winston;

  gamepad = require('./virtual_gamepad_extended');

  config = require('../config.json');

  winston = require('winston');

  winston.level = config.logLevel;

  virtual_gamepad_hub_extended = (function() {
    function virtual_gamepad_hub_extended() {
      var i, j;
      this.gamepads = [];
      for (i = j = 0; j <= 7; i = ++j) {
        this.gamepads[i] = void 0;
      }
    }

    virtual_gamepad_hub_extended.prototype.connectGamepad = function(callback) {
      var freeSlot, padId;
      padId = 0;
      freeSlot = false;
      while (!freeSlot && padId < 8) {
        if (!this.gamepads[padId]) {
          freeSlot = true;
        } else {
          padId++;
        }
      }
      if (!freeSlot) {
        winston.log('warning', "Couldn't add new Gamepad: no slot left.");
        return callback(-1);
      } else {
        winston.log('info', 'Gamepad number', padId);
        this.gamepads[padId] = new gamepad();
        return this.gamepads[padId].connect(function() {
          return callback(padId);
        }, function(err) {
          return callback(-1);
        });
      }
    };

    virtual_gamepad_hub_extended.prototype.disconnectGamepad = function(padId, callback) {
      if (this.gamepads[padId]) {
        return this.gamepads[padId].disconnect((function(_this) {
          return function() {
            _this.gamepads[padId] = void 0;
            return callback();
          };
        })(this));
      }
    };

    virtual_gamepad_hub_extended.prototype.sendEvent = function(padId, event) {
      if (this.gamepads[padId]) {
        return this.gamepads[padId].sendEvent(event);
      }
    };

    return virtual_gamepad_hub_extended;

  })();

  module.exports = virtual_gamepad_hub_extended;

}).call(this);
