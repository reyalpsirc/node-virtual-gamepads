// Generated by CoffeeScript 1.9.3

/*
Created by MIROOF on 04/03/2015
Virtual gamepad application
 */

(function() {
  var app, config, express, gamepad_extended_hub, gamepad_hub, gp_ex_hub, gp_hub, http, io, kb_hub, keyboard_hub, path, port, suffix, touchpad_hub, tp_hub, winston;

  path = require('path');

  express = require('express');

  app = express();

  http = require('http').Server(app);

  io = require('socket.io')(http);

  config = require('./config.json');

  winston = require('winston');

  winston.level = config.logLevel;

  gamepad_extended_hub = require('./app/virtual_gamepad_extended_hub');

  gp_ex_hub = new gamepad_extended_hub();

  gamepad_hub = require('./app/virtual_gamepad_hub');

  gp_hub = new gamepad_hub();

  keyboard_hub = require('./app/virtual_keyboard_hub');

  kb_hub = new keyboard_hub();

  touchpad_hub = require('./app/virtual_touchpad_hub');

  tp_hub = new touchpad_hub();

  port = process.env.PORT || config.port;

  if (config.analog) {
    suffix = '?analog';
  } else {
    suffix = '';
  }

  app.get('/', function(req, res) {
    if (config.useGamepadByDefault) {
      return res.redirect('gamepad.html' + suffix);
    } else {
      return res.redirect('index.html' + suffix);
    }
  });

  app.use(express["static"](__dirname + '/public'));

  io.on('connection', function(socket) {
    socket.on('disconnect', function() {
      if (socket.gamePadId !== void 0) {
        winston.log('info', 'Gamepad disconnected');
        return gp_hub.disconnectGamepad(socket.gamePadId, function() {});
      } else if (socket.keyBoardId !== void 0) {
        winston.log('info', 'Keyboard disconnected');
        return kb_hub.disconnectKeyboard(socket.keyBoardId, function() {});
      } else if (socket.touchpadId !== void 0) {
        winston.log('info', 'Touchpad disconnected');
        return tp_hub.disconnectTouchpad(socket.touchpadId, function() {});
      } else if (socket.gamePadExId !== void 0) {
        winston.log('info', 'Gamepad X disconnected');
        return gp_ex_hub.disconnectGamepad(socket.gamePadExId, function() {});
      } else {
        return winston.log('info', 'Unknown disconnect');
      }
    });
    socket.on('connectGamepadEx', function() {
      return gp_ex_hub.connectGamepad(function(gamePadExId) {
        if (gamePadExId !== -1) {
          winston.log('info', 'Gamepad X connected');
          socket.gamePadExId = gamePadExId;
          return socket.emit('gamepadExConnected', {
            padId: gamePadExId
          });
        } else {
          return winston.log('info', 'Gamepad X connect failed');
        }
      });
    });
    socket.on('connectGamepad', function() {
      return gp_hub.connectGamepad(function(gamePadId) {
        if (gamePadId !== -1) {
          winston.log('info', 'Gamepad connected');
          socket.gamePadId = gamePadId;
          return socket.emit('gamepadConnected', {
            padId: gamePadId
          });
        } else {
          return winston.log('info', 'Gamepad connect failed');
        }
      });
    });
    socket.on('padExEvent', function(data) {
      winston.log('debug', 'Pad X event', data);
      if (socket.gamePadExId !== void 0 && data) {
        return gp_ex_hub.sendEvent(socket.gamePadExId, data);
      }
    });
    socket.on('padEvent', function(data) {
      winston.log('debug', 'Pad event', data);
      if (socket.gamePadId !== void 0 && data) {
        return gp_hub.sendEvent(socket.gamePadId, data);
      }
    });
    socket.on('connectKeyboard', function() {
      return kb_hub.connectKeyboard(function(keyBoardId) {
        if (keyBoardId !== -1) {
          winston.log('info', 'Keyboard connected');
          socket.keyBoardId = keyBoardId;
          return socket.emit('keyboardConnected', {
            boardId: keyBoardId
          });
        } else {
          return winston.log('info', 'Keyboard connect failed');
        }
      });
    });
    socket.on('boardEvent', function(data) {
      winston.log('debug', 'Board event', data);
      if (socket.keyBoardId !== void 0 && data) {
        return kb_hub.sendEvent(socket.keyBoardId, data);
      }
    });
    socket.on('connectTouchpad', function() {
      return tp_hub.connectTouchpad(function(touchpadId) {
        if (touchpadId !== -1) {
          winston.log('info', 'Touchpad connected');
          socket.touchpadId = touchpadId;
          return socket.emit('touchpadConnected', {
            touchpadId: touchpadId
          });
        } else {
          return winston.log('info', 'Touchpad connect failed');
        }
      });
    });
    return socket.on('touchpadEvent', function(data) {
      winston.log('debug', 'Touchpad event', data);
      if (socket.touchpadId !== void 0 && data) {
        return tp_hub.sendEvent(socket.touchpadId, data);
      }
    });
  });

  http.on('error', function(err) {
    if (err.hasOwnProperty('errno')) {
      switch (err.errno) {
        case "EACCES":
          winston.log('error', "You don't have permissions to open port", port, ".", "For ports smaller than 1024, you need root privileges.");
      }
    }
    throw err;
  });

  http.listen(port, function() {
    return winston.log('info', "Listening on " + port);
  });

}).call(this);
