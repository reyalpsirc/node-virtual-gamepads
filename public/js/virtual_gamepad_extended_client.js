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

/****************
 MAIN ENTRY POINT
 ***************/
$( window ).load(function() {
    initSlotIndicator();

    $("#type_1").on("click", function() {
        var btn = $(this)
        if (btn.hasClass("one_active")) {
            btn.removeClass("one_active").addClass("two_active").text("Mode 2")
            $("#leftPad").show()
        } else {
            btn.removeClass("two_active").addClass("one_active").text("Mode 1")
            $("#leftPad").hide()
        }
        hapticCallback();
    });

    $("#type_2").on("click", function() {
        var btn = $(this)
        if (btn.hasClass("one_active")) {
            btn.removeClass("one_active").addClass("two_active").text("Mode 2")
            $("#rightPad").show()
        } else {
            btn.removeClass("two_active").addClass("one_active").text("Mode 1")
            $("#rightPad").hide()
        }
        hapticCallback();
    });

    var getCodes = function (extra) {
        let data = {code1: 0x00, code2: 0x01}
        if (extra === "leftPad") {
            data = {code1: 0x10, code2: 0x11}
        } else if (extra === "rightPad") {
            data = {code1: 0x03, code2: 0x04}
        }
        return data
    }

    var invokeButton = function (code, enabled, extra) {
        if (!enabled && (code === "left" || code === "right" || code === "up" || code === "down")) {
            code = "none"
        }
        let axisCodes = getCodes(extra)
        switch (code) {
            case "left":
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code1, value: 0 });
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code2, value: 127 });
                break;
            case "right":
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code1, value: 255 });
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code2, value: 127 });
                break;
            case "up":
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code1, value: 127 });
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code2, value: 0 });
                break;
            case "down":
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code1, value: 127 });
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code2, value: 255 });
                break;
            case "none":
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code1, value: 127 });
                socket.emit("padExEvent", { type: 0x03, code: axisCodes.code2, value: 127 });
                break;
            default:
                socket.emit("padExEvent", { type: 0x01, code: code, value: enabled ? 1 : 0 });
                break;
        }
    }

    var socket = io();

    socket.on("gamepadExConnected", function(data) {
        slotNumber = data.padId;

        $(".g1, .g2, .g3").off("touchstart touchend");
        setDirection = function(){};

        $(".g1, .g2, .g3").on("touchstart", function() {
            var btn = $(this)
            invokeButton($(this).data("code"), true, $(this).data("extra"))
            hapticCallback();
        });

        $(".g1, .g2, .g3").on("touchend", function() {
            var btn = $(this)
            invokeButton($(this).data("code"), false, $(this).data("extra"))
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