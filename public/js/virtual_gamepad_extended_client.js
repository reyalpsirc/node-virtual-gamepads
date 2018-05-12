/*************************
 INITIALIZE SLOT INDICATOR
 ************************/
var indicatorOn;
var slotNumber;
var initSlotIndicator = function () {
    indicatorOn = false;
    var slotAnimationLoop = function () {
        if (slotNumber != undefined) {
            $("#slotIndicator").text(slotNumber+1)
        } else {
            if(indicatorOn) {
                $("#slotIndicator").text("Loading")
            } else {
                $("#slotIndicator").text("")
            }
            indicatorOn = !indicatorOn;
            setTimeout(slotAnimationLoop, 500);
        }
    }
    slotAnimationLoop();
}

/**********************
 HAPTIC CALLBACK METHOD
 *********************/
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
var hapticCallback = function () {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
};

var invokeButton = function(code, enabled) {
    if (code === "left" || code === "right" || code === "up" || code === "down"){
        code = "none"
    }
    switch (code) {
        case "left" :
            socket.emit("padEvent", {type: 0x03, code: 0x00, value: 0});
            socket.emit("padEvent", {type: 0x03, code: 0x01, value: 127});
            break;
        case "right" :
            socket.emit("padEvent", {type: 0x03, code: 0x00, value: 255});
            socket.emit("padEvent", {type: 0x03, code: 0x01, value: 127});
            break;
        case "up" :
            socket.emit("padEvent", {type: 0x03, code: 0x00, value: 127});
            socket.emit("padEvent", {type: 0x03, code: 0x01, value: 0});
            break;
        case "down" :
            socket.emit("padEvent", {type: 0x03, code: 0x00, value: 127});
            socket.emit("padEvent", {type: 0x03, code: 0x01, value: 255});
            break;
        case "none" :
            socket.emit("padEvent", {type: 0x03, code: 0x00, value: 127});
            socket.emit("padEvent", {type: 0x03, code: 0x01, value: 127});
            break;
        default :
            socket.emit("padExEvent", {type: 0x01, code: $(this).data("code"), value: enabled ? 1 : 0});
            break;
    }
}

/****************
 MAIN ENTRY POINT
 ***************/
$( window ).load(function() {
    initSlotIndicator();

    var socket = io();

    socket.on("gamepadExConnected", function(data) {
        slotNumber = data.padId;

        $(".g1, .g2").off("touchstart touchend");
        setDirection = function(){};

        $(".g1, .g2").on("touchstart", function() {
            var btn = $(this)
            invokeButton($(this).data("code"), true)
            hapticCallback();
        });

        $(".g1, .g2").on("touchend", function() {
            var btn = $(this)
            invokeButton($(this).data("code"), false)
            //hapticCallback();
        });

    });

    socket.on("connect", function() {
        socket.emit("connectGamepadEx", null);
    });

    socket.on("disconnect", function() {
        location.reload();
    });
} );